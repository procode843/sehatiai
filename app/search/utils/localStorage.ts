// Local storage utilities for search functionality

export interface SavedSearch {
  id: string
  query: string
  filters: any
  timestamp: number
  resultsCount: number
}

export interface FavoriteHospital {
  id: string
  name_ar: string
  rating: number
  specialties: string[]
  phone: string
  address_ar: string
  savedAt: number
}

export interface SearchHistory {
  searches: SavedSearch[]
  favorites: FavoriteHospital[]
  lastLocation?: { lat: number; lng: number }
}

const STORAGE_KEY = "sehati_search_data"

// Get all search data from localStorage
export const getSearchData = (): SearchHistory => {
  if (typeof window === "undefined") return { searches: [], favorites: [] }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return { searches: [], favorites: [] }

    const parsed = JSON.parse(data)
    return {
      searches: parsed.searches || [],
      favorites: parsed.favorites || [],
      lastLocation: parsed.lastLocation,
    }
  } catch (error) {
    console.error("Error reading search data:", error)
    return { searches: [], favorites: [] }
  }
}

// Save search data to localStorage
export const saveSearchData = (data: SearchHistory) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving search data:", error)
  }
}

// Add a search to history
export const addSearchToHistory = (query: string, filters: any, resultsCount: number) => {
  const data = getSearchData()
  const newSearch: SavedSearch = {
    id: Date.now().toString(),
    query,
    filters,
    timestamp: Date.now(),
    resultsCount,
  }

  // Remove duplicate searches and keep only last 10
  const filteredSearches = data.searches.filter((s) => s.query !== query)
  data.searches = [newSearch, ...filteredSearches].slice(0, 10)

  saveSearchData(data)
}

// Add hospital to favorites
export const addToFavorites = (hospital: any) => {
  const data = getSearchData()
  const favorite: FavoriteHospital = {
    id: hospital.id,
    name_ar: hospital.name_ar,
    rating: hospital.rating,
    specialties: hospital.specialties,
    phone: hospital.phone,
    address_ar: hospital.address_ar,
    savedAt: Date.now(),
  }

  // Remove if already exists, then add to beginning
  data.favorites = data.favorites.filter((f) => f.id !== hospital.id)
  data.favorites.unshift(favorite)

  saveSearchData(data)
}

// Remove hospital from favorites
export const removeFromFavorites = (hospitalId: string) => {
  const data = getSearchData()
  data.favorites = data.favorites.filter((f) => f.id !== hospitalId)
  saveSearchData(data)
}

// Check if hospital is in favorites
export const isFavorite = (hospitalId: string): boolean => {
  const data = getSearchData()
  return data.favorites.some((f) => f.id === hospitalId)
}

// Save user location
export const saveUserLocation = (coords: { lat: number; lng: number }) => {
  const data = getSearchData()
  data.lastLocation = coords
  saveSearchData(data)
}

// Export search results as JSON
export const exportSearchResults = (hospitals: any[], query: string) => {
  const exportData = {
    query,
    timestamp: new Date().toISOString(),
    totalResults: hospitals.length,
    hospitals: hospitals.map((h) => ({
      name_ar: h.name_ar,
      name_en: h.name_en,
      rating: h.rating,
      specialties: h.specialties,
      phone: h.phone,
      address_ar: h.address_ar,
      distance: h.distance,
      eta: h.eta,
      isOpen: h.isOpen,
      services: h.services,
      insurance: h.insurance,
    })),
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `sehati-search-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Share search results
export const shareSearchResults = async (hospitals: any[], query: string) => {
  const shareText = `نتائج البحث في صحتي: "${query}"\n\nتم العثور على ${hospitals.length} مستشفى:\n\n${hospitals
    .slice(0, 3)
    .map((h) => `• ${h.name_ar} - تقييم ${h.rating}/5`)
    .join("\n")}\n\nتطبيق صحتي - ابحث عن أفضل المستشفيات`

  if (navigator.share) {
    try {
      await navigator.share({
        title: "نتائج البحث - صحتي",
        text: shareText,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to clipboard
      copyToClipboard(shareText)
    }
  } else {
    copyToClipboard(shareText)
  }
}

// Copy text to clipboard
const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert("تم نسخ النتائج إلى الحافظة")
    })
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    alert("تم نسخ النتائج إلى الحافظة")
  }
}

// Clear all local data
export const clearAllData = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
