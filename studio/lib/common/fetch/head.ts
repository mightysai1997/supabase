import { handleError, handleResponse, handleResponseError, constructHeaders } from './base'
import { uuidv4 } from '../../helpers'
import { SupaResponse } from 'types/base'

export async function head<T = any>(
  url: string,
  options?: { [prop: string]: any }
): Promise<SupaResponse<T>> {
  const requestId = uuidv4()
  try {
    const { headers: optionHeaders, ...otherOptions } = options ?? {}
    const headers = constructHeaders(requestId, optionHeaders)
    const response = await fetch(url, {
      method: 'HEAD',
      credentials: 'include',
      referrerPolicy: 'no-referrer-when-downgrade',
      headers,
      ...otherOptions,
    })
    console.log(
      'HEAD',
      response.headers,
      response.headers.keys(),
      response.headers.get('X-Total-Count')
    )
    if (!response.ok) return handleResponseError(response, requestId)
    return handleResponse(response, requestId)
  } catch (error) {
    return handleError(error, requestId)
  }
}
