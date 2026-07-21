// src/pages/admin/RequestsManagement.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  RefreshCw,
  Search,
  X,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  MapPin,
  Phone,
  Mail,
  User,
  Car,
  CreditCard,
  Calendar,
  Loader2,
  List,
  Trash2,
  Check,
  XCircle,
  DollarSign,
  FileText,
  Zap,
  ExternalLink,
  ChevronDown,
  Navigation,
  Map as MapIcon,
  Globe
} from 'lucide-react';

// Dynamically load Leaflet CSS and JS
const loadLeaflet = () => {
  if (!document.querySelector('#leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  
  if (!document.querySelector('#leaflet-js')) {
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const PUBLIC_REQUESTS_URL = `${API_BASE_URL}/public-requests/`;

// Types
interface PublicRequest {
  id: number;
  request_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  requested_service: string;
  request_description: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
  license_plate: string;
  vehicle_details: string;
  service_location: string;
  location_maps_link: string;
  location_latitude: string;
  location_longitude: string;
  preferred_service_date: string;
  preferred_service_time: string;
  formatted_date: string;
  formatted_time: string;
  request_urgency: string;
  urgency_display: string;
  is_urgent_request: boolean;
  budget_minimum: string;
  budget_maximum: string;
  is_budget_flexible: boolean;
  request_status: string;
  request_status_display: string;
  customer_notes: string;
  request_created: string;
  request_updated: string;
  approved_by?: string | null;
  approved_at?: string | null;
  fixed_by?: string | null;
  fixed_at?: string | null;
  updated_by?: string | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  details?: { label: string; value: string }[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  details
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500" />;
      case 'confirm':
        return <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-yellow-500" />;
      case 'info':
        return <Info className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-500" />;
      default:
        return <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-500" />;
    }
  };

  const getButtonColors = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      case 'confirm':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700';
      case 'info':
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${
            type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
            type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
            type === 'confirm' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            'bg-cyan-100 dark:bg-cyan-900/30'
          }`}>
            {getIcon()}
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {message}
        </p>

        {details && details.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 text-left w-full">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-xs text-gray-500 dark:text-gray-400">{detail.label}</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()} ${type === 'success' ? 'shadow-green-500/30' : type === 'error' ? 'shadow-red-500/30' : type === 'confirm' ? 'shadow-yellow-500/30' : 'shadow-cyan-500/30'}`}
            >
              {confirmText}
            </button>
          )}
          {!onConfirm && type === 'success' && (
            <button
              onClick={onCancel}
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()}`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RequestsManagement() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  const getLoggedInUserName = useCallback((): string => {
    if (user) {
      const firstName = (user as any).first_name || (user as any).firstName || '';
      const lastName = (user as any).last_name || (user as any).lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      const username = (user as any).username || '';
      const email = (user as any).email || '';
      return username || email || 'Admin User';
    }
    return 'Admin User';
  }, [user]);

  const [requests, setRequests] = useState<PublicRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PublicRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PublicRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [updatingRequest, setUpdatingRequest] = useState<number | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  
  // Map states
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [mapLoading, setMapLoading] = useState(true);
  const [customerLocation, setCustomerLocation] = useState<UserLocation | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // Confirmation Modal
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    details?: { label: string; value: string }[];
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const statusOptions = [
    { value: 'all', label: 'All', icon: <List className="w-3.5 h-3.5" />, color: 'text-gray-500' },
    { value: 'pending', label: 'Pending', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-yellow-500' },
    { value: 'viewed', label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" />, color: 'text-cyan-500' },
    { value: 'offers_received', label: 'Offers', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'text-purple-500' },
    { value: 'accepted', label: 'Accepted', icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-green-500' },
    { value: 'in_progress', label: 'In Progress', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-indigo-500' },
    { value: 'completed', label: 'Completed', icon: <Check className="w-3.5 h-3.5" />, color: 'text-emerald-500' },
    { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-red-500' },
    { value: 'expired', label: 'Expired', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-gray-500' },
  ];

  const showConfirmationModal = (
    type: 'success' | 'error' | 'confirm' | 'info',
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
    details?: { label: string; value: string }[]
  ) => {
    setConfirmationModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      onCancel: onCancel || (() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))),
      confirmText,
      cancelText,
      details,
    });
  };

  const formatCurrency = useCallback((amount: string | null): string => {
    if (!amount || amount === '0.00') return 'TZS 0';
    return `TZS ${new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 0 }).format(parseFloat(amount))}`;
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    const map: Record<string, string> = {
      pending: 'text-yellow-500',
      viewed: 'text-cyan-500',
      offers_received: 'text-purple-500',
      accepted: 'text-green-500',
      in_progress: 'text-indigo-500',
      completed: 'text-emerald-500',
      cancelled: 'text-red-500',
      expired: 'text-gray-500',
    };
    return map[status] || 'text-yellow-500';
  }, []);

  const getStatusBgColor = useCallback((status: string): string => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-500/10 dark:bg-yellow-500/20',
      viewed: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      offers_received: 'bg-purple-500/10 dark:bg-purple-500/20',
      accepted: 'bg-green-500/10 dark:bg-green-500/20',
      in_progress: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      completed: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      cancelled: 'bg-red-500/10 dark:bg-red-500/20',
      expired: 'bg-gray-500/10 dark:bg-gray-500/20',
    };
    return map[status] || 'bg-yellow-500/10';
  }, []);

  const getUrgencyColor = useCallback((urgency: string): string => {
    const map: Record<string, string> = {
      standard: 'text-gray-500',
      priority: 'text-yellow-500',
      emergency: 'text-red-500',
    };
    return map[urgency] || 'text-gray-500';
  }, []);

  const formatStatus = useCallback((status: string): string => {
    const map: Record<string, string> = {
      pending: 'Pending',
      viewed: 'Viewed',
      offers_received: 'Offers Received',
      accepted: 'Accepted',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      expired: 'Expired',
    };
    return map[status] || status;
  }, []);

  const formatDateTime = useCallback((dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }, []);

  const countByStatus = useCallback((status: string): number => {
    if (status === 'all') return requests.length;
    return requests.filter(r => r.request_status === status).length;
  }, [requests]);

  const getCoordinatesFromRequest = useCallback((request: PublicRequest): UserLocation | null => {
    if (request.location_latitude && request.location_longitude) {
      const lat = parseFloat(request.location_latitude);
      const lng = parseFloat(request.location_longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
    if (request.location_maps_link) {
      const match = request.location_maps_link.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { latitude: lat, longitude: lng };
        }
      }
    }
    return null;
  }, []);

  const makePhoneCall = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      showConfirmationModal('error', 'Error', 'No phone number available');
      return;
    }
    let cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    window.location.href = `tel:${cleanNumber}`;
  }, []);

  // Load Leaflet on mount
  useEffect(() => {
    loadLeaflet();
  }, []);

  // Initialize map when map modal opens
  useEffect(() => {
    if (showMapModal && customerLocation && mapRef.current && !mapInitialized) {
      const initMap = () => {
        if (typeof (window as any).L !== 'undefined') {
          const L = (window as any).L;
          
          const map = L.map(mapRef.current!, {
            center: [customerLocation.latitude, customerLocation.longitude],
            zoom: 15,
            zoomControl: false
          });
          
          const tileLayer = mapType === 'standard' 
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
          
          L.tileLayer(tileLayer, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);
          
          // Custom marker icon
          const customIcon = L.divIcon({
            html: `
              <div style="
                background-color: #ef4444;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
              ">
                📍
              </div>
            `,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });
          
          const marker = L.marker([customerLocation.latitude, customerLocation.longitude], {
            icon: customIcon,
            draggable: false
          }).addTo(map);
          
          // Popup content
          const popupContent = `
            <div style="padding: 8px; max-width: 250px;">
              <strong style="font-size: 14px; color: #0f172a;">📍 ${selectedRequest?.customer_name}</strong><br />
              <span style="font-size: 12px; color: #475569;">${selectedRequest?.requested_service}</span><br />
              <span style="font-size: 12px; color: #0891b2; font-weight: bold;">${selectedRequest?.customer_phone}</span><br />
              <span style="font-size: 11px; color: #64748b;">${selectedRequest?.service_location || 'Location not specified'}</span>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          
          // Add radius circle
          const circle = L.circle([customerLocation.latitude, customerLocation.longitude], {
            radius: 500,
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.1,
            weight: 2
          }).addTo(map);
          
          // Add zoom control
          L.control.zoom({
            position: 'topright'
          }).addTo(map);
          
          leafletMapRef.current = map;
          markerRef.current = marker;
          circleRef.current = circle;
          setMapInitialized(true);
          setMapLoading(false);
        } else {
          setTimeout(initMap, 500);
        }
      };
      
      initMap();
    }
  }, [showMapModal, customerLocation, mapInitialized, mapType, selectedRequest]);

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

  // Cleanup map on modal close
  useEffect(() => {
    if (!showMapModal && leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
      setMapInitialized(false);
    }
  }, [showMapModal]);

  // API Functions
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(PUBLIC_REQUESTS_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const requestsList = data.results || data;
      setRequests(Array.isArray(requestsList) ? requestsList : []);
    } catch (error: any) {
      showConfirmationModal('error', 'Error', 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const updateRequestStatus = useCallback(async (requestId: number, newStatus: string) => {
    try {
      setUpdatingRequest(requestId);
      
      const userName = getLoggedInUserName();
      const now = new Date().toISOString();
      
      const payload: any = { request_status: newStatus };
      
      if (newStatus === 'accepted') {
        payload.approved_by = userName;
        payload.approved_at = now;
      } else if (newStatus === 'in_progress' || newStatus === 'completed') {
        payload.fixed_by = userName;
        payload.fixed_at = now;
      }
      
      payload.updated_by = userName;
      
      const response = await fetch(`${PUBLIC_REQUESTS_URL}${requestId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}`);
      }
      
      await fetchRequests();
      showConfirmationModal('success', 'Success', `✓ Status updated to ${formatStatus(newStatus)}`);
      
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.message || 'Failed to update status');
    } finally {
      setUpdatingRequest(null);
    }
  }, [showConfirmationModal, formatStatus, getLoggedInUserName, fetchRequests]);

  const deleteRequest = useCallback(async () => {
    if (!selectedRequest) return;
    try {
      setUpdatingRequest(selectedRequest.id);
      const response = await fetch(`${PUBLIC_REQUESTS_URL}${selectedRequest.id}/`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) throw new Error(`HTTP ${response.status}`);
      
      await fetchRequests();
      showConfirmationModal('success', 'Deleted', 'Request deleted successfully!');
      setShowDeleteModal(false);
      setShowModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.message || 'Failed to delete request');
    } finally {
      setUpdatingRequest(null);
    }
  }, [selectedRequest, showConfirmationModal, fetchRequests]);

  // Event Handlers
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  const handleViewDetails = useCallback((request: PublicRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  }, []);

  const handleStatusUpdate = useCallback((requestId: number, newStatus: string) => {
    setShowStatusDropdown(null);
    showConfirmationModal(
      'confirm',
      'Update Status',
      `Change status to "${formatStatus(newStatus)}"?`,
      () => updateRequestStatus(requestId, newStatus),
      undefined,
      'Update',
      'Cancel'
    );
  }, [formatStatus, updateRequestStatus]);

  const handleDelete = useCallback((request: PublicRequest) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  }, []);

  const openMapModal = useCallback(async (request: PublicRequest) => {
    setSelectedRequest(request);
    setMapLoading(true);
    const coords = getCoordinatesFromRequest(request);
    if (coords) {
      setCustomerLocation(coords);
      setMapInitialized(false);
      setShowMapModal(true);
    } else {
      showConfirmationModal('info', 'No Location', 'This request does not have location coordinates');
    }
  }, [getCoordinatesFromRequest]);

  const centerOnLocation = useCallback(() => {
    if (customerLocation && leafletMapRef.current) {
      leafletMapRef.current.setView([customerLocation.latitude, customerLocation.longitude], 15);
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  }, [customerLocation]);

  const toggleMapType = useCallback(() => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  }, []);

  const openInGoogleMaps = useCallback(() => {
    if (customerLocation) {
      window.open(
        `https://www.google.com/maps?q=${customerLocation.latitude},${customerLocation.longitude}`,
        '_blank'
      );
    }
  }, [customerLocation]);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = [...requests];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.request_status === statusFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.customer_name.toLowerCase().includes(query) ||
        r.customer_phone.includes(query) ||
        r.requested_service.toLowerCase().includes(query) ||
        r.request_code.toLowerCase().includes(query)
      );
    }
    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter]);

  // Render Functions
  const renderRequestCard = (request: PublicRequest) => {
    const statusColor = getStatusColor(request.request_status);
    const statusBgColor = getStatusBgColor(request.request_status);
    const urgencyColor = getUrgencyColor(request.request_urgency);
    const hasLocation = !!(request.location_latitude || request.location_maps_link);
    const budgetRange = formatCurrency(request.budget_minimum) + ' - ' + formatCurrency(request.budget_maximum);
    const isUpdating = updatingRequest === request.id;

    return (
      <div
        key={`request-${request.id}`}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBgColor} ${statusColor}`}>
                {formatStatus(request.request_status)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                #{request.request_code}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${urgencyColor} bg-current/10`}>
                {request.urgency_display}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {request.requested_service}
            </h3>

            {/* Customer Row - BOLDED */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {request.customer_name}
                </span>
              </div>
              <button
                onClick={() => makePhoneCall(request.customer_phone)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
              >
                <Phone className="w-3 h-3 text-cyan-500" />
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  {request.customer_phone}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5" />
                {request.vehicle_details || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-cyan-600 dark:text-cyan-400 font-medium">{budgetRange}</span>
              </span>
              {request.is_budget_flexible && (
                <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  Flexible
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {request.formatted_date} at {request.formatted_time}
              </span>
              {request.service_location && (
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="w-3 h-3" />
                  {request.service_location}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleViewDetails(request)}
              className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {hasLocation && (
              <button
                onClick={() => openMapModal(request)}
                className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                title="View on Map"
              >
                <MapPin className="w-4 h-4" />
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(showStatusDropdown === request.id.toString() ? null : request.id.toString())}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Change Status"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showStatusDropdown === request.id.toString() && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                  {statusOptions.filter(opt => opt.value !== 'all').map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusUpdate(request.id, opt.value)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <span className={opt.color}>{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleDelete(request)}
              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Status Update Buttons */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => handleStatusUpdate(request.id, 'accepted')}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleStatusUpdate(request.id, 'in_progress')}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
          >
            Start
          </button>
          <button
            onClick={() => handleStatusUpdate(request.id, 'completed')}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading service requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Service Requests</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  {filteredRequests.length} requests found
                </p>
              </div>
            </div>
            <button
              onClick={fetchRequests}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Search by name, phone, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {statusOptions.map((option) => (
              <button
                key={`filter-${option.value}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  statusFilter === option.value
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setStatusFilter(option.value)}
              >
                {option.icon}
                {option.label}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] ${
                  statusFilter === option.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {countByStatus(option.value)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Service Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customer requests will appear here</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Requests Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'No requests match the current filter'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => renderRequestCard(request))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBgColor(selectedRequest.request_status)} ${getStatusColor(selectedRequest.request_status)}`}>
                    {formatStatus(selectedRequest.request_status)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    #{selectedRequest.request_code}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Customer Information */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Customer Information</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{selectedRequest.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Phone:</span>
                    <button onClick={() => makePhoneCall(selectedRequest.customer_phone)} className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
                      {selectedRequest.customer_phone}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.customer_email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Service Details</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Service:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.requested_service}</span>
                  </div>
                  {selectedRequest.request_description && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-cyan-500 mt-0.5" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Description:</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedRequest.request_description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Information</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Vehicle:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.vehicle_details}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Plate:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.license_plate}</span>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Budget</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Range:</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedRequest.budget_minimum)} - {formatCurrency(selectedRequest.budget_maximum)}
                    </span>
                  </div>
                  {selectedRequest.is_budget_flexible && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Flexible:</span>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">Yes, negotiable</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Date:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.formatted_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Time:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.formatted_time}</span>
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Assignment Info</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  {selectedRequest.fixed_by && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Fixed By:</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{selectedRequest.fixed_by}</span>
                    </div>
                  )}
                  {selectedRequest.fixed_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Fixed At:</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">{formatDateTime(selectedRequest.fixed_at)}</span>
                    </div>
                  )}
                  {selectedRequest.approved_by && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Approved By:</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{selectedRequest.approved_by}</span>
                    </div>
                  )}
                  {selectedRequest.approved_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Approved At:</span>
                      <span className="text-sm text-green-600 dark:text-green-400">{formatDateTime(selectedRequest.approved_at)}</span>
                    </div>
                  )}
                  {selectedRequest.updated_by && (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-cyan-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Updated By:</span>
                      <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{selectedRequest.updated_by}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last Updated:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(selectedRequest.request_updated)}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              {selectedRequest.service_location && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Address:</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedRequest.service_location}</span>
                    </div>
                    {(selectedRequest.location_latitude || selectedRequest.location_maps_link) && (
                      <button
                        onClick={() => { setShowModal(false); openMapModal(selectedRequest); }}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        View on Map
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Notes */}
              {selectedRequest.customer_notes && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Customer Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.customer_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Modal - Using Leaflet */}
      {showMapModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
          <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
            <button
              onClick={() => setShowMapModal(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Customer Location</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">#{selectedRequest.request_code}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-1 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{selectedRequest.customer_name}</span>
              </div>
              <button
                onClick={() => makePhoneCall(selectedRequest.customer_phone)}
                className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
            {mapLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                <p className="mt-3 text-sm text-gray-500">Loading map...</p>
              </div>
            ) : customerLocation ? (
              <>
                <div ref={mapRef} className="w-full h-full" />
                
                {/* Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
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
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>

                {/* Location Info Overlay */}
                <div className="absolute top-4 left-4 right-24 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg z-10">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {selectedRequest.customer_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {selectedRequest.service_location || 'Location not specified'}
                      </p>
                      <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                        {customerLocation.latitude.toFixed(6)}, {customerLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No location data available</p>
                <p className="text-xs text-gray-400">This request doesn't have coordinates</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRequest && (
        <ConfirmationModal
          isOpen={true}
          type="confirm"
          title="Delete Request"
          message={`Delete #${selectedRequest.request_code} from ${selectedRequest.customer_name}? This cannot be undone.`}
          onConfirm={deleteRequest}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        type={confirmationModal.type}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        details={confirmationModal.details}
      />

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-marker {
          background: none;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #0f172a !important;
          border-color: #e2e8f0 !important;
        }
        .dark .leaflet-control-zoom a {
          background: #1e293b !important;
          color: #f1f5f9 !important;
          border-color: #334155 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f1f5f9 !important;
        }
        .dark .leaflet-control-zoom a:hover {
          background: #334155 !important;
        }
      `}</style>
    </div>
  );
}