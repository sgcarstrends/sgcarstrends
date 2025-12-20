---
name: api-docs
description: Create and maintain API documentation including endpoint descriptions, request/response examples, and OpenAPI specifications. Use when documenting new endpoints or updating API references.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# API Documentation Skill

This skill helps you create comprehensive API documentation for the Hono-based API service.

## When to Use This Skill

- Documenting new API endpoints
- Updating existing API documentation
- Creating OpenAPI/Swagger specifications
- Writing API guides and tutorials
- Documenting request/response schemas
- Adding authentication documentation
- Creating API versioning documentation

## Documentation Structure

```
apps/docs/
├── api-reference/
│   ├── introduction.mdx         # API overview
│   ├── authentication.mdx       # Auth guide
│   ├── errors.mdx               # Error handling
│   ├── rate-limiting.mdx        # Rate limits
│   ├── pagination.mdx           # Pagination guide
│   ├── cars/
│   │   ├── get-makes.mdx       # GET /api/v1/cars/makes
│   │   ├── get-models.mdx      # GET /api/v1/cars/models
│   │   └── get-registrations.mdx
│   ├── coe/
│   │   ├── get-results.mdx     # GET /api/v1/coe/results
│   │   └── get-latest.mdx      # GET /api/v1/coe/latest
│   └── blog/
│       ├── get-posts.mdx       # GET /api/v1/blog/posts
│       └── get-post.mdx        # GET /api/v1/blog/posts/:id
└── openapi.yaml                 # OpenAPI specification
```

## API Reference Page Template

### GET Endpoint Example

```mdx
---
title: "Get Car Makes"
api: "GET /api/v1/cars/makes"
description: "Retrieve a list of all car makes registered in Singapore with their registration counts"
---

# Get Car Makes

Returns a paginated list of all car makes registered in Singapore, along with their registration counts and percentage of total registrations.

<Note>
  This endpoint is publicly accessible and does not require authentication.
</Note>

## Base URL

```
https://api.sgcarstrends.com
\```

## Endpoint

```
GET /api/v1/cars/makes
\```

## Query Parameters

<ParamField query="month" type="string" optional>
  Filter by month in YYYY-MM format (e.g., "2024-01").
  If not provided, returns data for all months.

  **Example:** `2024-01`
</ParamField>

<ParamField query="limit" type="number" default={100}>
  Maximum number of results to return.

  **Range:** 1-1000

  **Default:** 100
</ParamField>

<ParamField query="offset" type="number" default={0}>
  Number of results to skip for pagination.

  **Minimum:** 0

  **Default:** 0
</ParamField>

<ParamField query="sort" type="string" default="count">
  Sort field for results.

  **Options:**
  - `count` - Sort by registration count (default)
  - `make` - Sort by make name alphabetically
  - `percentage` - Sort by percentage of total

  **Default:** `count`
</ParamField>

<ParamField query="order" type="string" default="desc">
  Sort order.

  **Options:**
  - `asc` - Ascending order
  - `desc` - Descending order (default)

  **Default:** `desc`
</ParamField>

## Response

<ResponseField name="makes" type="array" required>
  Array of car makes with registration counts

  <Expandable title="Make Object Properties">
    <ResponseField name="make" type="string" required>
      Car manufacturer name (e.g., "Toyota", "Honda", "BMW")
    </ResponseField>

    <ResponseField name="count" type="number" required>
      Total number of registrations for this make in the specified period
    </ResponseField>

    <ResponseField name="percentage" type="number" required>
      Percentage of total registrations for this make (0-100)
    </ResponseField>

    <ResponseField name="rank" type="number" required>
      Ranking position based on registration count (1 = highest)
    </ResponseField>

    <ResponseField name="models" type="number" required>
      Number of distinct models for this make
    </ResponseField>
  </Expandable>
</ResponseField>

<ResponseField name="meta" type="object" required>
  Pagination metadata

  <Expandable title="Meta Properties">
    <ResponseField name="total" type="number" required>
      Total number of makes available
    </ResponseField>

    <ResponseField name="limit" type="number" required>
      Limit used for this request
    </ResponseField>

    <ResponseField name="offset" type="number" required>
      Offset used for this request
    </ResponseField>

    <ResponseField name="hasMore" type="boolean" required>
      Whether more results are available
    </ResponseField>
  </Expandable>
</ResponseField>

## Example Requests

<CodeGroup>
```bash cURL
curl -X GET 'https://api.sgcarstrends.com/api/v1/cars/makes?month=2024-01&limit=10'
\```

```javascript JavaScript
const response = await fetch(
  'https://api.sgcarstrends.com/api/v1/cars/makes?month=2024-01&limit=10'
);
const data = await response.json();
console.log(data);
\```

```python Python
import requests

response = requests.get(
    'https://api.sgcarstrends.com/api/v1/cars/makes',
    params={
        'month': '2024-01',
        'limit': 10
    }
)
data = response.json()
print(data)
\```

```typescript TypeScript
interface CarMake {
  make: string;
  count: number;
  percentage: number;
  rank: number;
  models: number;
}

