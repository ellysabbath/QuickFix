import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Navigation,
  Map as MapIcon,
  Globe,
  RefreshCw,
  Home,
  MapPin,
  Compass,
  AlertCircle,
  Loader,
  Sun,
  Moon,
  CheckCircle
 
} from 'lucide-react';

// Dynamically load Leaflet CSS and JS
const loadLeaflet = () => {
  // Load CSS
  if (!document.querySelector('#leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  
  // Load JS
  if (!document.querySelector('#leaflet-js')) {
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

const MyLocationScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const leafletMapRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);

  // Load Leaflet on mount
  useEffect(() => {
    loadLeaflet();
  }, []);

  // Initialize map when location is available
  useEffect(() => {
    if (location && mapRef.current && !mapInitialized) {
      const initMap = () => {
        if (typeof (window as any).L !== 'undefined') {
          const L = (window as any).L;
          
          const map = L.map(mapRef.current!, {
            center: [location.latitude, location.longitude],
            zoom: 15,
            zoomControl: false
          });
          
          const tileLayer = mapType === 'standard' 
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
          
          L.tileLayer(tileLayer, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);
          
          const marker = L.marker([location.latitude, location.longitude], {
            draggable: false
          }).addTo(map);
          
          marker.bindPopup(`
            <strong>You are here</strong><br />
            ${address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
          `);
          
          L.control.zoom({
            position: 'topright'
          }).addTo(map);
          
          leafletMapRef.current = map;
          markerRef.current = marker;
          setMapInitialized(true);
        } else {
          setTimeout(initMap, 500);
        }
      };
      
      initMap();
    }
  }, [location, mapInitialized, address]);

  // Update map when map type changes
  useEffect(() => {
    if (leafletMapRef.current && mapInitialized) {
      const L = (window as any).L;
      leafletMapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          leafletMapRef.current.removeLayer(layer);
        }
      });
      
      const tileLayer = mapType === 'standard' 
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      
      L.tileLayer(tileLayer, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(leafletMapRef.current);
    }
  }, [mapType, mapInitialized]);

  // Update marker when address changes
  useEffect(() => {
    if (markerRef.current && location && address) {
      markerRef.current.setPopupContent(`
        <strong>You are here</strong><br />
        ${address}
      `);
    }
  }, [address, location]);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      } catch (err) {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }

      setLocation({ latitude, longitude });
      
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([latitude, longitude], 15);
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
      }
      
    } catch (err: any) {
      console.error('Error getting location:', err);
      
      let errorMessage = 'Failed to get your location. ';
      if (err.code === 1) {
        errorMessage += 'Please allow location access in your browser settings.';
      } else if (err.code === 2) {
        errorMessage += 'Location unavailable. Please check your GPS or try again.';
      } else if (err.code === 3) {
        errorMessage += 'Location request timed out. Please try again.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Get IP location (fallback)
  const getIPLocation = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data && data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        const city = data.city || '';
        const region = data.region || '';
        const country = data.country_name || '';
        const addressStr = [city, region, country].filter(Boolean).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        setLocation({ latitude: lat, longitude: lng });
        setAddress(addressStr);
      } else {
        setError('Could not get location from IP. Please allow location access.');
      }
    } catch (err) {
      setError('Failed to get IP location. Please allow location access.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initialize location on mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Center on location
  const centerOnLocation = useCallback(() => {
    if (location && leafletMapRef.current) {
      leafletMapRef.current.setView([location.latitude, location.longitude], 15);
    }
  }, [location]);

  // Open in Google Maps
  const openInGoogleMaps = useCallback(() => {
    if (location) {
      window.open(
        `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
        '_blank'
      );
    }
  }, [location]);

  // Toggle map type
  const toggleMapType = useCallback(() => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  }, []);

  // Navigate back to dashboard
  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Getting your location...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !location) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Location Error</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={getCurrentLocation}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={getIPLocation}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Use IP Location
            </button>
            <button
              onClick={handleBack}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">My Location</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current position</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                onClick={centerOnLocation}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md flex items-center justify-center"
              >
                <Navigation className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[55vh] bg-gray-200 dark:bg-gray-700">
        {location ? (
          <>
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                onClick={toggleMapType}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2.5 shadow-lg flex items-center gap-2 transition-colors border-none"
              >
                {mapType === 'standard' ? (
                  <>
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Satellite</span>
                  </>
                ) : (
                  <>
                    <MapIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Map</span>
                  </>
                )}
              </button>
              
              <button
                onClick={centerOnLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors border-none"
              >
                <Navigation className="w-5 h-5" />
              </button>
              
              <button
                onClick={openInGoogleMaps}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors border-none"
              >
                <Compass className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Location Info Card */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Current Location</h2>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latitude</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {location?.latitude.toFixed(6) || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Longitude</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {location?.longitude.toFixed(6) || 'N/A'}
              </p>
            </div>
          </div>

          {/* Address */}
          {address && (
            <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
              <Home className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">{address}</p>
            </div>
          )}

          {/* Status */}
          {location && (
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">Location active</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={getCurrentLocation}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={getIPLocation}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              <Globe className="w-4 h-4" />
              IP Location
            </button>
          </div>
        </div>
      </div>

      {/* Refresh Overlay */}
      {refreshing && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 text-center">Updating location...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLocationScreen;