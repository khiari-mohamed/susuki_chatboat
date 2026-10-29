import { Injectable, Logger } from '@nestjs/common';
import { AdvancedSearchService, extractReferenceCandidate } from '../chat/advanced-search.service';
import type { VehicleSearchScope } from '../chat/advanced-search.service';
import { SearchValidatorService } from './search-validator.service';
import { isQuantityAvailable } from '../constants/business-rules.constants';
import type { ConstraintOutcome } from '../chat/part-constraints';

const QUERY_LOG_LIMIT = 120;

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly advancedSearch: AdvancedSearchService,
    private readonly validator: SearchValidatorService,
  ) {}

  async search(query: string, vehicle?: any): Promise<any[]> {
    return (await this.searchWithDiagnostics(query, vehicle)).products;
  }

  /**
   * Same as search(), plus what the identity/position gate did, so the
   * orchestrator can say "this part only exists in AV / AR" instead of a
   * generic "Indisponible". Products are candidates only: acceptance is
   * decided later by the catalog verifier and the AdaptiveDecisionEngine.
   */
  async searchWithDiagnostics(
    query: string,
    vehicle?: any,
    options: { validate?: boolean } = {},
  ): Promise<{
    products: any[];
    constraint: ConstraintOutcome | null;
    scope: VehicleSearchScope | null;
    truncated: boolean;
  }> {
    const { results, constraint, scope, truncated } = await this.advancedSearch.searchPartsDetailed(query, vehicle);
    this.logger.debug(
      `"${query.slice(0, QUERY_LOG_LIMIT)}" → ${results.length} candidate(s)${truncated ? ' (truncated)' : ''}`,
    );

    if (options.validate !== false) this.validateInBackground(query, results, vehicle);
    return { products: this.annotateAvailability(results), constraint, scope, truncated };
  }

  /** One extractor for detection and extraction, shared with the search engine. */
  isReferenceQuery(message: string): boolean {
    return extractReferenceCandidate(message) !== null;
  }

  extractReference(message: string): string {
    return extractReferenceCandidate(message) ?? message.trim();
  }

  /** Fire-and-forget quality check; it must never fail or slow the search. */
  private validateInBackground(query: string, products: any[], vehicle: any): void {
    try {
      Promise.resolve(this.validator.validateSearch(query, products, vehicle)).catch((err) => {
        this.logger.warn(`Search validation failed: ${err?.message ?? err}`);
      });
    } catch (err: any) {
      this.logger.warn(`Search validation could not start: ${err?.message ?? err}`);
    }
  }

  /** Adds the availability label (never the quantity) using the shared stock rule. */
  private annotateAvailability(products: any[]): any[] {
    if (!Array.isArray(products)) return [];
    return products.map((product) => {
      const available = isQuantityAvailable(product.stock?.stockConsolide ?? product.stock?.stock_consolide);
      return {
        ...product,
        // Prisma Int ids are safe; guard BigInt for serialization.
        id: typeof product.id === 'bigint' ? product.id.toString() : product.id,
        stockStatut: available ? 'Disponible' : 'Indisponible',
        available,
      };
    });
  }
}