interface Response {
  makes: CarMake[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const response = await fetch(
  'https://api.sgcarstrends.com/api/v1/cars/makes?month=2024-01&limit=10'
);
const data: Response = await response.json();
\```
</CodeGroup>

## Example Responses

<ResponseExample>
```json 200 OK
{
  "makes": [
    {
      "make": "Toyota",
      "count": 1542,
      "percentage": 18.5,
      "rank": 1,
      "models": 15
    },
    {
      "make": "Honda",
      "count": 1234,
      "percentage": 14.8,
      "rank": 2,
      "models": 12
    },
    {
      "make": "BMW",
      "count": 987,
      "percentage": 11.9,
      "rank": 3,
      "models": 10
    }
  ],
  "meta": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
\```

```json 400 Bad Request
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Month must be in YYYY-MM format",
    "details": {
      "parameter": "month",
      "value": "invalid",
      "expected": "YYYY-MM"
    }
  }
}
\```

```json 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "details": {
      "limit": 100,
      "window": "1m",
      "retryAfter": 60
    }
  }
}
\```

```json 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "requestId": "req_abc123"
  }
}
\```
</ResponseExample>

## Rate Limiting

<Info>
  This endpoint is rate-limited to **100 requests per minute** per IP address.
</Info>

## Caching

<Tip>
  Responses are cached for **1 hour**. Use the `Cache-Control` header to check cache status.
</Tip>

## Use Cases

<AccordionGroup>
  <Accordion title="Get top 10 makes for a specific month">
    ```bash
    curl 'https://api.sgcarstrends.com/api/v1/cars/makes?month=2024-01&limit=10&sort=count&order=desc'
    \```
  </Accordion>

  <Accordion title="Get all makes sorted alphabetically">
    ```bash
    curl 'https://api.sgcarstrends.com/api/v1/cars/makes?sort=make&order=asc&limit=1000'
    \```
  </Accordion>

  <Accordion title="Paginate through results">
    ```bash
    # Page 1
    curl 'https://api.sgcarstrends.com/api/v1/cars/makes?limit=20&offset=0'

    # Page 2
    curl 'https://api.sgcarstrends.com/api/v1/cars/makes?limit=20&offset=20'
    \```
  </Accordion>
</AccordionGroup>

## Related Endpoints

<CardGroup cols={2}>
  <Card title="Get Models" href="/api-reference/cars/get-models">
    Get models for a specific make
  </Card>

  <Card title="Get Registrations" href="/api-reference/cars/get-registrations">
    Get detailed registration data
  </Card>
</CardGroup>
```

### POST Endpoint Example

```mdx
---
title: "Create Blog Post"
api: "POST /api/v1/blog/posts"
description: "Create a new blog post"
---

# Create Blog Post

Creates a new blog post. Requires authentication.

<Warning>
  This endpoint requires authentication. Include your API key in the Authorization header.
</Warning>

## Authentication

```http
Authorization: Bearer YOUR_API_KEY
\```

## Request Body

<ParamField body="title" type="string" required>
  Post title (3-200 characters)
</ParamField>

<ParamField body="slug" type="string" required>
  URL-friendly slug (must be unique)
</ParamField>

<ParamField body="content" type="string" required>
  Post content in Markdown format
</ParamField>

<ParamField body="excerpt" type="string" optional>
  Short summary (max 500 characters)
</ParamField>

<ParamField body="status" type="string" default="draft">
  Post status: `draft` or `published`
</ParamField>

## Example Request

```json
{
  "title": "Singapore Car Trends 2024",
  "slug": "singapore-car-trends-2024",
  "content": "# Singapore Car Trends...",
  "excerpt": "Analysis of 2024 car trends",
  "status": "published"
}
\```

## Example Response

```json 201 Created
{
  "id": "post_abc123",
  "title": "Singapore Car Trends 2024",
  "slug": "singapore-car-trends-2024",
  "status": "published",
  "createdAt": "2024-01-15T10:00:00Z"
}
\```
```

## OpenAPI Specification

### openapi.yaml

