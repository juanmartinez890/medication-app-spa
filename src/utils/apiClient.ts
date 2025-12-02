/**
 * Gets the base URL for API requests from environment variables
 * @returns The base URL for the API
 * @throws Error if VITE_API_URL is not defined
 */
export function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new Error('VITE_API_URL is not defined')
  }
  return baseUrl
}

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  statusCode?: number
  responseText?: string

  constructor(
    message: string,
    statusCode?: number,
    responseText?: string
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.responseText = responseText
  }
}

/**
 * Makes an API request with standardized error handling
 * @param endpoint - The API endpoint (without base URL)
 * @param options - Fetch options (method, body, etc.)
 * @returns Promise resolving to the response data
 * @throws ApiError if the request fails
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new ApiError(
      text || `Request failed with status ${response.status}`,
      response.status,
      text
    )
  }

  return response.json()
}

