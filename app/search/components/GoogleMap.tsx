"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Crosshair } from "lucide-react"

interface Hospital {
  id: string
  name_ar: string
  name_en: string
  coords: { lat: number; lng: number }
  specialties: string[]
  rating: number
  hours: Record<string, string>
  phone: string
  address_ar: string
  services: string[]
  insurance: string[]
  bookingUrl: string
  capacityFlag: string
  distance: number
  eta: number
  isOpen: boolean
  photos: string[]
  reviews: Array<{
    author: string
    rating: number
    comment: string
  }>
}

interface GoogleMapProps {
  hospitals: Hospital[]
  selectedHospital: Hospital | null
  onHospitalSelect: (hospital: Hospital) => void
  onLocationUpdate?: (coords: { lat: number; lng: number }) => void
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function GoogleMap({
  hospitals,
  selectedHospital,
  onHospitalSelect,
  onLocationUpdate,
  className = "",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const markerClusterRef = useRef<any>(null)
  const infoWindowRef = useRef<any>(null)
  const userLocationMarkerRef = useRef<any>(null)

  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  // Check if Google Maps API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    setHasApiKey(!!apiKey)

    if (apiKey && !window.google) {
      loadGoogleMapsScript(apiKey)
    } else if (window.google) {
      setIsMapLoaded(true)
    }
  }, [])

