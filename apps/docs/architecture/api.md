# API Architecture

This document details the structure and design of the SG Cars Trends API service, built using the Hono framework with comprehensive middleware, authentication, and workflow integration.

## API Architecture Diagram

```mermaid
graph TB
    %% Client Layer
    Client[API Clients]
    WebApp[Web Application]
    
    %% API Gateway
    subgraph "API Gateway Layer"
        Gateway[AWS API Gateway]
        Lambda[API Lambda Function]
    end
    
    %% Hono Application
    subgraph "Hono Framework Application"
        subgraph "Core Middleware"
            Logger[Logger Middleware]
            Compress[Compression Middleware]
            PrettyJSON[Pretty JSON Middleware]
            RateLimit[Rate Limiting - Commented]
            BearerAuth[Bearer Authentication]
            ErrorHandler[Global Error Handler]
        end
        
        subgraph "Public Endpoints"
            Root[GET / - Scalar API Docs]
            OpenAPI[GET /docs - OpenAPI Spec]
            HealthCheck[GET /health - Health Check]
        end
        
        subgraph "Authenticated API v1"
            V1Router[/v1 Router - Bearer Auth Required]
            
            subgraph "Data Endpoints"
                CarsAPI[GET /v1/cars - Car Registration Data]
                COEAPI[GET /v1/coe - COE Bidding Results]
                MonthsAPI[GET /v1/months - Available Data Months]
            end
        end

        subgraph "Workflow System"
            WorkflowRouter[/workflows Router]
            
            subgraph "Workflow Endpoints"
                TriggerWorkflow[POST /workflows/trigger - Trigger Data Updates]
                CarsWorkflow[POST /workflows/cars - Cars Data Processor]
                COEWorkflow[POST /workflows/coe - COE Data Processor]
            end
            
            subgraph "Social Media Webhooks"
                LinkedInHook[POST /workflows/linkedin - LinkedIn Webhook]
                TwitterHook[POST /workflows/twitter - Twitter Webhook]  
                DiscordHook[POST /workflows/discord - Discord Webhook]
                TelegramHook[POST /workflows/telegram - Telegram Webhook]
            end
        end
    end
    
    %% External Services
    subgraph "External Services"
        QStash[QStash Workflow Orchestrator]
        LTA[LTA DataMall APIs]
        SocialPlatforms[Social Media Platforms]
        GeminiAI[Vercel AI SDK + Google Gemini]
    end
    
    %% Data Layer
    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL Database)]
        Redis[(Redis Cache)]
    end
    
    %% Request Flow Connections
    Client --> Gateway
    WebApp --> Gateway
    Gateway --> Lambda
    Lambda --> Logger
    
    Logger --> Compress
    Compress --> PrettyJSON
    PrettyJSON --> BearerAuth
    
    %% Public endpoints (no auth required)
    PrettyJSON --> Root
    PrettyJSON --> OpenAPI
    PrettyJSON --> HealthCheck
    
    %% Authenticated endpoints
    BearerAuth --> V1Router
    V1Router --> CarsAPI
    V1Router --> COEAPI
    V1Router --> MonthsAPI

    %% Workflow system
    BearerAuth --> WorkflowRouter
    WorkflowRouter --> TriggerWorkflow
    WorkflowRouter --> CarsWorkflow
    WorkflowRouter --> COEWorkflow
    WorkflowRouter --> LinkedInHook
    WorkflowRouter --> TwitterHook
    WorkflowRouter --> DiscordHook
    WorkflowRouter --> TelegramHook
    
    %% External integrations
    TriggerWorkflow --> QStash
    CarsWorkflow --> LTA
    COEWorkflow --> LTA
    CarsWorkflow --> GeminiAI
    COEWorkflow --> GeminiAI
    
    LinkedInHook --> SocialPlatforms
    TwitterHook --> SocialPlatforms
    DiscordHook --> SocialPlatforms
    TelegramHook --> SocialPlatforms
    
    %% Data connections
    CarsAPI --> Redis
    COEAPI --> Redis
    MonthsAPI --> Redis
    Redis --> PostgreSQL
    
    CarsWorkflow --> PostgreSQL
    COEWorkflow --> PostgreSQL

    %% Error handling
    ErrorHandler --> DiscordHook
    
    %% Styling
    classDef middleware fill:#e1f5fe
    classDef endpoint fill:#f3e5f5  
    classDef external fill:#fff3e0
    classDef database fill:#e8f5e8
    classDef workflow fill:#fce4ec
    
    class Logger,Compress,PrettyJSON,BearerAuth,ErrorHandler middleware
    class Root,OpenAPI,HealthCheck,CarsAPI,COEAPI,MonthsAPI endpoint
    class QStash,LTA,SocialPlatforms,GeminiAI external
    class PostgreSQL,Redis database
    class TriggerWorkflow,CarsWorkflow,COEWorkflow,LinkedInHook,TwitterHook,DiscordHook,TelegramHook workflow
```

