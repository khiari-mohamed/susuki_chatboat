import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SessionService } from './session.service';
import { ClarificationService } from './clarification.service';
import { ContextService } from './context.service';
import { ResponseService } from './response.service';
import { SearchService } from './search.service';
import { IntelligenceService } from '../chat/intelligence.service';
import { OpenAIService } from '../chat/openai.service';
import { AIQueryNormalizerService } from './ai-query-normalizer.service';
import { AdvancedSearchService } from '../chat/advanced-search.service';
import type { VehicleSearchScope } from '../chat/advanced-search.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import {
  extractRequestedPositions,
  getCatalogPositions,
  hasAnyPosition,
  isColorToken,
  isFillerToken,
  isPositionToken,
  normalizeForMatch,
  positionsSatisfy,
  stripColorTokens,
  tokenizeName,
} from '../chat/part-constraints';
import type { ConstraintOutcome, PositionRequest } from '../chat/part-constraints';
import {
  checkResponseAgainstCatalog,
  publicPrice,
  verifyProductAgainstCatalog,
} from '../chat/catalog-verifier';
import { hasKnownStock, isQuantityAvailable } from '../constants/business-rules.constants';
import { AdaptiveDecisionEngine } from '../chat/adaptive-decision-engine';
import type {
  AiFlag,
  AiFlagType,
  CheckStatus,
  ProductVerification,
  VerifierInterpretation,
} from '../chat/catalog-verifier';
import type {
  CompatiblePartCandidate,
  StructuredQueryInterpretation,
} from './ai-query-normalizer.service';

export interface ProcessMessageResponse {
  response: string;
  sessionId: string;
  products: any[];
  confidence: string;
  confidenceScore?: number;
  suggestions?: string[];
  intent: string;
  metadata: {
    productsFound: number;
    conversationLength: number;
    queryClarity: number;
    duration?: number;
    userMessageId?: string;
    error?: string;
    verification?: AnswerVerification;
    trace?: AnswerTrace;
    redirectedToCounter?: boolean;
  };
}

export interface AnswerTrace {
  identifiedPart: string | null;
  modelCode: string | null;
  proposedReferences: { reference: string; designation: string }[];
}

export interface AnswerVerification {
  compatibility: 'CONFIRMEE' | 'NON_CONFORME' | 'NON_VERIFIEE';
  checks: {
    identity: CheckStatus;
    position: CheckStatus;
    qualifiers: CheckStatus;
    vehicle: CheckStatus;
    stockPrice: CheckStatus;
  };
  reasons: string[];
  aiAudit: 'ran' | 'unavailable' | 'skipped';
  aiFlags: { effective: AiFlag[]; ignored: AiFlag[] };
}

interface VerifiedAnswer {
  accepted: boolean;
  response: string;
  products: any[];
  verification: AnswerVerification;
  trace: AnswerTrace;
}

@Injectable()
export class ChatOrchestratorService implements OnModuleDestroy {
  private readonly logger = new Logger(ChatOrchestratorService.name);
  private adaptiveDecisionEngine?: AdaptiveDecisionEngine;
  private readonly cleanupTimer: NodeJS.Timeout;
  constructor(
    private sessionService: SessionService,
    private clarificationService: ClarificationService,
    private contextService: ContextService,
    private responseService: ResponseService,
    private searchService: SearchService,
    private intelligenceService: IntelligenceService,
    private openaiService: OpenAIService,
    private aiNormalizer: AIQueryNormalizerService,
    private advancedSearch: AdvancedSearchService,
    private vehicleModels: VehicleModelsService,
    private synonymsService: SynonymsService,
  ) {
    this.cleanupTimer = setInterval(() => {
      this.clarificationService.cleanup();
      this.contextService.cleanup();
    }, 300000);
  }

  onModuleDestroy(): void {
    clearInterval(this.cleanupTimer);
  }

  /**
   * Every bot message carries the part currently in context (`metadata.part`).
   * ContextService.get() reads it back after a restart, when the in-memory
   * state is empty, so follow-ups like "et le stock ?" keep their part.
   */
  private async saveBot(
    sessionId: string,
    response: string,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    const part = this.contextService.getLastPart(sessionId);
    await this.sessionService.saveBotResponse(
      sessionId,
      response,
      part ? { ...metadata, part } : metadata,
    );
  }

  private formatStock(stock: any): {
    statut: string;
    totalQuantity: number;
    stockDisponible: number;
    stockConsolide: number;
  } | null {
    // Unknown stock is not zero: never expose a fake "Indisponible".
    if (!hasKnownStock(stock)) return null;
    const totalQuantity = Number(stock?.totalQuantity ?? stock?.total_quantity ?? 0);
    const stockDisponible = Number(stock?.stockDisponible ?? stock?.stock_disponible ?? 0);
    const stockConsolide = Number(stock.stockConsolide ?? stock.stock_consolide);

    return {
      statut: isQuantityAvailable(stockConsolide) ? 'Disponible' : 'Indisponible',
      totalQuantity,
      stockDisponible,
      stockConsolide,
    };
  }

  private mapProductForResponse(p: any): any {
    const frenchOrEnglish =
      (p.designation2 ?? p.designation_2 ?? '').trim() ||
      (p.designation ?? '').trim();
    const displayName = p.displayName ?? frenchOrEnglish;

    return {
      id:           p.id,
      // ★ Primary display field — French name when available
      designation:  displayName,
      // Raw fields for debugging / future use
      designationOem: p.designation,
      designation2:   p.designation2 ?? p.designation_2 ?? null,
      searchDescription: p.searchDescription ?? p.search_description ?? null,
      reference:    p.reference,
      prixHt:       p.prixHt != null ? String(p.prixHt) : null,
      prixTtc:      p.source === '01_PROD' && p.prixTtc != null ? String(p.prixTtc) : null,
      unite:        p.unite ?? null,
      categorie:    p.categorie ?? null,
      fabricant:        p.fabricant        ?? null,
      fournisseurCode:  p.fournisseurCode  ?? null,
      source:       p.source ?? null,
      sourceLabel:  p.sourceLabel ?? (p.source === '02_CARPRO' ? 'CarPro Parts' : p.source === '01_PROD' ? 'Suzuki OEM' : null),
      stock: this.formatStock(p.stock),
      fitments: (p.fitments ?? []).map((f: any) => ({
        modelName: f.modelName ?? '',
        typeCode:  f.typeCode  ?? '',
      })),
      itemReferences: (p.itemReferences ?? []).map((r: any) => ({
        referenceNo: r.referenceNo ?? '',
        referenceType: r.referenceType ?? null,
      })),
      identificationSource: p.identificationSource ?? null,
      // Carry the internal relevance score through for debug visibility.
      score: p.score ?? undefined,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: Get the effective text to use for text-based filtering.
  // Returns designation_2 (French) if available, else designation.
  // ─────────────────────────────────────────────────────────────────
  private getEffectiveText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    return french.length > 0 ? french : english;
  }

  // Returns BOTH fields combined so filters check either language
  private getCombinedText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    if (french.toLowerCase() === english.toLowerCase()) return french;
    return `${french} ${english}`.trim();
  }