```yaml
openapi: 3.0.0
info:
  title: SG Cars Trends API
  version: 1.0.0
  description: API for accessing Singapore car registration and COE data
  contact:
    name: API Support
    email: support@sgcarstrends.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.sgcarstrends.com
    description: Production server
  - url: https://staging-api.sgcarstrends.com
    description: Staging server

paths:
  /api/v1/cars/makes:
    get:
      summary: Get car makes
      description: Returns a list of car makes with registration counts
      tags:
        - Cars
      parameters:
        - name: month
          in: query
          description: Filter by month (YYYY-MM)
          required: false
          schema:
            type: string
            pattern: ^\d{4}-\d{2}$
            example: "2024-01"
        - name: limit
          in: query
          description: Maximum results to return
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 1000
            default: 100
        - name: offset
          in: query
          description: Number of results to skip
          required: false
          schema:
            type: integer
            minimum: 0
            default: 0
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  makes:
                    type: array
                    items:
                      $ref: "#/components/schemas/CarMake"
                  meta:
                    $ref: "#/components/schemas/PaginationMeta"
        "400":
          $ref: "#/components/responses/BadRequest"
        "429":
          $ref: "#/components/responses/RateLimitExceeded"
        "500":
          $ref: "#/components/responses/InternalError"

  /api/v1/coe/results:
    get:
      summary: Get COE results
      description: Returns COE bidding results
      tags:
        - COE
      parameters:
        - name: month
          in: query
          schema:
            type: string
        - name: vehicleClass
          in: query
          schema:
            type: string
            enum: [A, B, C, D, E]
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/COEResult"

components:
  schemas:
    CarMake:
      type: object
      required:
        - make
        - count
        - percentage
        - rank
        - models
      properties:
        make:
          type: string
          example: "Toyota"
        count:
          type: integer
          example: 1542
        percentage:
          type: number
          format: float
          example: 18.5
        rank:
          type: integer
          example: 1
        models:
          type: integer
          example: 15

    COEResult:
      type: object
      properties:
        month:
          type: string
          example: "2024-01"
        biddingNo:
          type: integer
          example: 1
        vehicleClass:
          type: string
          enum: [A, B, C, D, E]
          example: "A"
        quota:
          type: integer
          example: 1000
        bidsReceived:
          type: integer
          example: 5000
        premiumAmount:
          type: integer
          example: 65000

    PaginationMeta:
      type: object
      properties:
        total:
          type: integer
        limit:
          type: integer
        offset:
          type: integer
        hasMore:
          type: boolean

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    RateLimitExceeded:
      description: Rate limit exceeded
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    InternalError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer

tags:
  - name: Cars
    description: Car registration data
  - name: COE
    description: COE bidding results
  - name: Blog
    description: Blog posts
```

### Generate OpenAPI Docs

```bash
# Install Redoc CLI
pnpm add -g redoc-cli

# Generate HTML docs
redoc-cli bundle apps/docs/openapi.yaml -o api-docs.html

# Serve locally
redoc-cli serve apps/docs/openapi.yaml
```

## Error Documentation

### errors.mdx

```mdx
---
title: "Error Handling"
description: "Understanding API errors and how to handle them"
---

# Error Handling

All errors returned by the API follow a consistent format.

## Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional context (optional)
    }
  }
}
\```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_PARAMETER` | 400 | Invalid query parameter |
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate slug) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Handling Errors

<CodeGroup>
```javascript JavaScript
try {
  const response = await fetch('https://api.sgcarstrends.com/api/v1/cars/makes');

  if (!response.ok) {
    const error = await response.json();
    console.error(`Error: ${error.error.code} - ${error.error.message}`);
  }

  const data = await response.json();
} catch (error) {
  console.error('Network error:', error);
}
\```

```python Python
import requests

try:
    response = requests.get('https://api.sgcarstrends.com/api/v1/cars/makes')
    response.raise_for_status()
    data = response.json()
except requests.exceptions.HTTPError as e:
    error = e.response.json()
    print(f"Error: {error['error']['code']} - {error['error']['message']}")
except requests.exceptions.RequestException as e:
    print(f"Network error: {e}")
\```
</CodeGroup>
```

## Best Practices

### 1. Complete Examples

```mdx
# ❌ Incomplete example
\```bash
curl /api/v1/cars/makes
\```

# ✅ Complete example
\```bash
curl -X GET 'https://api.sgcarstrends.com/api/v1/cars/makes?month=2024-01'
\```
```

### 2. Document All Parameters

```mdx
# ❌ Missing parameter docs
Query: month, limit, offset

# ✅ Documented parameters
<ParamField query="month" type="string" optional>
  Filter by month in YYYY-MM format
</ParamField>
```

### 3. Show Error Cases

```mdx
# ❌ Only success response
\```json
{ "makes": [...] }
\```

# ✅ Success and error responses
\```json 200 OK
{ "makes": [...] }
\```

\```json 400 Bad Request
{ "error": { "code": "INVALID_PARAMETER" } }
\```
```

## References

- OpenAPI Specification: https://swagger.io/specification/
- Mintlify API Components: https://mintlify.com/docs/api-playground
- Related files:
  - `apps/docs/api-reference/` - API documentation
  - `apps/docs/openapi.yaml` - OpenAPI specification
  - Root CLAUDE.md - API guidelines

## Best Practices Summary

1. **Complete Examples**: Include full URLs and all required parameters
2. **All Status Codes**: Document success and error responses
3. **Parameter Details**: Describe type, format, default, validation rules
4. **Code Examples**: Provide examples in multiple languages
5. **Authentication**: Clearly document auth requirements
6. **Rate Limits**: Document rate limiting policies
7. **Versioning**: Document API versioning strategy
8. **OpenAPI Spec**: Maintain OpenAPI spec alongside docs
