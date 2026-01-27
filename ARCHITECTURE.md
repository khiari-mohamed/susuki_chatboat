# 🏗️ System Architecture Documentation

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Layer-by-Layer Breakdown](#layer-by-layer-breakdown)
- [Component Interactions](#component-interactions)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Design Patterns](#design-patterns)
- [Scalability Considerations](#scalability-considerations)

---

## Architecture Overview

The Suzuki AI Chatbot follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                   (React Chat Widget)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│                  (NestJS Controllers)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│                    (NestJS Services)                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    AI/ML SERVICES LAYER                      │
│              (OpenAI, NLP, Search Engines)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│                (PostgreSQL + Prisma ORM)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Breakdown

### 1. Presentation Layer (Frontend)

**Technology**: React 18.2.0 + Webpack 5

**Components**:
```
ChatWidget (Main Component)
├── State Management
│   ├── messages (array)
│   ├── isOpen (boolean)
│   ├── isTyping (boolean)
│   ├── isDark (boolean)
│   ├── isVerified (boolean)
│   ├── vehicleInfo (object)
│   └── uploadedFile (File)
│
├── UI Elements
│   ├── Chat Bubble (floating button)
│   ├── Chat Container (main window)
│   ├── Message List (scrollable)
│   ├── Input Field (text + send button)
│   ├── Quick Actions (button grid)
│   ├── Theme Toggle (dark/light)
│   └── File Upload Zone (drag-drop)
│
└── Modals
    ├── Verification Modal (carte grise upload)
    └── Vehicle Card (vehicle info display)
```

**Key Features**:
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Instant message rendering
- **Local Storage**: Persist chat history and theme
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

**Communication**:
```javascript
// API calls using fetch
fetch(`${config.apiUrl}/chat/message`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, vehicle })
})
```

---

### 2. API Layer (Controllers)

**Technology**: NestJS 11.0.1 + Express

**Controllers**:

#### ChatController
```typescript
@Controller('chat')
export class ChatController {
  @Post('message')           // Process user message
  @Get('analytics')          // Get analytics data
  @Post('feedback')          // Submit user feedback
  @Post('trigger-learning')  // Trigger learning cycle
}
```

#### VerificationController
```typescript
@Controller('verification')
export class VerificationController {
  @Post('upload')  // Upload and verify carte grise
  @UseInterceptors(FileInterceptor('file'))
}
```

#### StockController
```typescript
@Controller('stock')
export class StockController {
  @Post('update')      // Update stock quantity
  @Post('decrement')   // Decrement stock
  @Get(':reference')   // Get stock status
}
```

#### ClientsController
```typescript
@Controller('clients')
export class ClientsController {
  @Post()           // Create client
  @Get()            // List all clients
  @Get(':id')       // Get client by ID
}
```

**Middleware Stack**:
1. **CORS**: Allow frontend origin
2. **Body Parser**: Parse JSON/form-data (25MB limit)
3. **Validation Pipe**: Validate DTOs
4. **Error Handler**: Catch and format errors
5. **Logger**: Log requests and responses

---

### 3. Business Logic Layer (Services)

#### EnhancedChatService (Core Service)

**Responsibilities**:
- Message processing pipeline
- Intent detection
- Context management
- Response generation
- Error handling
- Rate limiting
- Caching

**Message Processing Pipeline**:
```
User Message
    ↓
[1] Rate Limit Check
    ↓
[2] Input Validation
    ↓
[3] Session Management
    ↓
[4] Save User Message
    ↓
[5] Content Validation
    ↓
[6] Prompt Injection Detection
    ↓
[7] Intent Detection
    ↓
[8] Tunisian Normalization
    ↓
[9] Context Building
    ↓
[10] Parts Search
    ↓
[11] AI Response Generation
    ↓
[12] Response Enrichment
    ↓
[13] Save Bot Response
    ↓
[14] Learning Storage
    ↓
Final Response
```

**Key Methods**:

```typescript
// Main entry point
async processMessage(
  message: string,
  vehicle?: any,
  sessionId?: string,
  clientIp?: string
): Promise<ProcessMessageResponse>

// Intent detection with caching
private async detectIntentWithCaching(message: string): Promise<Intent>

// Smart search query builder
private buildSmartSearchQuery(
  message: string,
  conversationHistory: any[],
  vehicle?: any
): string

// AI response generation
private async generateOptimalResponse(
  message: string,
  products: any[],
  vehicle: any,
  conversationHistory: any[],
  intent: any,
  confidence: any,
  similarQueries: any[]
): Promise<string>

// Auto-learning system
async analyzeAndLearnFromConversations(): Promise<void>
```

**Caching Strategy**:
```typescript
private responseCache: Map<string, { data: any; timestamp: number }> = new Map();
private readonly CACHE_TTL = 300000; // 5 minutes

// Cache key generation
private generateCacheKey(message: string, context?: string): string {
  return `${message}::${context || ''}`;
}
```

**Rate Limiting**:
```typescript
private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();
private readonly RATE_LIMIT_REQUESTS = 50;
private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute

private checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const clientData = this.rateLimitMap.get(clientIp);
  
  if (!clientData || now > clientData.resetTime) {
    this.rateLimitMap.set(clientIp, {
      count: 1,
      resetTime: now + this.RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (clientData.count >= this.RATE_LIMIT_REQUESTS) {
    return false;
  }
  
  clientData.count++;
  return true;
}
```

---

### 4. AI/ML Services Layer

#### AdvancedSearchService

**Search Algorithm**:
```
Query Input
    ↓
[1] Reference Pattern Detection
    ↓ (if not reference)
[2] Tunisian Normalization
    ↓
[3] Text Normalization (lowercase, accents)
    ↓
[4] Tokenization (split into words)
    ↓
[5] Synonym Expansion (200+ mappings)
    ↓
[6] Position Detection (avant/arrière/gauche/droite)
    ↓
[7] Database Query (OR conditions)
    ↓
[8] Scoring Algorithm
    ↓
[9] Filtering (minimum score threshold)
    ↓
[10] Sorting (score DESC, stock DESC)
    ↓
Results (top 10)
```

**Scoring Algorithm**:
```typescript
private calculatePartScore(part: any, context: SearchContext): number {
  let score = 0;
  
  // Exact reference match: +1000 points
  if (part.reference === context.normalizedQuery) {
    score += 1000;
  }
  
  // All tokens present: +220 points
  if (allTokensPresent) {
    score += 220;
  }
  
  // Part type match: +150 points (weighted)
  if (designation.includes(mainPartType)) {
    score += 150 * typeWeight;
  }
  
  // Position match: +150 points
  if (positionMatches) {
    score += 150;
  }
  
  // Stock available: +8 points
  if (part.stock > 0) {
    score += 8;
  }
  
  // Vehicle model match: +50 points
  if (vehicleModelMatches) {
    score += 50;
  }
  
  return score;
}
```

**Synonym System**:
```typescript
private readonly synonyms: Record<string, string[]> = {
  filtre: ['filtre', 'filter', 'filtr', 'filtere', 'cartouche'],
  frein: ['frein', 'freinage', 'frain', 'break', 'fren'],
  plaquette: ['plaquette', 'plaquettes', 'plaq', 'pad', 'pads'],
  // ... 200+ more mappings
};
```

#### IntelligenceService

**Intent Detection**:
```typescript
detectIntent(message: string): {
  type: 'SEARCH' | 'PRICE_INQUIRY' | 'STOCK_CHECK' | 'GREETING' | 'COMPLAINT' | 'THANKS' | 'CLARIFICATION_NEEDED';
  confidence: number;
  subIntent?: { location?: string; model?: string; year?: string };
}
```

**Intent Patterns**:
```typescript
// GREETING
if (/^(bonjour|salut|hello|hi|salam)/i.test(message)) {
  return { type: 'GREETING', confidence: 0.95 };
}

// PRICE
if (/prix|combien|cout|price|cost/i.test(message)) {
  return { type: 'PRICE_INQUIRY', confidence: 0.82 };
}

// STOCK
if (/stock|disponible|dispo|available|famma/i.test(message)) {
  return { type: 'STOCK_CHECK', confidence: 0.82 };
}

// Default: SEARCH
return { type: 'SEARCH', confidence: 0.72 };
```

**Confidence Calculation**:
```typescript
calculateConfidence(params: {
  productsFound: number;
  exactMatch: boolean;
  conversationContext: number;
  userFeedbackHistory: number;
  queryClarity: number;
}): { score: number; level: 'HIGH' | 'MEDIUM' | 'LOW' }

// Scoring breakdown:
// - Products found: 0-50 points
// - Conversation context: 0-25 points
// - User feedback: 0-20 points
// - Query clarity: 0-20 points
// - Exact match bonus: +15 points
// Total: 0-100 points

// Levels:
// HIGH: 75-100
// MEDIUM: 50-74
// LOW: 0-49
```

**Similarity Algorithms**:

1. **Semantic Similarity** (TF-IDF + Cosine):
```typescript
private calculateSemanticSimilarity(query1: string, query2: string): number {
  // Jaccard similarity (25%)
  const jaccard = intersection / union;
  
  // Bigram similarity (20%)
  const bigramSim = bigramIntersection / bigramUnion;
  
  // Length ratio (10%)
  const lengthRatio = min / max;
  
  // TF-IDF cosine similarity (45%)
  const cosSim = dotProduct / (magA * magB);
  
  return (jaccard * 0.25) + (bigramSim * 0.2) + (lengthRatio * 0.1) + (cosSim * 0.45);
}
```

2. **Fuzzy Similarity** (Levenshtein):
```typescript
private calculateFuzzySimilarity(query1: string, query2: string): number {
  const distance = levenshteinDistance(query1, query2);
  const normalizedDistance = 1 - (distance / maxLen);
  
  // Prefix match bonus
  let prefixBonus = 0;
  for (const t1 of tokens1) {
    for (const t2 of tokens2) {
      if (t1.startsWith(t2.substring(0, 3))) {
        prefixBonus += 0.05;
      }
    }
  }
  
  return Math.min(normalizedDistance + prefixBonus, 1.0);
}
```

#### OpenAIService

**GPT-4o-mini Integration**:
```typescript
async chat(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  context?: string
): Promise<string> {
  // Build messages array
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: message }
  ];
  
  // Call OpenAI API
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.3,
    max_tokens: 1024,
    top_p: 0.8
  });
  
  return response.data.choices[0].message.content;
}
```

**OCR for Carte Grise**:
```typescript
async extractVehicleInfo(imageBase64: string, mimeType?: string): Promise<any> {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: GEMINI_OCR_PROMPT },
        { type: 'image_url', image_url: { url: imageBase64 } }
      ]
    }],
    temperature: 0.1,
    max_tokens: 2048
  });
  
  // Parse JSON response
  const text = response.data.choices[0].message.content;
  const parsed = JSON.parse(text);
  
  // Validate brand
  if (!parsed.marque.includes('SUZUKI')) {
    throw new Error('INVALID_BRAND');
  }
  
  return parsed;
}
```

**Retry Logic**:
```typescript
private async callWithRetry(
  systemPrompt: string,
  message: string,
  conversationHistory: any[],
  maxRetries = 2
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await this.callOpenAIAPI(systemPrompt, message, conversationHistory);
    } catch (err) {
      if (attempt < maxRetries - 1) {
        await this.delay(500 * (attempt + 1)); // Exponential backoff
      }
    }
  }
  throw new Error('All retry attempts failed');
}
```

#### TunisianNlpService

**Normalization Pipeline**:
```
Tunisian Text
    ↓
[1] Number Replacement (3→a, 7→h, 9→k)
    ↓
[2] Custom Words Mapping (150+ words)
    ↓
[3] Expanded Aliases (100+ phrases)
    ↓
[4] Standard Aliases (200+ terms)
    ↓
French Text
```

**Example Mappings**:
```typescript
private readonly tunisianMappings = {
  // Greetings
  'ahla': 'bonjour',
  'salam': 'bonjour',
  
  // Verbs
  'n7eb': 'je veux',
  'nchri': 'acheter',
  'n9aleb': 'chercher',
  
  // Questions
  'ch7al': 'combien',
  'kifech': 'comment',
  'win': 'où',
  
  // Auto parts
  'frin': 'frein',
  'batri': 'batterie',
  'filtere': 'filtre',
  
  // Positions
  'gosh': 'gauche',
  'avent': 'avant',
  
  // Stock/Price
  'famma': 'disponible',
  'pris': 'prix',
  'stok': 'stock'
};
```

**Typo Correction**:
```typescript
correctTypos(word: string, threshold: number = 2): string {
  let bestMatch = word;
  let minDistance = threshold;
  
  for (const part of this.carParts) {
    const distance = levenshtein.get(word.toLowerCase(), part.toLowerCase());
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = part;
    }
  }
  
  return bestMatch;
}
```

---

### 5. Data Layer

#### Prisma ORM

**Schema Design**:
```prisma
// Vehicle catalog
model Vehicle {
  id              Int      @id @default(autoincrement())
  immatriculation String   @unique
  marque          String
  modele          String
  annee           Int
  statut          String   @default("disponible")
  
  ventes          Vente[]
  reparations     Reparation[]
  documents       Document[]
  
  @@map("vehicules")
  @@index([marque, modele])
}

// Parts inventory
model PiecesRechange {
  id              Int      @id @default(autoincrement())
  reference       String   @unique
  designation     String
  quantiteStock   Int      @default(0)
  prixUnitaire    Decimal?
  versionModele   String
  typeVehicule    String
  
  @@map("pieces_rechange")
  @@index([versionModele])
  @@index([quantiteStock])
}

// Chat sessions
model ChatSession {
  id          String        @id @default(uuid())
  vehicleInfo Json?
  startedAt   DateTime      @default(now())
  messages    ChatMessage[]
  prompts     ChatPrompt[]
  
  @@map("chat_sessions")
  @@index([startedAt])
}

// Chat messages
model ChatMessage {
  id        String      @id @default(uuid())
  sessionId String
  sender    String      // 'user' or 'bot'
  message   String      @db.Text
  timestamp DateTime    @default(now())
  metadata  Json?
  
  session   ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  feedback  ChatFeedback?
  
  @@map("chat_messages")
  @@index([sessionId])
  @@index([timestamp])
}

// Upload tracking (rate limiting)
model UploadTracking {
  id        String   @id @default(uuid())
  userIp    String
  uploadedAt DateTime @default(now())
  success   Boolean  @default(true)
  vehicleInfo Json?
  
  @@map("upload_tracking")
  @@index([userIp, uploadedAt])
}
```

**Query Optimization**:
```typescript
// Indexed queries for fast lookups
await prisma.piecesRechange.findMany({
  where: {
    OR: [
      { designation: { contains: term, mode: 'insensitive' } },
      { reference: { contains: term, mode: 'insensitive' } }
    ]
  },
  take: 100
});

// Aggregation for analytics
const avgRating = await prisma.chatFeedback.aggregate({
  _avg: { rating: true },
  where: { createdAt: { gte: timeRange.start } }
});

// Grouping for top queries
const topQueries = await prisma.chatPrompt.groupBy({
  by: ['promptText'],
  _count: { promptText: true },
  orderBy: { _count: { promptText: 'desc' } },
  take: 5
});
```

---

## Component Interactions

### Message Flow Sequence Diagram

```
User → ChatWidget → Backend → EnhancedChatService → IntelligenceService
                                      ↓
                              AdvancedSearchService
                                      ↓
                                  Database
                                      ↓
                              OpenAIService
                                      ↓
                              Response → User
```

### Detailed Interaction Flow

1. **User sends message**:
   ```
   User types: "nheb filtre air celerio"
   ```

2. **Frontend processes**:
   ```javascript
   const response = await fetch('/chat/message', {
     method: 'POST',
     body: JSON.stringify({ message, vehicle })
   });
   ```

3. **Backend receives**:
   ```typescript
   @Post('message')
   async chat(@Body() body: { message: string; vehicle?: any }) {
     return await this.chatService.processMessage(body.message, body.vehicle);
   }
   ```

4. **EnhancedChatService processes**:
   ```typescript
   // Rate limit check
   if (!this.checkRateLimit(clientIp)) {
     return rateLimitResponse;
   }
   
   // Validate input
   this.validateMessageInput(message);
   
   // Get/create session
   const session = await this.getOrCreateSession(sessionId, vehicle);
   
   // Detect intent
   const intent = await this.intelligence.detectIntent(message);
   // Result: { type: 'SEARCH', confidence: 0.85 }
   ```

5. **TunisianNlpService normalizes**:
   ```typescript
   const normalized = this.normalizeTunisian("nheb filtre air celerio");
   // Result: "je veux filtre air celerio"
   ```

6. **AdvancedSearchService searches**:
   ```typescript
   const products = await this.searchParts("je veux filtre air celerio");
   // Query: filtre + air + celerio
   // Synonyms: filter, filtere, admission, aer
   // Results: [
   //   { designation: "Filtre à air Celerio", reference: "13780M62S00", score: 850 },
   //   { designation: "Filtre air admission Celerio", reference: "13780M68K00", score: 720 }
   // ]
   ```

7. **IntelligenceService calculates confidence**:
   ```typescript
   const confidence = this.calculateConfidence({
     productsFound: 2,
     exactMatch: false,
     conversationContext: 0,
     userFeedbackHistory: 0,
     queryClarity: 15
   });
   // Result: { score: 68, level: 'MEDIUM' }
   ```

8. **OpenAIService generates response**:
   ```typescript
   const response = await this.openai.chat(
     "je veux filtre air celerio",
     conversationHistory,
     context
   );
   // Result: "Bonjour! Voici les filtres à air disponibles pour votre Suzuki Celerio:
   //          
   //          PRODUITS TROUVÉS:
   //          • Filtre à air Celerio (Réf: 13780M62S00) - Prix: 25 TND - Stock: 5 unités
   //          • Filtre air admission Celerio (Réf: 13780M68K00) - Prix: 28 TND - Stock: 3 unités
   //          
   //          💰 PRIX: 25-28 TND
   //          📦 STOCK: Disponible
   //          
   //          Pour commander, contactez CarPro au ☎️ 70 603 500"
   ```

9. **Response sent to user**:
   ```typescript
   return {
     response: aiResponse,
     sessionId: session.id,
     products: products.slice(0, 3),
     confidence: 'MEDIUM',
     intent: 'SEARCH',
     metadata: {
       productsFound: 2,
       conversationLength: 1,
       queryClarity: 15
     }
   };
   ```

10. **Frontend displays**:
    ```javascript
    const botMessage = {
      id: Date.now(),
      text: data.response,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    ```

---

## Design Patterns

### 1. Dependency Injection (NestJS)
```typescript
@Injectable()
export class EnhancedChatService {
  constructor(
    private prisma: PrismaService,
    private openai: OpenAIService,
    private advancedSearch: AdvancedSearchService,
    private intelligence: IntelligenceService
  ) {}
}
```

### 2. Repository Pattern (Prisma)
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### 3. Strategy Pattern (Intent Handling)
```typescript
private async handleNonSearchIntent(
  sessionId: string,
  message: string,
  intent: any
): Promise<ProcessMessageResponse> {
  switch (intent.type) {
    case 'GREETING':
      return this.handleGreeting(sessionId, message);
    case 'THANKS':
      return this.handleThanks(sessionId, message);
    case 'COMPLAINT':
      return this.handleComplaint(sessionId, message);
    default:
      return this.handleDefault(sessionId, message);
  }
}
```

### 4. Factory Pattern (Response Generation)
```typescript
private createStructuredErrorResponse(
  message: string,
  error: any,
  sessionId?: string
): ProcessMessageResponse {
  return {
    response: this.buildErrorResponse(message, error),
    sessionId: sessionId || 'error-session',
    products: [],
    confidence: 'LOW',
    intent: 'ERROR',
    metadata: { error: error.message, productsFound: 0 }
  };
}
```

### 5. Singleton Pattern (Cache)
```typescript
private responseCache: Map<string, { data: any; timestamp: number }> = new Map();
```

### 6. Observer Pattern (Learning System)
```typescript
private scheduleLearningCycle(): void {
  setInterval(async () => {
    await this.analyzeAndLearnFromConversations();
  }, this.LEARNING_INTERVAL_MS);
}
```

---

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: No server-side sessions
- **Database Connection Pooling**: 10 connections per instance
- **Load Balancer Ready**: Can run multiple instances

### Vertical Scaling
- **Efficient Algorithms**: O(n log n) search complexity
- **Caching**: Reduce database load
- **Lazy Loading**: Load data on demand

### Performance Optimization
- **Database Indexes**: Fast lookups on frequently queried fields
- **Query Optimization**: Use Prisma's efficient queries
- **Response Caching**: 5-minute TTL for repeated queries
- **Rate Limiting**: Prevent abuse

### Future Improvements
1. **Redis Cache**: Replace in-memory cache
2. **Message Queue**: RabbitMQ/Kafka for async processing
3. **CDN**: Serve static assets
4. **Database Sharding**: Split data across multiple databases
5. **Microservices**: Split into smaller services

---

**Last Updated**: January 2025