## API Structure Overview

### Framework: Hono

The API is built using **Hono**, a modern web framework optimized for edge computing and serverless environments. Key advantages:

- **Lightweight**: Minimal overhead with fast startup times
- **TypeScript-first**: Full type safety across the application
- **Edge-optimized**: Designed for serverless and edge deployments
- **Middleware ecosystem**: Rich middleware support for common patterns

### Request Processing Pipeline

1. **AWS API Gateway**: Routes incoming requests to Lambda function
2. **Hono Application**: Processes requests through middleware chain
3. **Authentication**: Bearer token validation for protected routes
4. **Route Handling**: Dispatch to appropriate handler based on path
5. **Response Formatting**: Structured JSON responses with error handling

## Middleware Stack

### Core Middleware (Applied to all routes)

**Logger Middleware**
- Request/response logging for debugging and monitoring
- Structured log format for CloudWatch integration

**Compression Middleware**
- Automatic gzip compression for response bodies
- Reduces bandwidth usage and improves response times

**Pretty JSON Middleware**
- Formats JSON responses for better readability
- Development-friendly output formatting

**Error Handler**
- Global error handling with structured error responses
- HTTPException handling with proper status codes
- Fallback handling for unexpected errors

### Authentication Middleware

**Bearer Token Authentication**
- Validates `Authorization: Bearer <token>` headers
- Uses `SG_CARS_TRENDS_API_TOKEN` environment variable
- Applied to `/v1/*` routes
- Workflow endpoints also require authentication

**Rate Limiting (Disabled)**
- Upstash Redis-based rate limiting implementation
- Configurable via `FEATURE_FLAG_RATE_LIMIT`
- Currently commented out but ready for activation

## API Endpoints

### Public Endpoints (No Authentication)

#### Documentation Endpoints