  const loadGoogleMapsScript = (apiKey: string) => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&language=ar&region=SA&callback=initMap`
    script.async = true
    script.defer = true

    window.initMap = () => {
      setIsMapLoaded(true)
    }

    script.onerror = () => {
      console.error("Failed to load Google Maps")
      setHasApiKey(false)
    }

    document.head.appendChild(script)
  }

  // Initialize map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 24.7136, lng: 46.6753 }, // Riyadh center
      zoom: 11,
      styles: [
        {
          featureType: "poi.medical",
          elementType: "geometry",
          stylers: [{ color: "#ffeaa7" }],
        },
        {
          featureType: "poi.medical",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d63031" }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: "cooperative",
    })

    mapInstanceRef.current = map
    infoWindowRef.current = new window.google.maps.InfoWindow()

    // Load marker clustering library
    loadMarkerClusterer()
  }, [isMapLoaded])

  const loadMarkerClusterer = async () => {
    if (!window.google) return

    try {
      // Use the new @googlemaps/markerclusterer library
      const { MarkerClusterer } = await import("@googlemaps/markerclusterer")

      markerClusterRef.current = new MarkerClusterer({
        map: mapInstanceRef.current,
        markers: [],
        algorithm: new window.google.maps.marker.SuperClusterAlgorithm({
          radius: 100,
          maxZoom: 15,
        }),
      })

      updateMarkers()
    } catch (error) {
      console.warn("MarkerClusterer not available, using basic markers")
      updateMarkers()
    }
  }

  // Update markers when hospitals change
  useEffect(() => {
    if (mapInstanceRef.current && isMapLoaded) {
      updateMarkers()
    }
  }, [hospitals, isMapLoaded])

  // Center map on selected hospital
  useEffect(() => {
    if (selectedHospital && mapInstanceRef.current) {
      const position = new window.google.maps.LatLng(selectedHospital.coords.lat, selectedHospital.coords.lng)

      mapInstanceRef.current.panTo(position)
      mapInstanceRef.current.setZoom(15)

      // Find and trigger click on the corresponding marker
      const marker = markersRef.current.find((m) => m.hospitalId === selectedHospital.id)
      if (marker) {
        window.google.maps.event.trigger(marker, "click")
      }
    }
  }, [selectedHospital])

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Create new markers
    const newMarkers = hospitals.map((hospital) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hospital.coords.lat, lng: hospital.coords.lng },
        map: mapInstanceRef.current,
        title: hospital.name_ar,
        icon: {
          url: getMarkerIcon(hospital),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        },
        animation: window.google.maps.Animation.DROP,
      })

      marker.hospitalId = hospital.id

      marker.addListener("click", () => {
        showInfoWindow(marker, hospital)
        onHospitalSelect(hospital)
      })

      return marker
    })

    markersRef.current = newMarkers

    // Update cluster if available
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers()
      markerClusterRef.current.addMarkers(newMarkers)
    }

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker) => bounds.extend(marker.getPosition()))
      mapInstanceRef.current.fitBounds(bounds)

      // Don't zoom too close if there's only one marker
      if (newMarkers.length === 1) {
        mapInstanceRef.current.setZoom(15)
      }
    }
  }

  const getMarkerIcon = (hospital: Hospital) => {
    // Color based on rating and availability
    let color = "#10b981" // green for good

    if (hospital.rating < 4.0) {
      color = "#f59e0b" // yellow for average
    }
    if (hospital.rating < 3.5) {
      color = "#ef4444" // red for poor
    }
    if (!hospital.isOpen) {
      color = "#6b7280" // gray for closed
    }

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" strokeWidth="2"/>
        <path d="M20 8 L20 32 M8 20 L32 20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    `)}`
  }

  const showInfoWindow = (marker: any, hospital: Hospital) => {
    if (!infoWindowRef.current) return

    const content = `
      <div style="direction: rtl; font-family: 'Tajawal', sans-serif; max-width: 250px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
          ${hospital.name_ar}
        </h3>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; color: #6b7280;">
          <span>⭐ ${hospital.rating}</span>
          <span>📍 ${hospital.distance} كم</span>
          <span>⏱️ ${hospital.eta} دقيقة</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="display: inline-block; padding: 2px 8px; background: ${hospital.isOpen ? "#dcfce7" : "#f3f4f6"}; color: ${hospital.isOpen ? "#166534" : "#6b7280"}; border-radius: 12px; font-size: 12px;">
            ${hospital.isOpen ? "مفتوح" : "مغلق"}
          </span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button onclick="window.open('tel:${hospital.phone}', '_self')" 
                  style="flex: 1; padding: 6px 12px; background: #0891b2; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
            اتصال
          </button>
          <button onclick="window.open('https://maps.google.com/maps?daddr=${hospital.coords.lat},${hospital.coords.lng}', '_blank')"
                  style="flex: 1; padding: 6px 12px; background: #059669; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
            الاتجاهات
          </button>
        </div>
      </div>
    `

    infoWindowRef.current.setContent(content)
    infoWindowRef.current.open(mapInstanceRef.current, marker)
  }

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم تحديد الموقع")
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(userCoords)
          mapInstanceRef.current.setZoom(14)

          // Remove existing user location marker
          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null)
          }

          // Add user location marker
          userLocationMarkerRef.current = new window.google.maps.Marker({
            position: userCoords,
            map: mapInstanceRef.current,
            title: "موقعك الحالي",
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                  <circle cx="10" cy="10" r="3" fill="white"/>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(20, 20),
              anchor: new window.google.maps.Point(10, 10),
            },
          })
        }

        onLocationUpdate?.(userCoords)
        setIsLocating(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        alert("لا يمكن تحديد موقعك. تأكد من السماح بالوصول للموقع.")
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }, [onLocationUpdate])

  // Fallback MockMap component
  const MockMap = () => (
    <div className={`bg-gray-100 rounded-lg flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">الخريطة غير متاحة</h3>
        <p className="text-gray-600 mb-4">لعرض الخريطة التفاعلية، يرجى إضافة مفتاح Google Maps API</p>
        <div className="space-y-2">
          {hospitals.slice(0, 3).map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onHospitalSelect(hospital)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{hospital.name_ar}</h4>
                  <p className="text-xs text-gray-600">
                    {hospital.distance} كم - {hospital.eta} دقيقة
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">⭐ {hospital.rating}</span>
                </div>
              </div>
            </div>
          ))}
          {hospitals.length > 3 && <p className="text-xs text-gray-500">+{hospitals.length - 3} مستشفى أخرى</p>}
        </div>
      </div>
    </div>
  )

  if (!hasApiKey) {
    return <MockMap />
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />

      {/* Locate Me Button */}
      {isMapLoaded && (
        <Button
          size="sm"
          className="absolute top-4 right-4 bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
          onClick={locateUser}
          disabled={isLocating}
        >
          <Crosshair className={`h-4 w-4 ml-1 ${isLocating ? "animate-spin" : ""}`} />
          {isLocating ? "جاري التحديد..." : "موقعي"}
        </Button>
      )}

      {/* Loading overlay */}
      {!isMapLoaded && hasApiKey && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">جاري تحميل الخريطة...</p>
          </div>
        </div>
      )}
    </div>
  )
}
