// localStorage 저장/불러오기 공통 헬퍼 (스토어 4개가 공유)
export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
