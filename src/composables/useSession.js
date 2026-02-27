export const getToken = () => localStorage.getItem('token') || ''

export const getUserIdFromToken = () => {
  const token = getToken()
  if (!token) return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  try {
    const json = atob(payload)
    const data = JSON.parse(json)
    return data?.id ?? null
  } catch {
    return null
  }
}

export const useSession = () => {
  return {
    token: getToken(),
    userId: getUserIdFromToken()
  }
}
