/** Client-side lead submission helpers (safe to bundle — no secrets). */
export const LEAD_REQUEST_HEADER = 'X-Requested-With'
export const LEAD_REQUEST_VALUE = 'RSA-Lead-Form'

export function getLeadFetchHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    [LEAD_REQUEST_HEADER]: LEAD_REQUEST_VALUE,
  }
}

export function getFormLoadedAt() {
  return Date.now()
}
