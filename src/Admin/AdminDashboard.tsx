// src/pages/admin/MemberManagement.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  RefreshCw,
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Mail,
  User,
  Shield,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Power,
  PowerOff,
  Users,
  UserCheck,
  UserX,
  Building2,
  Wrench,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Member {
  id: number;
  mobile_number: string;
  email: string | null;
  full_name: string;
  role: 'admin' | 'mechanic' | 'garage_owner' | 'customer';
  role_display: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | null;
}

interface StatsData {
  customer: number;
  mechanic: number;
  garage_owner: number;
  admin: number;
  total: number;
  active: number;
  inactive: number;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = 'https://autofix.pythonanywhere.com/api/members';

// ============================================================================
// CONFIRMATION MODAL COMPONENT
// ============================================================================

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
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30';
      case 'confirm':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-yellow-500/30';
      case 'info':
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/30';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/30';
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
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()}`}
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

// ============================================================================
// CONSTANTS
// ============================================================================

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator', icon: <Shield className="w-4 h-4" />, color: '#ef4444' },
  { value: 'garage_owner', label: 'Garage Owner', icon: <Building2 className="w-4 h-4" />, color: '#10b981' },
  { value: 'mechanic', label: 'Mechanic', icon: <Wrench className="w-4 h-4" />, color: '#f59e0b' },
  { value: 'customer', label: 'Customer', icon: <User className="w-4 h-4" />, color: '#0891b2' },
];

const ROLE_COLORS: Record<string, string> = {
  admin: '#ef4444',
  garage_owner: '#10b981',
  mechanic: '#f59e0b',
  customer: '#0891b2',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MemberManagement() {
  const navigate = useNavigate();
  const { user: _user } = useUser(); // Renamed to indicate intentionally unused
  const [showSidebar, setShowSidebar] = useState(false);

  // State
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  // Form states
  const [createForm, setCreateForm] = useState({
    mobile_number: '',
    email: '',
    full_name: '',
    role: 'customer' as const,
    password: '',
    confirm_password: '',
  });

  const [editForm, setEditForm] = useState<Partial<Member>>({
    full_name: '',
    email: '',
    mobile_number: '',
    role: 'customer',
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

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

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch members: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        let membersList = data.members || [];
        
        if (selectedRoleFilter !== 'all') {
          membersList = membersList.filter((m: Member) => m.role === selectedRoleFilter);
        }
        
        setMembers(membersList);
        setFilteredMembers(membersList);
      } else {
        setMembers([]);
        setFilteredMembers([]);
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error. Please check your connection.';
      showConfirmationModal('error', 'Error', errorMsg);
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRoleFilter]);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      
      const response = await fetch(`${API_BASE_URL}/statistics/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.statistics);
        }
      }
    } catch (error) {
      // Silent fail
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchMembers(), fetchStats()]);
    setRefreshing(false);
  }, [fetchMembers, fetchStats]);

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const handleCreateMember = async () => {
    if (!createForm.mobile_number) {
      showConfirmationModal('error', 'Error', 'Mobile number is required');
      return;
    }
    
    if (!createForm.password) {
      showConfirmationModal('error', 'Error', 'Password is required');
      return;
    }
    
    if (createForm.password !== createForm.confirm_password) {
      showConfirmationModal('error', 'Error', 'Passwords do not match');
      return;
    }
    
    if (createForm.password.length < 6) {
      showConfirmationModal('error', 'Error', 'Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showConfirmationModal('success', 'Success!', 'Member created successfully!');
        setShowCreateModal(false);
        setCreateForm({
          mobile_number: '',
          email: '',
          full_name: '',
          role: 'customer',
          password: '',
          confirm_password: '',
        });
        fetchMembers();
        fetchStats();
      } else {
        const errors = data.errors || data.error;
        showConfirmationModal('error', 'Error', typeof errors === 'object' ? JSON.stringify(errors) : errors);
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to create member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/update/${selectedMember.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showConfirmationModal('success', 'Success!', 'Member updated successfully!');
        setShowEditModal(false);
        fetchMembers();
        fetchStats();
      } else {
        showConfirmationModal('error', 'Error', JSON.stringify(data.errors));
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to update member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${selectedMember.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        showConfirmationModal('success', 'Deleted!', 'Member deleted successfully!');
        fetchMembers();
        fetchStats();
      } else {
        showConfirmationModal('error', 'Error', data.error || 'Failed to delete member');
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to delete member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedMember) return;
    
    const isActive = selectedMember.is_active;
    const action = isActive ? 'deactivate' : 'activate';
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${action}/${selectedMember.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        showConfirmationModal('success', 'Success!', `Member ${action}d successfully!`);
        fetchMembers();
        fetchStats();
      } else {
        showConfirmationModal('error', 'Error', data.error || `Failed to ${action} member`);
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', `Failed to ${action} member`);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // UI HELPERS
  // ============================================================================

  const getUserInitials = (member: Member): string => {
    if (member.full_name) {
      return member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return member.mobile_number.slice(-4);
  };

  const getDisplayName = (member: Member): string => {
    return member.full_name || member.mobile_number;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchMembers();
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = [...members];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.mobile_number.toLowerCase().includes(query) ||
        (member.full_name?.toLowerCase() || '').includes(query) ||
        (member.email?.toLowerCase() || '').includes(query)
      );
    }
    
    setFilteredMembers(filtered);
  }, [members, searchQuery]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderStats = () => {
    if (isLoadingStats) {
      return (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
        </div>
      );
    }
    
    if (!stats) return null;
    
    const statItems = [
      { label: 'Total', value: stats.total, color: 'bg-cyan-500', icon: <Users className="w-4 h-4" /> },
      { label: 'Active', value: stats.active, color: 'bg-green-500', icon: <UserCheck className="w-4 h-4" /> },
      { label: 'Inactive', value: stats.inactive, color: 'bg-red-500', icon: <UserX className="w-4 h-4" /> },
      { label: 'Customers', value: stats.customer, color: 'bg-blue-500', icon: <User className="w-4 h-4" /> },
      { label: 'Mechanics', value: stats.mechanic, color: 'bg-yellow-500', icon: <Wrench className="w-4 h-4" /> },
      { label: 'Garage Owners', value: stats.garage_owner, color: 'bg-emerald-500', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Admins', value: stats.admin, color: 'bg-red-500', icon: <Shield className="w-4 h-4" /> },
    ];

    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className={`flex-shrink-0 w-28 p-3 rounded-xl text-white ${stat.color}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {stat.icon}
              <span className="text-[10px] font-medium opacity-90">{stat.label}</span>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderFilterTabs = () => (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      <button
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
          selectedRoleFilter === 'all'
            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => setSelectedRoleFilter('all')}
      >
        <Users className="w-3.5 h-3.5" />
        All
      </button>
      
      {ROLE_OPTIONS.map(role => (
        <button
          key={role.value}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
            selectedRoleFilter === role.value
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setSelectedRoleFilter(role.value)}
        >
          {role.icon}
          {role.label}
        </button>
      ))}
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  // Loading state
  if (isLoading && members.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading members...</p>
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
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Member Management</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Manage users and roles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors shadow-md shadow-cyan-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Search by name, phone, or email..."
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

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          {renderStats()}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          {renderFilterTabs()}
        </div>
      </div>

      {/* Member Count */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredMembers.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{members.length}</span> members
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {filteredMembers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No members found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Click + to add your first member'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const roleColor = ROLE_COLORS[member.role] || '#6b7280';
              const initials = getUserInitials(member);
              const displayName = getDisplayName(member);

              return (
                <div
                  key={member.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: roleColor + '20' }}
                    >
                      <span className="text-sm font-bold" style={{ color: roleColor }}>{initials}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</span>
                        <span
                          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
                          style={{ backgroundColor: roleColor + '20', color: roleColor }}
                        >
                          {member.role_display}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.mobile_number}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                            {member.email || 'No email'}
                          </span>
                        </div>
                        
                        <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                          member.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-gray-400 mt-1">
                        Joined {formatDate(member.date_joined)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setEditForm({
                          full_name: member.full_name || '',
                          email: member.email || '',
                          mobile_number: member.mobile_number,
                          role: member.role,
                        });
                        setShowEditModal(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-[10px] font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    
                    {member.is_active ? (
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          showConfirmationModal(
                            'confirm',
                            'Deactivate Member',
                            `Deactivate ${displayName}? They will not be able to log in.`,
                            handleToggleStatus,
                            undefined,
                            'Deactivate',
                            'Cancel'
                          );
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-[10px] font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
                      >
                        <PowerOff className="w-3 h-3" />
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          showConfirmationModal(
                            'confirm',
                            'Activate Member',
                            `Activate ${displayName}? They will be able to log in again.`,
                            handleToggleStatus,
                            undefined,
                            'Activate',
                            'Cancel'
                          );
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                      >
                        <Power className="w-3 h-3" />
                        Activate
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        showConfirmationModal(
                          'confirm',
                          'Delete Member',
                          `Delete ${displayName}? This action cannot be undone.`,
                          handleDeleteMember,
                          undefined,
                          'Delete',
                          'Cancel'
                        );
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Member</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="+1234567890"
                    value={createForm.mobile_number}
                    onChange={(e) => setCreateForm({...createForm, mobile_number: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="user@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Full Name"
                    value={createForm.full_name}
                    onChange={(e) => setCreateForm({...createForm, full_name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Role</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ROLE_OPTIONS.map(role => (
                      <button
                        key={role.value}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          createForm.role === role.value
                            ? 'text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                        style={{
                          backgroundColor: createForm.role === role.value ? role.color : undefined
                        }}
                        onClick={() => setCreateForm({...createForm, role: role.value as any})}
                      >
                        {role.icon}
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Confirm"
                      value={createForm.confirm_password}
                      onChange={(e) => setCreateForm({...createForm, confirm_password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMember}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Create Member'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Member</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedMember.mobile_number}</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: ROLE_COLORS[selectedMember.role] + '20' }}
                >
                  <span className="text-xl font-bold" style={{ color: ROLE_COLORS[selectedMember.role] }}>
                    {getUserInitials(selectedMember)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{getDisplayName(selectedMember)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.mobile_number}</p>
                  <p className="text-xs text-gray-400">Joined {formatDate(selectedMember.date_joined)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Full Name"
                    value={editForm.full_name || ''}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                  <input
                    type="tel"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Mobile Number"
                    value={editForm.mobile_number || ''}
                    onChange={(e) => setEditForm({...editForm, mobile_number: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Role</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ROLE_OPTIONS.map(role => (
                      <button
                        key={role.value}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          editForm.role === role.value
                            ? 'text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                        style={{
                          backgroundColor: editForm.role === role.value ? role.color : undefined
                        }}
                        onClick={() => setEditForm({...editForm, role: role.value as any})}
                      >
                        {role.icon}
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMember}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* Loading Overlay */}
      {isLoading && !confirmationModal.isOpen && !showCreateModal && !showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col items-center shadow-2xl">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Processing...</p>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}