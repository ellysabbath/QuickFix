import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface Workshop {
  id: number;
  workshop_name: string;
  workshop_owner: number | null;
  workshop_owner_name?: string;
  workshop_owner_phone?: string;
  workshop_email: string;
  workshop_phone: string;
  workshop_address: string;
  workshop_city: string | null;
  workshop_latitude: string | null;
  workshop_longitude: string | null;
  is_workshop_verified: boolean;
  is_workshop_active: boolean;
  workshop_created: string;
  workshop_updated: string;
}

interface WorkshopFormData {
  workshop_name: string;
  workshop_email: string;
  workshop_phone: string;
  workshop_address: string;
  workshop_city: string;
  workshop_latitude: string;
  workshop_longitude: string;
}

// Success Modal
const SuccessModal: React.FC<{
  visible: boolean;
  message: string;
  onClose: () => void;
}> = ({ visible, message, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30 animate-pulse">
          <span className="text-white text-5xl font-light">✓</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal: React.FC<{
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}> = ({ visible, message, onConfirm, onCancel, isDestructive = false }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDestructive 
              ? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30' 
              : 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30'
          }`}>
            <span className={`text-4xl font-bold ${isDestructive ? 'text-red-500' : 'text-cyan-500'}`}>
              {isDestructive ? '!' : '?'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isDestructive ? 'Delete Workshop' : 'Confirm Action'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`flex-1 py-3.5 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg ${
              isDestructive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/30' 
                : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-cyan-500/30'
            }`}
            onClick={onConfirm}
          >
            {isDestructive ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Workshop Card Component
const WorkshopCard: React.FC<{
  workshop: Workshop;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}> = ({ workshop, onEdit, onDelete, onToggleStatus }) => {
  const statusColor = workshop.is_workshop_active ? 'text-green-500' : 'text-red-500';
  const statusBg = workshop.is_workshop_active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const statusText = workshop.is_workshop_active ? 'Active' : 'Inactive';

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full ${statusBg}`}>
          <span className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
          <span className={`text-xs font-semibold tracking-wide ${statusColor}`}>{statusText}</span>
        </div>
        <button
          onClick={onToggleStatus}
          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
            workshop.is_workshop_active 
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50' 
              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
          }`}
        >
          {workshop.is_workshop_active ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      {/* Workshop Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
          <span className="text-white text-xl font-bold tracking-wider">WS</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {workshop.workshop_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="text-gray-400">📍</span>
            {workshop.workshop_city || 'City not specified'}
          </p>
        </div>
        {workshop.is_workshop_verified && (
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
            Verified
          </div>
        )}
      </div>

      {/* Contact Details */}
      <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-cyan-500 font-bold w-5 text-center">@</span>
          <span className="flex-1 truncate">{workshop.workshop_email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-cyan-500 font-bold w-5 text-center">#</span>
          <span>{workshop.workshop_phone}</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-cyan-500 font-bold w-5 text-center">@</span>
          <span className="flex-1 leading-relaxed">{workshop.workshop_address}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400">
          Added {new Date(workshop.workshop_created).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-cyan-500/30"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-red-500/30"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkshopsManagement: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Form Data
  const [formData, setFormData] = useState<WorkshopFormData>({
    workshop_name: '',
    workshop_email: '',
    workshop_phone: '',
    workshop_address: '',
    workshop_city: '',
    workshop_latitude: '',
    workshop_longitude: '',
  });

  // Fetch workshops
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWorkshops: Workshop[] = [
        {
          id: 1,
          workshop_name: 'AutoCare Premium Services',
          workshop_owner: 1,
          workshop_owner_name: 'James Mwangi',
          workshop_owner_phone: '+255 712 345 678',
          workshop_email: 'info@autocare.co.tz',
          workshop_phone: '+255 765 432 100',
          workshop_address: 'Plot 45, Kimweri Street, Mbezi Beach',
          workshop_city: 'Dar es Salaam',
          workshop_latitude: '-6.7924',
          workshop_longitude: '39.2083',
          is_workshop_verified: true,
          is_workshop_active: true,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
        },
        {
          id: 2,
          workshop_name: 'Elite Auto Garage',
          workshop_owner: 2,
          workshop_owner_name: 'Sarah Kileo',
          workshop_owner_phone: '+255 713 456 789',
          workshop_email: 'info@eliteauto.co.tz',
          workshop_phone: '+255 765 432 101',
          workshop_address: 'Block 12, Nyerere Road, Temeke',
          workshop_city: 'Dar es Salaam',
          workshop_latitude: '-6.8200',
          workshop_longitude: '39.2600',
          is_workshop_verified: true,
          is_workshop_active: true,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
        },
        {
          id: 3,
          workshop_name: 'QuickFix Motors',
          workshop_owner: 3,
          workshop_owner_name: 'Michael Masaki',
          workshop_owner_phone: '+255 714 567 890',
          workshop_email: 'info@quickfix.co.tz',
          workshop_phone: '+255 765 432 102',
          workshop_address: 'Plot 78, Mandela Road, Ubungo',
          workshop_city: 'Dar es Salaam',
          workshop_latitude: '-6.7800',
          workshop_longitude: '39.1800',
          is_workshop_verified: false,
          is_workshop_active: true,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
        },
      ];
      
      setWorkshops(mockWorkshops);
    } catch (error: any) {
      console.error('Fetch error:', error);
      alert(error.message || 'Failed to load workshops');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Filter workshops
  const filteredWorkshops = workshops.filter(workshop =>
    workshop.workshop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.workshop_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.workshop_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.workshop_phone?.includes(searchQuery)
  );

  // Open add modal
  const handleAdd = () => {
    setEditingWorkshop(null);
    setFormData({
      workshop_name: '',
      workshop_email: '',
      workshop_phone: '',
      workshop_address: '',
      workshop_city: '',
      workshop_latitude: '',
      workshop_longitude: '',
    });
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      workshop_name: workshop.workshop_name || '',
      workshop_email: workshop.workshop_email || '',
      workshop_phone: workshop.workshop_phone || '',
      workshop_address: workshop.workshop_address || '',
      workshop_city: workshop.workshop_city || '',
      workshop_latitude: workshop.workshop_latitude || '',
      workshop_longitude: workshop.workshop_longitude || '',
    });
    setShowModal(true);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.workshop_name.trim()) {
      alert('Workshop name is required');
      return false;
    }
    if (!formData.workshop_email.trim()) {
      alert('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workshop_email)) {
      alert('Enter a valid email address');
      return false;
    }
    if (!formData.workshop_phone.trim()) {
      alert('Phone number is required');
      return false;
    }
    if (!formData.workshop_address.trim()) {
      alert('Address is required');
      return false;
    }
    return true;
  };

  // Save workshop
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    const newWorkshop: Workshop = {
      id: Date.now(),
      workshop_name: formData.workshop_name.trim(),
      workshop_owner: null,
      workshop_email: formData.workshop_email.trim(),
      workshop_phone: formData.workshop_phone.trim(),
      workshop_address: formData.workshop_address.trim(),
      workshop_city: formData.workshop_city.trim() || null,
      workshop_latitude: formData.workshop_latitude || null,
      workshop_longitude: formData.workshop_longitude || null,
      is_workshop_verified: false,
      is_workshop_active: true,
      workshop_created: new Date().toISOString(),
      workshop_updated: new Date().toISOString(),
    };

    if (editingWorkshop) {
      setWorkshops(prev => prev.map(w => 
        w.id === editingWorkshop.id ? { ...w, ...newWorkshop } : w
      ));
      setSuccessMessage('Workshop updated successfully!');
    } else {
      setWorkshops(prev => [newWorkshop, ...prev]);
      setSuccessMessage('Workshop added successfully!');
    }

    setShowSuccessModal(true);
    setShowModal(false);
    setIsSubmitting(false);
  };

  // Delete workshop
  const handleDelete = (workshopId: number) => {
    setWorkshopToDelete(workshopId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!workshopToDelete) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setWorkshops(prev => prev.filter(w => w.id !== workshopToDelete));
    setSuccessMessage('Workshop deleted successfully!');
    setShowSuccessModal(true);
    setShowDeleteModal(false);
    setWorkshopToDelete(null);
    setIsSubmitting(false);
  };

  // Toggle workshop status
  const handleToggleStatus = async (workshop: Workshop) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setWorkshops(prev => prev.map(w =>
      w.id === workshop.id ? { ...w, is_workshop_active: !w.is_workshop_active } : w
    ));
    
    setSuccessMessage(`Workshop ${!workshop.is_workshop_active ? 'activated' : 'deactivated'} successfully!`);
    setShowSuccessModal(true);
    setIsSubmitting(false);
  };

  // Stats
  const stats = {
    total: workshops.length,
    active: workshops.filter(w => w.is_workshop_active).length,
    verified: workshops.filter(w => w.is_workshop_verified).length,
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-cyan-500/30"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  Fix Services
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage all auto workshop locations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={handleAdd}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
              >
                +
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-700/50 rounded-2xl px-5 py-3 mb-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <span className="text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
              placeholder="Search by name, city, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-lg font-bold">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white text-xl font-bold">#</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Workshops</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-white text-xl font-bold">★</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.verified}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workshops List */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        {filteredWorkshops.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-5xl font-bold text-gray-400 dark:text-gray-500">WS</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No workshops found' : 'No workshops available'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? 'Try a different search term' : 'Add your first workshop to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAdd}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
              >
                + Add First Workshop
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                onEdit={() => handleEdit(workshop)}
                onDelete={() => handleDelete(workshop.id)}
                onToggleStatus={() => handleToggleStatus(workshop)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
                </h3>
                <p className="text-sm text-white/90 mt-1">
                  {editingWorkshop ? 'Update workshop details' : 'Register a new auto workshop'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl font-bold transition-all duration-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              {/* Workshop Name */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Workshop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                  placeholder="Enter workshop name"
                  value={formData.workshop_name}
                  onChange={(e) => setFormData({...formData, workshop_name: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="workshop@email.com"
                    value={formData.workshop_email}
                    onChange={(e) => setFormData({...formData, workshop_email: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="+255 XXX XXX XXX"
                    value={formData.workshop_phone}
                    onChange={(e) => setFormData({...formData, workshop_phone: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none resize-none min-h-[70px]"
                  placeholder="Street, building, area..."
                  value={formData.workshop_address}
                  onChange={(e) => setFormData({...formData, workshop_address: e.target.value})}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              {/* City */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  City <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                  placeholder="e.g., Dar es Salaam, Arusha"
                  value={formData.workshop_city}
                  onChange={(e) => setFormData({...formData, workshop_city: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Latitude</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="-6.7924"
                    value={formData.workshop_latitude}
                    onChange={(e) => setFormData({...formData, workshop_latitude: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Longitude</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="39.2083"
                    value={formData.workshop_longitude}
                    onChange={(e) => setFormData({...formData, workshop_longitude: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <button
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-cyan-500/30 disabled:opacity-50 mb-3"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (editingWorkshop ? 'Update Workshop' : 'Save Workshop')}
              </button>
              
              <button
                className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl transition-all duration-200 border-2 border-gray-200 dark:border-gray-600"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        message="Are you sure you want to delete this workshop? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setWorkshopToDelete(null);
        }}
        isDestructive={true}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Loading Overlay */}
      {isSubmitting && !showSuccessModal && !showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center min-w-[180px]">
            <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Processing...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WorkshopsManagement;