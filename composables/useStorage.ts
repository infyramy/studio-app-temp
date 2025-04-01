export const useStorage = () => {
  const getItem = (key: string): string | null => {
    if (process.server) return null
    return localStorage.getItem(key)
  }

  const setItem = (key: string, value: string): void => {
    if (process.server) return
    localStorage.setItem(key, value)
  }

  const removeItem = (key: string): void => {
    if (process.server) return
    localStorage.removeItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem
  }
} 