  // FIX 2026-09-20: single shared position reader (part-constraints.ts).
  // The old regexes read "BOUGIE D'ALLUMAGE" as droite and mixed French and
  // English text.
  private getPositionFlags(p: any): {
    hasAvant: boolean;
    hasArriere: boolean;
    hasGauche: boolean;
    hasDroite: boolean;
  } {
    const actual = getCatalogPositions(p);
    return {
      hasAvant:   actual.axes.includes('AV'),
      hasArriere: actual.axes.includes('AR'),
      hasGauche:  actual.sides.includes('G'),
      hasDroite:  actual.sides.includes('D'),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  private isFilterOperation(message: string): boolean {
    const lower = message.toLowerCase();
    const isCarPart = this.synonymsService.isKnownAutomotiveTerm(lower);
    if (isCarPart) return false;

    const filterPhrases = [
      'appliquer un filtre', 'ajoute un filtre', 'mettre un filtre',
      'filtre pour', 'filtre sur', 'ne montrer que', 'seulement',
      'filtrer', 'tri par', 'trier',
    ];
    return filterPhrases.some((phrase) => lower.includes(phrase));
  }

  private parseFilter(message: string): PositionRequest | null {
    const requested = extractRequestedPositions(message);
    return hasAnyPosition(requested) ? requested : null;
  }

  // FIX-3 + FIX-8: applyFilters checks BOTH text fields, French-priority
  private applyFilters(products: any[], filters: any[]): any[] {
    if (!filters || filters.length === 0) return products;

    return products.filter((product) =>
      filters.every((filter) => positionsSatisfy(filter, getCatalogPositions(product))),
    );
  }

  private async answerFromVerifiedProducts(options: {
    message: string;
    interpretation: StructuredQueryInterpretation;
    vehicle: any;
    products: any[];
    scope?: VehicleSearchScope | null;
    constraint?: ConstraintOutcome | null;
    identityMode?: ConstraintOutcome['identityMode'];
    requireVehicleScope?: boolean;
    build: (shownProducts: any[]) => string;
    requireUnderstanding?: boolean;
    chooseProduct?: (products: any[]) => any;
  }): Promise<VerifiedAnswer> {
    const { message, interpretation, vehicle } = options;
    let modelCode: string | null = null;
    const buildTrace = (products: any[] = []): AnswerTrace => ({
      identifiedPart: interpretation.catalogPart ?? null,
      modelCode,
      proposedReferences: products.slice(0, 5).map((product) => ({
        reference: product.reference,
        designation: this.getEffectiveText(product),
      })),
    });
    const noChecks: AnswerVerification['checks'] = {
      identity: 'not-applicable', position: 'not-applicable', qualifiers: 'not-applicable',
      vehicle: 'not-applicable', stockPrice: 'not-applicable',
    };
    const withheld = (
      reasons: string[],
      partial: Partial<AnswerVerification> = {},
    ): VerifiedAnswer => {
      this.logger.warn(
        `[VERIFY] Answer withheld: ${reasons.join(' | ') || 'unspecified'} || ` +
        `catalogPart=${interpretation.catalogPart ?? 'null'} source=${interpretation.source ?? '?'} ` +
        `confidence=${interpretation.confidence} normalized="${String(interpretation.normalized).slice(0, 120)}" ` +
        `qualifiers=${JSON.stringify(interpretation.qualifiers ?? [])} ` +
        `requestedPart="${options.constraint?.requestedPart ?? ''}" identityMode=${options.constraint?.identityMode ?? 'none'} ` +
        `candidates=${options.products?.length ?? 0}`,
      );
      return {
        accepted: false,
        response: this.responseService.buildSecurisationResponse(vehicle),
        products: [],
        verification: {
          compatibility: 'NON_VERIFIEE', checks: noChecks, reasons,
          aiAudit: 'skipped', aiFlags: { effective: [], ignored: [] }, ...partial,
        },
        trace: buildTrace(),
      };
    };

    const seenReferences = new Set<string>();
    const candidates = (options.products ?? []).filter((product) => {
      if (typeof product?.reference !== 'string' || !product.reference.trim()) return false;
      const key = product.reference.trim().toUpperCase();
      if (seenReferences.has(key)) return false;
      seenReferences.add(key);
      return true;
    });
    if (candidates.length === 0) return withheld(['no DB candidate']);
    const vinScoped = !!(
      vehicle?.vin || vehicle?.VIN || vehicle?.numeroChassis || vehicle?.numChassis || vehicle?.chassis
    );
    const vehicleScoped = !!(
      vinScoped || vehicle?.vehicleNo || vehicle?.vehicle_no || vehicle?.numeroVehicule ||
      vehicle?.modele || vehicle?.model || vehicle?.typeCode || vehicle?.type_code || vehicle?.type
    );
    const resolvedVehicleScope = options.scope !== undefined
      ? options.scope
      : vehicleScoped
        ? await this.advancedSearch.resolveVehicleScope(vehicle)
        : null;
    const compatibleTypeCodes = resolvedVehicleScope?.typeCodes ?? [];
    modelCode = resolvedVehicleScope?.primaryTypeCodes[0] ?? null;
    const vehicleModelResolved = !vehicleScoped || (
      compatibleTypeCodes.length > 0 &&
      (!vinScoped || resolvedVehicleScope?.typeCodeSource !== 'model-map')
    );
    const scope = { scoped: vehicleScoped, compatibleTypeCodes };
    const constrainedPart = options.constraint?.requestedPart?.trim() ?? '';
    const constrainedPartHead = constrainedPart.split(/\s+/)[0] || null;
    const vehicleWords = new Set(
      [
        vehicle?.marque,
        vehicle?.modele,
        vehicle?.model,
        vehicle?.modeleDescription,
        vehicle?.modelDescription,
      ]
        .filter((value): value is string => typeof value === 'string')
        .flatMap((value) => tokenizeName(value)),
    );
    const verifierInterpretation: VerifierInterpretation = {
      catalogPart: interpretation.catalogPart || constrainedPartHead,
      catalogAliases: [...new Set([
        ...(interpretation.catalogAliases ?? []),
        ...(constrainedPart ? [constrainedPart] : []),
        ...(constrainedPartHead ? [constrainedPartHead] : []),
      ])],
      positions: this.toPositionRequest(interpretation.positions),
      // Qualifiers only matter for words the identity phrase does not already cover.
      qualifiers: (interpretation.qualifiers ?? []).filter((qualifier) => {
        const typed = new Set(tokenizeName(options.message));
        const coveredWords = tokenizeName(constrainedPart).filter((word) =>
          !isFillerToken(word) && !isColorToken(word));
        const covered = new Set(coveredWords);
        const coveredText = coveredWords.join('');
        const words = tokenizeName(qualifier).filter((word) =>
          !isFillerToken(word) && !isColorToken(word) && !vehicleWords.has(word));
        const isCovered = words.every((word) => covered.has(word)) ||
          coveredText.includes(words.join(''));
        if (words.length === 0 || isCovered) return false;
        return words.length > 0 && words.every((word) => typed.has(word));
      }),
      identityMode: options.constraint?.identityMode ?? options.identityMode,
    };
    const checked = candidates.map((product) => ({
      product,
      verification: verifyProductAgainstCatalog(product, verifierInterpretation, scope),
    }));

    const hasConfirmedQualifierSibling = checked.some(
      ({ verification }) =>
        verification.identity === 'confirmed' &&
        verification.qualifiers === 'confirmed' &&
        (verification.vehicle === 'confirmed' || verification.vehicle === 'not-applicable'),
    );
    if (hasConfirmedQualifierSibling) {
      for (const { verification } of checked) {
        if (
          verification.identity !== 'confirmed' ||
          (verification.vehicle !== 'confirmed' && verification.vehicle !== 'not-applicable') ||
          verification.qualifiers !== 'unverifiable'
        ) continue;
        verification.qualifiers = 'failed';
        verification.verified = false;
        verification.issues.push('qualifiers: a sibling article confirms the requested qualifier, but this article does not');
      }
    }
    const requestedModel = this.vehicleModels?.normalize?.(vehicle?.modele ?? vehicle?.model);
    if (requestedModel) {
      for (const candidate of checked) {
        const hasFitmentEvidence = (candidate.product.fitments ?? []).some((fitment: any) => fitment?.typeCode);
        if (hasFitmentEvidence) continue;

        const designation = [candidate.product.designation2, candidate.product.designation_2, candidate.product.designation]
          .filter(Boolean)
          .join(' ');
        if (
          this.vehicleModels.hasModelInDesignation(designation) &&
          !this.vehicleModels.matchesModel(designation, requestedModel)
        ) {
          candidate.verification.vehicle = 'failed';
          candidate.verification.verified = false;
          candidate.verification.issues.push('vehicle: designation identifies a different model and no fitment row is available');
        }
      }
    }
    const decisionEngine = this.adaptiveDecisionEngine ??= new AdaptiveDecisionEngine();
    const candidateDecision = (product: any, verification: ProductVerification) => decisionEngine.evaluate({
      requireUnderstanding: options.requireUnderstanding ?? true,
      allowLowUnderstandingToJudge: false,
      requireVehicleScope: options.requireVehicleScope ?? false,
      query: message,
      vehicle,
      selectedProduct: product,
      interpretation,
      vehicleModelResolved,
      deterministicChecks: {
        identity: verification.identity,
        position: verification.position,
        qualifiers: verification.qualifiers,
        vehicle: verification.vehicle,
        stockPrice: 'not-applicable',
      },
      aiFlags: [],
      constraintOutcome: options.constraint ?? null,
      unresolvedClarification: false,
    });
    const eligibleCandidates = checked.filter(({ product, verification }) =>
      candidateDecision(product, verification).allowed,
    );
    if (eligibleCandidates.length === 0) {
      const rejected = checked[0];
      const decision = candidateDecision(rejected.product, rejected.verification);
      const reasons = [...decision.reasons, ...rejected.verification.issues];
      const compatibility = rejected.verification.vehicle === 'failed' ? 'NON_CONFORME' : 'NON_VERIFIEE';
      return withheld(reasons.length ? reasons : ['no candidate passed adaptive verification'], {
        compatibility,
        checks: {
          identity: rejected.verification.identity,
          position: rejected.verification.position,
          qualifiers: rejected.verification.qualifiers,
          vehicle: rejected.verification.vehicle,
          stockPrice: 'not-applicable',
        },
        reasons,
        aiFlags: decision.aiFlags,
      });
    }

    const confirmedChecks = (verification: ProductVerification) =>
      [verification.identity, verification.position, verification.qualifiers, verification.vehicle]
        .filter((status) => status === 'confirmed').length;
        // The search score already prefers in-stock rows, but only among equally relevant ones.
    const rankedCandidates = [...eligibleCandidates].sort((a, b) =>
      confirmedChecks(b.verification) - confirmedChecks(a.verification) ||
      (b.product.score ?? 0) - (a.product.score ?? 0),
    );
    const primary = options.chooseProduct?.(rankedCandidates.map(({ product }) => product)) ?? rankedCandidates[0].product;
    const primaryVerification = rankedCandidates.find(({ product }) => product === primary)?.verification
      ?? rankedCandidates[0].verification;
    // CarPro rule: availability must never be stated or implied without a
    // consolidated stock value. No stock row = redirect to the Comptoir.
    if (!hasKnownStock(primary.stock ?? primary)) {
      return withheld(['stock unknown: no consolidated stock value for the proposed article'], {
        compatibility: primaryVerification.vehicle === 'confirmed' ? 'CONFIRMEE'
          : primaryVerification.vehicle === 'failed' ? 'NON_CONFORME' : 'NON_VERIFIEE',
        checks: {
          identity: primaryVerification.identity,
          position: primaryVerification.position,
          qualifiers: primaryVerification.qualifiers,
          vehicle: primaryVerification.vehicle,
          stockPrice: 'not-applicable',
        },
      });
    }
    const shownProducts = [primary];
    const response = options.build(shownProducts);
    const responseCheck = checkResponseAgainstCatalog(response, shownProducts);
    const decisionInput = {
      requireUnderstanding: options.requireUnderstanding ?? true,
      allowLowUnderstandingToJudge: false,
      requireVehicleScope: options.requireVehicleScope ?? false,
      query: message,
      vehicle,
      selectedProduct: primary,
      interpretation,
      vehicleModelResolved,
      deterministicChecks: {
        identity: primaryVerification.identity,
        position: primaryVerification.position,
        qualifiers: primaryVerification.qualifiers,
        vehicle: primaryVerification.vehicle,
        stockPrice: responseCheck.status,
      },
      constraintOutcome: options.constraint ?? null,
      unresolvedClarification: false,
    };
    const verificationFor = (
      aiAudit: AnswerVerification['aiAudit'],
      reasons: string[],
      aiFlags: AnswerVerification['aiFlags'],
      stockPrice: CheckStatus,
    ): AnswerVerification => ({
      compatibility: primaryVerification.vehicle === 'confirmed' ? 'CONFIRMEE'
        : primaryVerification.vehicle === 'failed' ? 'NON_CONFORME' : 'NON_VERIFIEE',
      checks: {
        identity: primaryVerification.identity,
        position: primaryVerification.position,
        qualifiers: primaryVerification.qualifiers,
        vehicle: primaryVerification.vehicle,
        stockPrice,
      },
      reasons, aiAudit, aiFlags,
    });
    const baseDecision = decisionEngine.evaluate({ ...decisionInput, aiFlags: [] });
    if (!baseDecision.allowed) {
      const reasons = responseCheck.status === 'failed' ? responseCheck.issues : baseDecision.reasons;
      return withheld(reasons, verificationFor('skipped', reasons, baseDecision.aiFlags, responseCheck.status));
    }

    const aiAudit = await this.flagInconsistencies(
      message,
      interpretation,
      vehicle,
      response,
      shownProducts.map((product) => ({
        product,
        verification: { ...primaryVerification, stockPrice: responseCheck.status },
      })),
      compatibleTypeCodes,
    );
    const adaptiveDecision = decisionEngine.evaluate({
      ...decisionInput,
      aiJudgeAvailable: aiAudit.status === 'ran',
      aiFlags: aiAudit.flags,
    });
    if (adaptiveDecision.aiFlags.ignored.length) {
      this.logger.log(`[AI-FLAGS] Ignored because DB checks settled them: ${JSON.stringify(adaptiveDecision.aiFlags.ignored)}`);
    }

    if (!adaptiveDecision.allowed) {
      return withheld(
        adaptiveDecision.reasons,
        verificationFor(aiAudit.status, adaptiveDecision.reasons, adaptiveDecision.aiFlags, responseCheck.status),
      );
    }

    return {
      accepted: true,
      response,
      products: shownProducts,
      verification: verificationFor(aiAudit.status, [], adaptiveDecision.aiFlags, responseCheck.status),
        trace: buildTrace(shownProducts),
    };
  }

  private toPositionRequest(positions?: Partial<PositionRequest> | null): PositionRequest {
    return {
      axes: [...(positions?.axes ?? [])],
      sides: [...(positions?.sides ?? [])],
      levels: [...(positions?.levels ?? [])],
    };
  }

  private hasExplicitPartConcept(message: string): boolean {
    const tunisianMap = this.synonymsService.getTunisianMap?.() ?? {};
    const normalizedLookup = this.synonymsService.getNormalizedLookup?.() ?? {};
    const stopWords = this.synonymsService.getStopWords?.() ?? new Set<string>();

    return tokenizeName(message).some((rawToken) => {
      const token = normalizeForMatch(rawToken);
      const translated = normalizeForMatch(tunisianMap[token] ?? token);
      const canonical = normalizeForMatch(normalizedLookup[translated] ?? translated);
      if (stopWords.has(token) || isFillerToken(canonical) || isPositionToken(canonical) || isColorToken(canonical)) {
        return false;
      }
      return this.synonymsService.isKnownAutomotiveTerm(translated) ||
        this.synonymsService.isKnownAutomotiveTerm(canonical);
    });
  }

  /** Whether the request carries a vehicle at all, and whether a VIN is among its identifiers. */
  private vehicleIdentity(vehicle: any): { scoped: boolean; vinScoped: boolean } {
    const vinScoped = !!(
      vehicle?.vin || vehicle?.VIN || vehicle?.numeroChassis || vehicle?.numChassis || vehicle?.chassis
    );
    const scoped = vinScoped || !!(
      vehicle?.vehicleNo || vehicle?.vehicle_no || vehicle?.numeroVehicule ||
      vehicle?.modele || vehicle?.model || vehicle?.typeCode || vehicle?.type_code || vehicle?.type
    );
    return { scoped, vinScoped };
  }

  private restrictToCompatibleCandidates<T extends { reference?: string }>(
    products: T[],
    compatibleCandidates?: CompatiblePartCandidate[],
  ): T[] {
    if (compatibleCandidates === undefined) return products;
    const allowed = new Set(compatibleCandidates.map((candidate) => candidate.reference.trim().toUpperCase()));
    return products.filter((product) => allowed.has(String(product.reference ?? '').trim().toUpperCase()));
  }

  private async flagInconsistencies(
    message: string,
    interpretation: StructuredQueryInterpretation,
    vehicle: any,
    response: string,
    rows: { product: any; verification: ProductVerification }[],
    compatibleTypeCodes: string[],
  ): Promise<{ status: 'ran' | 'unavailable'; flags: AiFlag[] }> {
    const systemPrompt = `You are a read-only inconsistency detector for a Suzuki parts chatbot. The supplied database rows are the only source of product facts. You cannot approve answers, select or suggest references, confirm vehicle compatibility, override deterministic checks, or write customer-facing text. Compare the customer request and structured interpretation with the shown DB designation and proposed response. Ignore color words and color differences; color is cosmetic and is not a search constraint. Return only concrete suspected semantic inconsistencies. The application will decide using deterministic code; your flags are advisory and may only trigger a more cautious response when deterministic evidence is genuinely inconclusive.
Allowed flag types: PART_IDENTITY, POSITION, QUALIFIER, VEHICLE, PRICE_STOCK. Never flag a fact already confirmed by deterministicChecks. A reference must exactly match one of the supplied DB rows. Return only JSON: {"flags":[{"type":"PART_IDENTITY|POSITION|QUALIFIER|VEHICLE|PRICE_STOCK","reference":"DB reference","detail":"short reason"}]}. Return an empty flags array if there is no concrete concern.`;
    const payload = {
      customerMessage: stripColorTokens(message).replace(/\b[A-HJ-NPR-Z0-9]{17}\b/gi, '[VIN]'),
      interpretation: {
        normalized: stripColorTokens(interpretation.normalized),
        intent: interpretation.intent,
        catalogPart: interpretation.catalogPart,
        catalogAliases: interpretation.catalogAliases ?? [],
        positions: interpretation.positions,
        qualifiers: (interpretation.qualifiers ?? []).map(stripColorTokens).filter(Boolean),
        uncertainty: interpretation.uncertainty,
      },
      vehicle: {
        marque: vehicle?.marque ?? null,
        modele: vehicle?.modele ?? null,
        compatibleTypeCodes,
      },
      databaseRows: rows.map(({ product, verification }) => ({
        reference: product.reference,
        frenchName: stripColorTokens(product.designation2 ?? product.designation_2 ?? ''),
        englishName: stripColorTokens(product.designation ?? ''),
        fitmentTypeCodes: (product.fitments ?? []).map((fitment: any) => fitment.typeCode).filter(Boolean),
        publicPriceTtc: publicPrice(product),
        consolidatedStock: product.stock?.stockConsolide ?? product.stock?.stock_consolide ?? null,
        deterministicChecks: {
          identity: verification.identity,
          position: verification.position,
          qualifiers: verification.qualifiers,
          vehicle: verification.vehicle,
          stockPrice: verification.stockPrice,
        },
      })),
      proposedResponse: stripColorTokens(response),
    };

    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const raw = await Promise.race([
        this.openaiService.completeJson(systemPrompt, JSON.stringify(payload), 180),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => reject(new Error('AI cross-check timeout')), 6000);
        }),
      ]);
      const parsed = JSON.parse(raw);
      const allowedTypes: AiFlagType[] = ['PART_IDENTITY', 'POSITION', 'QUALIFIER', 'VEHICLE', 'PRICE_STOCK'];
      const flags: AiFlag[] = (Array.isArray(parsed?.flags) ? parsed.flags : [])
        .filter((flag: any) => flag && typeof flag === 'object')
        .map((flag: any) => ({
          type: allowedTypes.includes(flag.type) ? flag.type as AiFlagType : 'OTHER',
          reference: typeof flag.reference === 'string' ? flag.reference.trim() : null,
          detail: typeof flag.detail === 'string' ? flag.detail.slice(0, 200) : undefined,
        }));
      return { status: 'ran', flags };
    } catch (error: any) {
      this.logger.warn(`[AI-CROSSCHECK] unavailable; DB verification stands: ${error?.message}`);
      return { status: 'unavailable', flags: [] };
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // MAIN processMessage
  // ─────────────────────────────────────────────────────────────────
  async processMessage(
    rawMessage: string,
    vehicle?: any,
    sessionId?: string,
  ): Promise<ProcessMessageResponse> {
    const startTime = Date.now();
    // Repair typos first: the preflight search, follow-up detection and AI all see the corrected words.
    const message = await this.aiNormalizer.repairTypos(rawMessage, vehicle);

    // Resolve context and vehicle-compatible candidates before interpretation.
    const session = await this.sessionService.getOrCreate(sessionId, vehicle);
    const previousHistory = await this.sessionService.getHistory(session.id);
    const context = await this.contextService.get(session.id);
    const conversationHistory = previousHistory;
    const lastPartFromContext = this.contextService.getLastPart(session.id) ?? context.lastPart;
    const pendingClarification = this.clarificationService.getPending(session.id);
    const isRawClarificationAnswer = !!pendingClarification &&
      this.clarificationService.isAnswer(message, pendingClarification);
    const lastQuery = this.contextService.getLastQuery(session.id);
    const preflightQuery = isRawClarificationAnswer
      ? `${pendingClarification.originalQuery} ${message}`.trim()
      : this.isFilterOperation(message) && lastQuery
        ? lastQuery
        : this.contextService.buildSearchQuery(
            message,
            context,
            this.hasExplicitPartConcept(message),
          );
    const preflightSearch = await this.searchService.searchWithDiagnostics(
      preflightQuery,
      vehicle,
      { validate: false },
    );
    const isReferenceRequest = this.searchService.isReferenceQuery(message);
    const compatibleCandidates: CompatiblePartCandidate[] | undefined = isReferenceRequest
      ? undefined
      : preflightSearch.scope?.active
        ? preflightSearch.products.map((product) => ({
            reference: product.reference,
            designation: product.designation2 || product.designation || product.reference,
          }))
        : [];
    const userMessageId = await this.sessionService.saveUserMessage(session.id, rawMessage);

    const hasVehiclePartRequest = !isReferenceRequest && (
      this.synonymsService.isKnownAutomotiveTerm(preflightQuery) ||
      preflightSearch.products.length > 0 ||
      isRawClarificationAnswer
    );
    const { scoped: preflightScoped, vinScoped: preflightVinScoped } = this.vehicleIdentity(vehicle);
    const preflightGateReasons: string[] = [];
    if (hasVehiclePartRequest && !preflightScoped) {
      preflightGateReasons.push('vehicle scope missing: compatibility cannot be confirmed');
    } else if (hasVehiclePartRequest && !preflightSearch.scope?.active) {
      preflightGateReasons.push(
        preflightVinScoped ? 'model code missing for VIN-scoped request' : 'vehicle compatibility not verified',
      );
    } else if (
      hasVehiclePartRequest && preflightVinScoped &&
      preflightSearch.scope?.typeCodeSource === 'model-map'
    ) {
      preflightGateReasons.push('model code inferred from the model name only, not from the VIN');
    }
    if (preflightGateReasons.length > 0) {
      const response = this.responseService.buildSecurisationResponse(vehicle);
      await this.saveBot(session.id, response, { intent: 'SECURISATION' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'LOW',
        intent: 'SECURISATION',
        metadata: {
          productsFound: 0,
          conversationLength: conversationHistory.length,
          queryClarity: 0,
          userMessageId,
          redirectedToCounter: true,
          verification: {
            compatibility: 'NON_VERIFIEE',
            checks: {
              identity: 'not-applicable',
              position: 'not-applicable',
              qualifiers: 'not-applicable',
              vehicle: 'unverifiable',
              stockPrice: 'not-applicable',
            },
            reasons: preflightGateReasons,
            aiAudit: 'skipped',
            aiFlags: { effective: [], ignored: [] },
          },
        },
      };
    }

    // Interpret only within the designations returned by the vehicle-filtered search.
    const normalized = await this.aiNormalizer.normalizeQuery(
      message,
      previousHistory,
      vehicle,
      compatibleCandidates,
    );
    const processedMessage = normalized.normalized;
    const safeLog = (s: string) => s.replace(/[\r\n\t]/g, ' ').slice(0, 200);
    this.logger.log(`Original: "${safeLog(message)}" → Normalized: "${safeLog(processedMessage)}"`);

    // Handle greetings / thanks
    if (normalized.isGreeting || normalized.isThanks) {
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      // BUGFIX: never short-circuit on greeting if the message also contains a car part name
      const hasCarPart = this.synonymsService.isKnownAutomotiveTerm(processedMessage);
      if (!hasPositionOrAction && !hasCarPart) {
        const response = normalized.isGreeting
          ? this.responseService.buildGreetingResponse()
          : this.responseService.buildThanksResponse();
        await this.saveBot(session.id, response, {
          intent: normalized.isGreeting ? 'GREETING' : 'THANKS',
        });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'HIGH',
          intent:     normalized.isGreeting ? 'GREETING' : 'THANKS',
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId },
        };
      }
    }

    // Model mismatch blocking
    const vehicleModel   = this.vehicleModels?.normalize?.(vehicle?.modele);
    const requestedModel = this.vehicleModels.detectModelInText(processedMessage);
    const isCarPartQuery = this.synonymsService.isKnownAutomotiveTerm(processedMessage);
    const isPriceOrAvailabilityQuery =
      !isCarPartQuery &&
      (/\b(prix|ch7al|combien|cout|tarif|disponible|famma|avoir)\b/i.test(message) ||
       /\b(prix|ch7al|combien|cout|tarif|disponible|famma|avoir)\b/i.test(processedMessage));

    if (!isPriceOrAvailabilityQuery && vehicleModel && requestedModel && vehicleModel !== requestedModel) {
      const response = this.responseService.buildModelMismatchResponse(vehicleModel, requestedModel);
      await this.saveBot(session.id, response, { intent: 'MODEL_MISMATCH' });
      return {
        response,
        sessionId:  session.id,
        products:   [],
        confidence: 'HIGH',
        intent:     'MODEL_MISMATCH',
        metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId },
      };
    }

    // 3. Filter operation check
    if (this.isFilterOperation(processedMessage) || (normalized.intent === 'FILTER' && normalized.confidence >= 0.6)) {
      const lastQuery = this.contextService.getLastQuery(session.id);
      if (!lastQuery) {
        const response = this.responseService.buildNoContextFilterResponse();
        await this.saveBot(session.id, response, { intent: 'FILTER_NO_CONTEXT' });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'HIGH',
          intent:     'FILTER_NO_CONTEXT',
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 },
        };
      }

      const filter = this.parseFilter(processedMessage);
      if (filter) this.contextService.addFilter(session.id, filter);

      const filterSearch = await this.searchService.searchWithDiagnostics(lastQuery, vehicle);
      let products = this.restrictToCompatibleCandidates(filterSearch.products, compatibleCandidates);

      const activeFilters     = this.contextService.getActiveFilters(session.id);
      const filteredProducts  = this.applyFilters(products, activeFilters);

      let response = this.responseService.buildFilteredResponse(filteredProducts, vehicle);
      let productsToReturn: any[] = [];
      let filterIntent = 'FILTER_APPLIED';
      let filterVerification: AnswerVerification | undefined;
      let filterTrace: AnswerTrace | undefined;
      if (filteredProducts.length > 0) {
        const checked = await this.answerFromVerifiedProducts({
          message,
          interpretation: normalized,
          vehicle,
          products: filteredProducts,
          scope: filterSearch.scope,
          constraint: filterSearch.constraint,
          identityMode: filterSearch.constraint?.identityMode,
          requireVehicleScope: true,
          requireUnderstanding: false,
          build: (shown) => this.responseService.buildFilteredResponse(shown, vehicle),
        });
        response = checked.response;
        filterVerification = checked.verification;
        filterTrace = checked.trace;
        if (checked.accepted) productsToReturn = checked.products.map((product) => this.mapProductForResponse(product));
        else filterIntent = 'SECURISATION';
      }
      await this.saveBot(session.id, response, {
        intent: filterIntent,
        productsFound: productsToReturn.length,
      });
      return {
        response,
        sessionId:  session.id,
        products:   productsToReturn,
        confidence: 'HIGH',
        intent:     filterIntent,
        metadata:   { productsFound: filteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0, verification: filterVerification, trace: filterTrace, redirectedToCounter: filterIntent === 'SECURISATION' },
      };
    }

    // 4. Clarification answer handling
    const isPendingClarificationAnswer =
      !!pendingClarification && this.clarificationService.isAnswer(processedMessage, pendingClarification);
    if (pendingClarification && !isPendingClarificationAnswer) {
      this.clarificationService.clearPending(session.id);
      this.logger.log('New request received; cleared the previous pending clarification');
    }

    if (pendingClarification && isPendingClarificationAnswer) {
      const partName = this.extractPartName(pendingClarification.originalQuery);
      this.logger.log(`Clarification answer: "${processedMessage}" for original: "${pendingClarification.originalQuery}"`);

      const isPositionAnswer = /^\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)?\s*$/i.test(message.trim());
      const enrichedQuery    = `${pendingClarification.originalQuery} ${processedMessage}`.trim();
      this.logger.log(`Enriched query: "${enrichedQuery}"`);

      if (pendingClarification.dimension === 'type') {
        this.logger.log(`TYPE clarification — re-searching clarified request: "${enrichedQuery}"`);
      }
      const clarifiedSearch = await this.searchService.searchWithDiagnostics(enrichedQuery, vehicle);
      let products: any[] = this.restrictToCompatibleCandidates(clarifiedSearch.products, compatibleCandidates);
      const clarifiedConstraint: ConstraintOutcome | null = clarifiedSearch.constraint;

      this.clarificationService.clearPending(session.id);
      if (partName) this.contextService.setLastPart(session.id, partName);


      // A type clarification is a hard constraint on the selected variant.
      // Match the answer against catalog words so "Base" cannot fall back to
      // the available but different "Antenne radio" product.
      if (pendingClarification.dimension === 'type') {
        const answerTokens = processedMessage
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .split(/[^a-z0-9]+/)
          .filter((token) => token.length > 1);
        if (answerTokens.length > 0) {
          const typedProducts = products.filter((product) => {
            const catalogTokens = this.getCombinedText(product)
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .split(/[^a-z0-9]+/)
              .filter((token) => token.length > 1);
            return answerTokens.every((token) => catalogTokens.includes(token));
          });
          if (typedProducts.length > 0) products = typedProducts;
        }
      }

      // Position answer refinement
      // FIX-8: French-priority resolution instead of scanning a merged
      // French+English blob — see header comment for full rationale.
      if (isPositionAnswer) {
        products = products.filter((p) => {
          const { hasAvant, hasArriere, hasGauche, hasDroite } = this.getPositionFlags(p);
          const answer = processedMessage.toLowerCase().trim();

          if ((answer === 'avant'   || answer === 'av') && hasArriere && !hasAvant) return false;
          if ((answer === 'arriere' || answer === 'arrière' || answer === 'ar') && hasAvant && !hasArriere) return false;
          if ((answer === 'gauche'  || answer === 'g')  && hasDroite && !hasGauche) return false;
          if ((answer === 'droite'  || answer === 'd'   || answer === 'droit') && hasGauche && !hasDroite) return false;

          if (answer === 'avant'   || answer === 'av')                            return hasAvant;
          if (answer === 'arriere' || answer === 'arrière' || answer === 'ar')    return hasArriere;
          if (answer === 'gauche'  || answer === 'g')                             return hasGauche;
          if (answer === 'droite'  || answer === 'd'   || answer === 'droit')     return hasDroite;

          return true;
        });
      }

      const clarificationCheck = this.clarificationService.checkNeeded(products, enrichedQuery);
      if (clarificationCheck.needed) {
        const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
        this.clarificationService.setPending(session.id, enrichedQuery, clarificationCheck.dimension, products);
        await this.saveBot(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'MEDIUM',
          intent:     'CLARIFICATION_NEEDED',
          metadata:   { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime },
        };
      }

      if (products.length > 0) {
        // FIX-7: selectPrimaryProduct() instead of products.slice(0, 1) —
        // guarantees the card matches the product buildProductResponse()
        // actually described in `response` below, not just whatever
        // happened to sort into index 0 of the raw array.
        const primaryProduct = this.responseService.selectPrimaryProduct(products);

        let response = this.responseService.buildSecurisationResponse(vehicle);
        let resolvedIntent = 'SECURISATION';
        let productToReturn: any = null;
        let clarifiedVerification: AnswerVerification | undefined;
        let clarifiedTrace: AnswerTrace | undefined;
        if (primaryProduct) {
          const clarificationInterpretation = await this.aiNormalizer.normalizeQuery(
            enrichedQuery,
            conversationHistory,
            vehicle,
            compatibleCandidates,
          );
          const checked = await this.answerFromVerifiedProducts({
            message,
            interpretation: clarificationInterpretation,
            vehicle,
            products,
            scope: clarifiedSearch.scope,
            constraint: clarifiedConstraint,
            identityMode: clarifiedConstraint?.identityMode,
            requireVehicleScope: true,
            build: (shown) => this.responseService.buildProductResponse(shown, vehicle),
          });
          response = checked.response;
          clarifiedVerification = checked.verification;
          clarifiedTrace = checked.trace;
          if (checked.accepted) {
            productToReturn = this.mapProductForResponse(checked.products[0]);
            resolvedIntent = 'PARTS_SEARCH';
          }
        }
        if (!productToReturn) {
          this.logger.log('[SECURISATION] Clarified answer withheld by catalog verification');
        }

        await this.saveBot(session.id, response, { intent: resolvedIntent, productsFound: productToReturn ? 1 : 0 });
        return {
          response,
          sessionId:  session.id,
          products:   productToReturn ? [productToReturn] : [],
          confidence: productToReturn ? 'HIGH' : 'LOW',
          intent:     resolvedIntent,
          metadata:   { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10, duration: Date.now() - startTime, verification: clarifiedVerification, trace: clarifiedTrace, redirectedToCounter: resolvedIntent === 'SECURISATION' },
        };
      } else {
        const response = clarifiedConstraint?.noExactMatch
          ? this.responseService.buildNoExactMatchResponse(clarifiedConstraint, vehicle)
          : this.responseService.buildNoResultsResponse(vehicle);
        await this.saveBot(session.id, response, { intent: 'NO_RESULTS' });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'LOW',
          intent:     'NO_RESULTS',
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime },
        };
      }
    }

    // 5. Detect intent
    const fallbackIntent = await this.intelligenceService.detectIntentWithAI(
      processedMessage,
      conversationHistory,
      isPendingClarificationAnswer,
    );
    const intent = normalized.intent !== 'UNKNOWN' && normalized.confidence >= 0.6
      ? { ...fallbackIntent, type: normalized.intent }
      : fallbackIntent;

    const partName = this.extractPartName(processedMessage);
    if (partName) this.contextService.setLastPart(session.id, partName);

    // 6. Non-search intents
    if (intent.type === 'GREETING' || intent.type === 'THANKS') {
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      const hasCarPart = this.synonymsService.isKnownAutomotiveTerm(processedMessage);
      if (!hasPositionOrAction && !hasCarPart) {
        const response = intent.type === 'GREETING'
          ? this.responseService.buildGreetingResponse()
          : this.responseService.buildThanksResponse();
        await this.saveBot(session.id, response, { intent: intent.type });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'HIGH',
          intent:     intent.type,
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId },
        };
      }
    }

    // Diagnostic redirect
    const isDiagnostic = normalized.intent === 'DIAGNOSTIC' || (
      !this.synonymsService.isKnownAutomotiveTerm(processedMessage) &&
      /\b(ne\s+d[eé]marre\s+pas|ne\s+fonctionne\s+pas|bruit|fuite|probleme|problème|panne|defectueux|cass[eé]|voyant|vibration|surchauffe|entretien|maintenance|bizarre|t9allek|ralenti|saccade|perte.*puissance|voiture.*mort|moteur.*fum[eé]e|démarre|démarre pas|démarrer|ne démarre|ne part pas|ne s'allume|caler|cale)\b/i.test(processedMessage)
    );
    if (isDiagnostic) {
      const response = this.responseService.buildDiagnosticRedirectResponse();
      await this.saveBot(session.id, response, { intent: 'DIAGNOSTIC_REDIRECT' });
      return {
        response,
        sessionId:  session.id,
        products:   [],
        confidence: 'HIGH',
        intent:     'DIAGNOSTIC_REDIRECT',
        metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime, userMessageId },
      };
    }

    // Stock check with context
    if (intent.type === 'STOCK_CHECK' && lastPartFromContext) {
      const lastPart = lastPartFromContext;
      const availabilityQuery = `${lastPart} ${vehicle?.modele ?? ''}`.trim();
      const stockSearch = await this.searchService.searchWithDiagnostics(availabilityQuery, vehicle);
      const stockProducts = this.restrictToCompatibleCandidates(stockSearch.products, compatibleCandidates);

      if (stockProducts.length > 0) {
        const stockInterpretation: StructuredQueryInterpretation = {
          ...normalized,
          normalized: availabilityQuery,
          catalogPart: lastPart,
          catalogAliases: this.advancedSearch.getSynonymMap()[lastPart] ?? [],
          positions: extractRequestedPositions(availabilityQuery),
          qualifiers: [],
        };
        const checkedStock = await this.answerFromVerifiedProducts({
          message,
          interpretation: stockInterpretation,
          vehicle,
          products: stockProducts,
          scope: stockSearch.scope,
          constraint: stockSearch.constraint,
          identityMode: stockSearch.constraint?.identityMode,
          requireVehicleScope: true,
          requireUnderstanding: false,
          build: (shown) => this.responseService.buildStockCheckResponse(lastPart, shown[0], vehicle),
        });
        const response = checkedStock.response;
        const stockProductsToReturn = checkedStock.accepted
          ? checkedStock.products.map((product) => this.mapProductForResponse(product))
          : [];
        const stockIntent = checkedStock.accepted ? 'STOCK_CHECK' : 'SECURISATION';
        await this.saveBot(session.id, response, { intent: stockIntent });
        return {
          response,
          sessionId:  session.id,
          products:   stockProductsToReturn,
          confidence: stockIntent === 'STOCK_CHECK' ? 'HIGH' : 'LOW',
          intent:     stockIntent,
          metadata:   { productsFound: stockProductsToReturn.length, conversationLength: conversationHistory.length, queryClarity: 0, verification: checkedStock.verification, trace: checkedStock.trace, redirectedToCounter: stockIntent === 'SECURISATION' },
        };
      }
    }

    if (intent.type === 'COMPLAINT') {
      const response = this.responseService.buildComplaintResponse();
      await this.saveBot(session.id, response, { intent: 'COMPLAINT' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'COMPLAINT', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
    }
    if (intent.type === 'SERVICE_QUESTION') {
      const response = this.responseService.buildServiceQuestionResponse();
      await this.saveBot(session.id, response, { intent: 'SERVICE_QUESTION' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'SERVICE_QUESTION', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
    }

    // 7. Reference search
    if (this.searchService.isReferenceQuery(processedMessage)) {
      const reference  = this.searchService.extractReference(processedMessage);
      const referenceSearch = await this.searchService.searchWithDiagnostics(processedMessage, vehicle);
      const refProducts = referenceSearch.products;

      if (refProducts.length > 0) {
        const checkedReference = await this.answerFromVerifiedProducts({
          message,
          interpretation: normalized,
          vehicle,
          products: refProducts,
          scope: referenceSearch.scope,
          constraint: referenceSearch.constraint,
          requireUnderstanding: false,
          requireVehicleScope: false,
          build: (shown) => this.responseService.buildReferenceResponse(reference, shown[0], vehicle),
        });
        const response = checkedReference.response;
        const referenceProduct = checkedReference.accepted
          ? this.mapProductForResponse(checkedReference.products[0])
          : null;
        const referenceIntent = checkedReference.accepted ? 'PARTS_SEARCH' : 'SECURISATION';
        await this.saveBot(session.id, response, { intent: referenceIntent, productsFound: referenceProduct ? 1 : 0 });
        return {
          response,
          sessionId:  session.id,
          products:   referenceProduct ? [referenceProduct] : [],
          confidence: referenceIntent === 'PARTS_SEARCH' ? 'HIGH' : 'LOW',
          intent:     referenceIntent,
          metadata:   { productsFound: referenceProduct ? 1 : 0, conversationLength: conversationHistory.length, queryClarity: 10, verification: checkedReference.verification, trace: checkedReference.trace, redirectedToCounter: referenceIntent === 'SECURISATION' },
        };
      } else {
        const response = this.responseService.buildReferenceNotFoundResponse(reference, vehicle);
        await this.saveBot(session.id, response, { intent: 'NO_RESULTS' });
        return { response, sessionId: session.id, products: [], confidence: 'LOW', intent: 'NO_RESULTS', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
      }
    }

    // 8. Main search
    // Decide "is this a follow-up?" on the customer's own words first: a lossy rewrite
    // must never turn "combien" into a new part name.
    const rawFollowUp = this.contextService.buildSearchQuery(message, context, this.hasExplicitPartConcept(message));
    const searchQuery = rawFollowUp !== message
      ? rawFollowUp
      : this.contextService.buildSearchQuery(
          processedMessage,
          context,
          this.hasExplicitPartConcept(processedMessage),
        );
    const mainSearch  = await this.searchService.searchWithDiagnostics(searchQuery, vehicle);
    const mainConstraint: ConstraintOutcome | null = mainSearch.constraint;
    let products = this.restrictToCompatibleCandidates(mainSearch.products, compatibleCandidates);

    this.contextService.clearFilters(session.id);
    this.contextService.setLastQuery(session.id, searchQuery);
    if (products.length > 0) {
      const foundPart = this.extractPartName(searchQuery) || this.extractPartName(processedMessage);
      if (foundPart) this.contextService.setLastPart(session.id, foundPart);
    }

    // CarPro rule (email 2026-09-18): the vehicle comes FIRST. If a vehicle was
    // supplied but its model code is missing, or only inferred from the model
    // name for a VIN, redirect now: no clarification question, no candidate.
    const { scoped: gateScoped, vinScoped: gateVinScoped } = this.vehicleIdentity(vehicle);
    const gateScope = mainSearch.scope;
    const gateReasons: string[] = [];
    if (gateScoped && !gateScope?.active) {
      gateReasons.push(gateVinScoped ? 'model code missing for VIN-scoped request' : 'vehicle compatibility not verified');
    } else if (gateVinScoped && gateScope?.typeCodeSource === 'model-map') {
      gateReasons.push('model code inferred from the model name only, not from the VIN');
    }
    if (gateReasons.length > 0) {
      this.logger.warn(`[VEHICLE-GATE] ${gateReasons.join(' | ')}`);
      const response = this.responseService.buildSecurisationResponse(vehicle);
      await this.saveBot(session.id, response, { intent: 'SECURISATION' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'LOW',
        intent: 'SECURISATION',
        metadata: {
          productsFound: products.length,
          conversationLength: conversationHistory.length,
          queryClarity: 0,
          duration: Date.now() - startTime,
          userMessageId,
          redirectedToCounter: true,
          verification: {
            compatibility: 'NON_VERIFIEE',
            checks: {
              identity: 'not-applicable',
              position: 'not-applicable',
              qualifiers: 'not-applicable',
              vehicle: 'unverifiable',
              stockPrice: 'not-applicable',
            },
            reasons: gateReasons,
            aiAudit: 'skipped',
            aiFlags: { effective: [], ignored: [] },
          },
        },
      };
    }

    // Keep search results as candidates; catalog verification and the judge own acceptance.
    const preFilteredProducts = products;

    if (mainSearch.truncated) {
      const response = this.responseService.buildTooBroadResponse();
      await this.saveBot(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'MEDIUM',
        intent: 'CLARIFICATION_NEEDED',
        metadata: {
          productsFound: preFilteredProducts.length,
          conversationLength: conversationHistory.length,
          queryClarity: 0,
          duration: Date.now() - startTime,
          userMessageId,
        },
      };
    }

    if (preFilteredProducts.length === 0 && mainConstraint?.noExactMatch) {
      const response = this.responseService.buildNoExactMatchResponse(mainConstraint, vehicle);
      await this.saveBot(session.id, response, { intent: 'NO_RESULTS' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'LOW',
        intent: 'NO_RESULTS',
        metadata: {
          productsFound: 0,
          conversationLength: conversationHistory.length,
          queryClarity: 0,
          duration: Date.now() - startTime,
          userMessageId,
        },
      };
    }

    const hasVehicleContext = !!(
      vehicle?.vin || vehicle?.VIN || vehicle?.numeroChassis || vehicle?.numChassis || vehicle?.chassis ||
      vehicle?.vehicleNo || vehicle?.vehicle_no || vehicle?.numeroVehicule || vehicle?.modele ||
      vehicle?.model || vehicle?.typeCode || vehicle?.type_code || vehicle?.type
    );
    if (preFilteredProducts.length === 0 && (mainSearch.scope?.active || hasVehicleContext)) {
      const response = this.responseService.buildSecurisationResponse(vehicle);
      await this.saveBot(session.id, response, { intent: 'SECURISATION' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'LOW',
        intent: 'SECURISATION',
        metadata: {
          productsFound: 0,
          conversationLength: conversationHistory.length,
          queryClarity: 0,
          duration: Date.now() - startTime,
          userMessageId,
        },
      };
    }

    // 10. Clarification check
    const clarificationCheck = this.clarificationService.checkNeeded(preFilteredProducts, processedMessage);
    const hasExplicitFilterType = /\b(filtre|filter)\s+(?:de\s+)?(?:habitacle|climatiseur|air|huile|carburant|gazoile|essence)\b/i.test(processedMessage);
    if (clarificationCheck.needed && !hasExplicitFilterType) {
      const clPartName = this.extractPartName(processedMessage);
      const response   = this.clarificationService.buildQuestion(clPartName, clarificationCheck.variants, clarificationCheck.dimension);
      this.clarificationService.setPending(session.id, searchQuery, clarificationCheck.dimension, preFilteredProducts);
      await this.saveBot(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
      return {
        response,
        sessionId:  session.id,
        products:   [],
        confidence: 'MEDIUM',
        intent:     'CLARIFICATION_NEEDED',
        metadata:   { productsFound: preFilteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0 },
      };
    }

    // 11. Build final response
    this.logger.log(`[RESPONSE-BUILD] ${preFilteredProducts.length} products, intent: ${intent.type}`);

    let response: string;
    let resolvedIntent = preFilteredProducts.length > 0 ? 'PARTS_SEARCH' : intent.type;
    const primaryProduct = this.responseService.selectPrimaryProduct(preFilteredProducts);

    if (intent.type === 'PRICE_INQUIRY') {
      response = this.responseService.buildPriceResponse(preFilteredProducts, vehicle);
    } else if (preFilteredProducts.length > 0) {
      response = this.responseService.buildProductResponse(preFilteredProducts, vehicle);
    } else if (mainConstraint?.noExactMatch && products.length === 0) {
      response = this.responseService.buildNoExactMatchResponse(mainConstraint, vehicle);
    } else {
      response = this.responseService.buildNoResultsResponse(vehicle);
    }

    let securedProduct: any = null;
    let mainVerification: AnswerVerification | undefined;
    let mainTrace: AnswerTrace | undefined;
    if (preFilteredProducts.length > 0) {
      const checked = await this.answerFromVerifiedProducts({
        message,
        interpretation: normalized,
        vehicle,
        products: preFilteredProducts,
        scope: mainSearch.scope,
        constraint: mainConstraint,
        identityMode: mainConstraint?.identityMode,
        requireVehicleScope: true,
        build: (shown) => intent.type === 'PRICE_INQUIRY'
          ? this.responseService.buildPriceResponse(shown, vehicle)
          : this.responseService.buildProductResponse(shown, vehicle),
      });
      response = checked.response;
      mainVerification = checked.verification;
      mainTrace = checked.trace;
      if (checked.accepted) securedProduct = checked.products[0];
      else resolvedIntent = 'SECURISATION';
    }

    await this.saveBot(session.id, response, {
      intent: resolvedIntent,
      productsFound: securedProduct ? 1 : 0,
    });

    // 12. Confidence + suggestions
    const queryClarity = this.intelligenceService.analyzeQueryClarity(processedMessage);
    const confidence   = this.intelligenceService.calculateConfidence({
      productsFound:          preFilteredProducts.length,
      exactMatch:             mainVerification?.checks.identity === 'confirmed' && mainVerification.checks.vehicle === 'confirmed',
      conversationContext:    conversationHistory.length,
      userFeedbackHistory:    0,
      queryClarity,
    });
    return {
      response,
      sessionId:      session.id,
      products:       securedProduct ? [this.mapProductForResponse(securedProduct)] : [],
      confidence:     securedProduct ? confidence.level : 'LOW',
      confidenceScore: securedProduct ? confidence.score : 0,
      suggestions:    [],
      intent:         resolvedIntent,
      metadata: {
        productsFound:       preFilteredProducts.length,
        conversationLength:  conversationHistory.length,
        queryClarity,
        duration:            Date.now() - startTime,
        userMessageId,
        verification:        mainVerification,
        trace:               mainTrace,
        redirectedToCounter: ['SECURISATION', 'NO_RESULTS'].includes(resolvedIntent),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: extractPartName — checks both text fields for part names
  // ─────────────────────────────────────────────────────────────────
  private extractPartName(message: string): string {
    const normalizedMessage = normalizeForMatch(message);
    try {
      const synonymMap = this.advancedSearch.getSynonymMap();
      let bestMatch: string | undefined;
      let bestLength  = 0;

      for (const [category, synonyms] of Object.entries(synonymMap)) {
        for (const syn of [category, ...(synonyms as string[])]) {
          const normalizedSynonym = normalizeForMatch(syn);
          if (` ${normalizedMessage} `.includes(` ${normalizedSynonym} `) && normalizedSynonym.length > bestLength) {
            bestLength = normalizedSynonym.length;
            bestMatch  = category;
          }
        }
      }
      return bestMatch || '';
    } catch {
      return '';
    }
  }
}