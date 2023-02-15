const cache = new Map()
const CACHE_REFRESH_LIMIT_TIME = 60000 * 60 * 24 // 24H

const validate = (k: string) => {
  if (!cache.has(k)) {
    return true
  }

  const addedTime = cache.get(k)
  const now = Date.now()
  return now - addedTime > CACHE_REFRESH_LIMIT_TIME
}

export const get = (k: string) => {
  return cache.get(k)
}

export const add = (k: string, v: any) => {
  if (validate(k)) {
    cache.set(k, v)
    return true
  } else {
    return false
  }
}

export const canFaucet = (k: string) => {
  return validate(k)
}
