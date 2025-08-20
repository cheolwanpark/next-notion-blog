/**
 * Standardized error handling for service layer
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ServiceError {
  code: string
  message: string
  severity: ErrorSeverity
  context?: Record<string, any>
  timestamp: string
}

/**
 * Create a standardized service error
 */
export function createServiceError(
  code: string, 
  message: string, 
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: Record<string, any>
): ServiceError {
  return {
    code,
    message,
    severity,
    context,
    timestamp: new Date().toISOString()
  }
}

/**
 * Log service errors with consistent format
 */
export function logServiceError(error: ServiceError | Error, operation?: string): void {
  const timestamp = new Date().toISOString()
  
  if (error instanceof Error) {
    console.error(`[${timestamp}] Service Error${operation ? ` in ${operation}` : ''}:`, {
      message: error.message,
      stack: error.stack,
      operation
    })
  } else {
    console.error(`[${timestamp}] Service Error${operation ? ` in ${operation}` : ''}:`, error)
  }
}

/**
 * Handle service operation with consistent error handling
 */
export async function handleServiceOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  fallback?: T
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    const serviceError = createServiceError(
      `${operationName.toUpperCase()}_ERROR`,
      `Failed to execute ${operationName}`,
      ErrorSeverity.MEDIUM,
      { originalError: error instanceof Error ? error.message : String(error) }
    )
    
    logServiceError(serviceError, operationName)
    
    if (fallback !== undefined) {
      return fallback
    }
    
    return null
  }
}

/**
 * Handle service operation with automatic fallback strategy
 */
export async function handleServiceOperationWithFallback<T>(
  operation: () => Promise<T>,
  fallbackOperation: () => Promise<T>,
  operationName: string
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    logServiceError(error instanceof Error ? error : new Error(String(error)), operationName)
    
    try {
      console.log(`Attempting fallback for ${operationName}`)
      return await fallbackOperation()
    } catch (fallbackError) {
      logServiceError(
        fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError)), 
        `${operationName}-fallback`
      )
      return null
    }
  }
}