**GET /** - API Documentation Interface
- Scalar API reference interface
- Interactive API exploration
- Generated from OpenAPI specification

**GET /docs** - OpenAPI Specification
- Machine-readable API specification
- OpenAPI 3.1.0 format
- Includes version info from package.json

**GET /health** - Health Check
- Service health monitoring endpoint
- Returns basic service status
- Used by load balancers and monitoring systems

### Authenticated Endpoints (Bearer Token Required)

#### Data API v1 (`/v1/*`)

All v1 endpoints require Bearer authentication and return structured JSON responses.

**GET /v1/cars** - Vehicle Registration Data
- Query Parameters:
  - `month`: Filter by specific month (YYYY-MM)
  - `make`: Filter by vehicle manufacturer
  - `fuel_type`: Filter by fuel type
  - Additional filtering options
- Response: Paginated vehicle registration data
- Caching: Redis-cached with TTL

**GET /v1/coe** - COE Bidding Results
- Query Parameters:
  - `month`: Filter by bidding month
  - `vehicle_class`: Filter by COE category
  - `bidding_no`: Filter by bidding exercise (1 or 2)
- Response: COE bidding results and premium data
- Includes PQP rates where applicable

**GET /v1/months** - Available Data Months
- Returns list of months with available data
- Used for frontend date picker population
- Separate endpoints for cars and COE data availability

### Workflow Endpoints (`/workflows/*`)

#### Workflow Management

**POST /workflows/trigger** - Manual Workflow Trigger
- Triggers both cars and COE data processing workflows
- Authenticated endpoint for administrative use
- Returns workflow execution status

**POST /workflows/cars** - Cars Data Processor
- QStash-triggered endpoint for cars data processing
- Handles file download, processing, and database updates
- Includes blog generation and social media posting

**POST /workflows/coe** - COE Data Processor
- QStash-triggered endpoint for COE data processing
- Processes bidding results and PQP data
- Conditional blog generation based on bidding cycle completion

#### Social Media Webhooks

**POST /workflows/linkedin** - LinkedIn Integration
- Handles LinkedIn posting workflow
- OAuth token management and refresh
- Business-focused content formatting

**POST /workflows/twitter** - Twitter Integration
- Twitter API v2 integration
- Character limit handling and URL shortening
- Engagement-optimized content formatting

**POST /workflows/discord** - Discord Integration
- Webhook-based Discord notifications
- Error reporting and status updates
- Community engagement features

**POST /workflows/telegram** - Telegram Integration
- Bot-based channel messaging
- Markdown formatting support
- Channel-specific content delivery

## Error Handling

### Structured Error Responses

All API responses follow a consistent structure:

```json
{
  "status": 200,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {...},
  "error": null
}
```

Error responses include:
```json
{
  "status": 400,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": null,
  "error": {
    "message": "Detailed error description"
  }
}
```

### HTTP Status Codes

- **200**: Successful requests
- **400**: Bad request (invalid parameters)
- **401**: Unauthorized (missing or invalid token)
- **404**: Resource not found
- **429**: Rate limit exceeded (when enabled)
- **500**: Internal server error

### Global Error Handler

- **HTTPException Handling**: Preserves original status codes
- **Unexpected Error Handling**: Returns 500 with generic message
- **Error Logging**: Comprehensive error logging to CloudWatch
- **Discord Notifications**: Critical errors trigger Discord alerts

## Performance Optimizations

### Caching Strategy

**Redis Caching**
- API responses cached with appropriate TTL
- Cache keys based on request parameters
- Cache invalidation on data updates
- Session and workflow state storage

**HTTP Caching**
- Cache-Control headers for static content
- ETags for conditional requests
- CDN integration for global distribution

### Database Optimization

**Connection Pooling**
- Drizzle ORM with connection pooling
- Optimized for serverless Lambda execution
- Connection reuse across requests

**Query Optimization**
- Strategic database indexes for common queries
- Batch operations for bulk data processing
- Prepared statements for performance

### Lambda Function Configuration

- **Architecture**: ARM64 for cost efficiency
- **Runtime**: Node.js 22.x for latest performance features
- **Timeout**: 120 seconds for long-running workflows
- **Memory**: Optimized allocation based on usage patterns

## Security Considerations

### Authentication & Authorization

**Bearer Token Authentication**
- Secure token-based authentication
- Environment variable-based token management
- No user session management required

**API Token Security**
- Tokens stored as environment variables
- Rotation capability without code changes
- Separate tokens for different environments

### Data Protection

**Input Validation**
- Comprehensive input validation using Zod schemas
- SQL injection prevention through ORM
- Parameter sanitization and type checking

**Rate Limiting**
- Ready-to-enable rate limiting using Upstash Redis
- IP-based limiting with sliding window algorithm
- Configurable limits per environment

## Monitoring & Observability

### Logging

**Structured Logging**
- JSON-formatted logs for machine readability
- CloudWatch Logs integration
- Request/response logging with correlation IDs

**Error Tracking**
- Comprehensive error logging with stack traces
- Discord integration for critical error notifications
- Performance metrics and slow query detection

### Health Monitoring

**Health Check Endpoint**
- Basic service availability monitoring
- Database connection verification
- Redis connectivity checks

**CloudWatch Integration**
- Automatic metrics collection
- Lambda function performance monitoring
- Custom metrics for business logic

## Related Documentation

- [System Architecture Overview](./system)
- [Data Processing Workflows](./workflows)
- [Database Schema](./database)
- [API Service Documentation](../../apps/api/CLAUDE.md)