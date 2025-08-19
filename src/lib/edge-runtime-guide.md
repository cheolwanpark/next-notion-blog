# Edge Runtime Configuration Guide

This document outlines the Edge Runtime strategy for optimal API performance.

## Edge Runtime vs Node.js Runtime

### Use Edge Runtime For:
- ✅ **Health checks** (`/api/health`) - Fast global monitoring
- ✅ **Statistics** (`/api/stats`) - Cached data serving
- ✅ **Cache revalidation** (`/api/revalidate`) - Lightweight cache operations
- ✅ **Webhooks** - Fast response to external triggers
- ✅ **Authentication** - JWT validation and session checks
- ✅ **Redirects** - Fast URL redirections
- ✅ **Rate limiting** - Quick request filtering

### Use Node.js Runtime For:
- ❌ **Cache warming** (`/api/warm-cache`) - Heavy data operations
- ❌ **Notion API calls** (`/api/notion/block`) - Complex data fetching
- ❌ **Image generation** (`/api/og`) - Resource-intensive operations
- ❌ **File uploads** - Large payload processing
- ❌ **Database operations** - Complex queries and transactions

## Performance Benefits

### Edge Runtime Advantages:
- **Global Distribution**: Runs at edge locations worldwide
- **Cold Start**: ~0ms cold start vs ~100ms for Node.js
- **Memory Usage**: Lower memory footprint
- **Concurrent Connections**: Better handling of high traffic
- **Cost Efficiency**: Pay-per-use model with lower costs

### Limitations:
- **Node.js APIs**: Limited access to Node.js-specific APIs
- **Package Size**: Smaller bundle size limits
- **Execution Time**: Limited execution time for complex operations

## Configuration Examples

### Edge-Optimized API Route
```typescript
// /api/health/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60',
      'X-Edge-Runtime': 'true',
    }
  })
}
```

### Node.js Runtime for Heavy Operations
```typescript
// /api/heavy-operation/route.ts
import { NextResponse } from 'next/server'
import { complexDataProcessing } from '@/lib/heavy-ops'

export const runtime = 'nodejs'

export async function POST() {
  const result = await complexDataProcessing()
  return NextResponse.json(result)
}
```

## Current API Route Configuration

| Route | Runtime | Reason |
|-------|---------|---------|
| `/api/health` | Edge | Health checks, global monitoring |
| `/api/stats` | Edge | Cached statistics delivery |
| `/api/revalidate` | Edge | Lightweight cache operations |
| `/api/warm-cache` | Node.js | Heavy data preloading |
| `/api/notion/block` | Node.js | Complex Notion API calls |
| `/api/og` | Node.js | Image generation |

## Monitoring and Optimization

### Performance Metrics to Track:
- **Response Time**: Target <100ms for edge routes
- **Cold Start Time**: Should be near-zero for edge
- **Error Rate**: Monitor edge vs Node.js error rates
- **Geographic Performance**: Edge should be fast globally

### Optimization Strategies:
1. **Cache Headers**: Use aggressive caching for edge routes
2. **Payload Size**: Minimize response sizes
3. **Error Handling**: Implement graceful fallbacks
4. **Rate Limiting**: Protect edge routes from abuse

## Migration Strategy

### Phase 1: Identify Candidates
- Audit existing API routes
- Measure current performance
- Identify lightweight operations

### Phase 2: Gradual Migration
- Start with health/stats endpoints
- Monitor performance improvements
- Migrate more routes iteratively

### Phase 3: Optimization
- Fine-tune caching strategies
- Implement edge-specific optimizations
- Monitor global performance

## Best Practices

### Do:
- Use edge for simple, fast operations
- Implement proper error handling
- Set appropriate cache headers
- Monitor performance metrics
- Test global latency

### Don't:
- Use edge for heavy computations
- Assume Node.js APIs are available
- Ignore payload size limits
- Skip error handling
- Forget to monitor costs

## Cost Optimization

### Edge Runtime Costs:
- Billed per request and compute time
- Lower cost per request than Node.js
- No idle costs (serverless)

### Optimization Tips:
- Cache responses aggressively
- Minimize compute time
- Use appropriate timeouts
- Monitor usage patterns

## Future Enhancements

### Planned Edge Routes:
- `/api/search-suggestions` - Fast autocomplete
- `/api/popular-tags` - Trending topics
- `/api/sitemap-light` - Basic sitemap info
- `/api/webhook/github` - Deployment hooks

### Monitoring Dashboard:
- Real-time performance metrics
- Geographic latency distribution
- Cost analysis and optimization
- Error rate monitoring

## Troubleshooting

### Common Issues:
1. **Node.js API Usage**: Check for incompatible APIs
2. **Bundle Size**: Reduce dependencies
3. **Timeout Errors**: Optimize execution time
4. **Cold Start**: May indicate Node.js runtime needed

### Debugging:
```bash
# Check runtime in response headers
curl -I https://yourdomain.com/api/health
# Look for X-Edge-Runtime: true

# Monitor performance
curl -w "@curl-format.txt" https://yourdomain.com/api/stats
```

This configuration provides optimal performance by matching runtime to use case requirements.