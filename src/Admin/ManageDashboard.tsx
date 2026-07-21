import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
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

// Role options
const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator', color: '#ef4444' },
  { value: 'garage_owner', label: 'Garage Owner', color: '#10b981' },
  { value: 'mechanic', label: 'Mechanic', color: '#f59e0b' },
  { value: 'customer', label: 'Customer', color: '#0891b2' },
];

// Mock data
const mockMembers: Member[] = [
  {
    id: 1,
    mobile_number: '+255 712 345 678',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: 'admin',
    role_display: 'Administrator',
    is_active: true,
    is_staff: true,
    date_joined: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
  {
    id: 2,
    mobile_number: '+255 712 345 678',
    email: 'john@example.com',
    full_name: 'John Doe',
    role: 'customer',
    role_display: 'Customer',
    is_active: true,
    is_staff: false,
    date_joined: new Date().toISOString(),
    last_login: null,
  },
  {
    id: 3,
    mobile_number: '+255 713 456 789',
    email: 'jane@example.com',
    full_name: 'Jane Smith',
    role: 'mechanic',
    role_display: 'Mechanic',
    is_active: true,
    is_staff: false,
    date_joined: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
  {
    id: 4,
    mobile_number: '+255 714 567 890',
    email: 'bob@example.com',
    full_name: 'Bob Johnson',
    role: 'garage_owner',
    role_display: 'Garage Owner',
    is_active: false,
    is_staff: false,
    date_joined: new Date().toISOString(),
    last_login: null,
  },
];

const mockStats: StatsData = {
  customer: 10,
  mechanic: 7,
  garage_owner: 5,
  admin: 2,
  total: 24,
  active: 18,
  inactive: 6,
};

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
            {isDestructive ? 'Delete Member' : 'Confirm Action'}
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

const MemberManagement: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(mockMembers);
  const [stats, setStats] = useState<StatsData | null>(mockStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [actionType, setActionType] = useState<
    'delete' | 'deactivate' | 'activate' | 'role_change' | 'edit' | null
  >(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [newRole, setNewRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    mobile_number: '',
    email: '',
    full_name: '',
    role: 'customer',
    password: '',
    confirm_password: '',
  });

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Member>>({
    full_name: '',
    email: '',
    mobile_number: '',
    role: 'customer',
  });

  // Get role color
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'garage_owner': return '#10b981';
      case 'mechanic': return '#f59e0b';
      case 'customer': return '#0891b2';
      default: return '#6b7280';
    }
  };

  // Get role badge class
  const getRoleBadgeClass = (role: string): string => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'garage_owner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'mechanic': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'customer': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400';
    }
  };

  // Get user initials
  const getUserInitials = (member: Member): string => {
    if (member.full_name) {
      return member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return member.mobile_number.slice(-4);
  };

  // Get display name
  const getDisplayName = (member: Member): string => {
    return member.full_name || member.mobile_number;
  };

  // Format date
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

  // Filter members
  useEffect(() => {
    let filtered = [...members];
    
    if (selectedRoleFilter !== 'all') {
      filtered = filtered.filter(m => m.role === selectedRoleFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.mobile_number.toLowerCase().includes(query) ||
        (member.full_name?.toLowerCase() || '').includes(query) ||
        (member.email?.toLowerCase() || '').includes(query)
      );
    }
    
    setFilteredMembers(filtered);
  }, [members, searchQuery, selectedRoleFilter]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  // Handle create member
  const handleCreateMember = async () => {
    if (!createForm.mobile_number) {
      alert('Mobile number is required');
      return;
    }
    if (!createForm.password) {
      alert('Password is required');
      return;
    }
    if (createForm.password !== createForm.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    if (createForm.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newMember: Member = {
      id: Date.now(),
      mobile_number: createForm.mobile_number,
      email: createForm.email || null,
      full_name: createForm.full_name || '',
      role: createForm.role as any,
      role_display: ROLE_OPTIONS.find(r => r.value === createForm.role)?.label || 'Customer',
      is_active: true,
      is_staff: createForm.role === 'admin',
      date_joined: new Date().toISOString(),
      last_login: null,
    };

    setMembers(prev => [newMember, ...prev]);
    setSuccessMessage('Member created successfully!');
    setSuccessModalVisible(true);
    setCreateModalVisible(false);
    setCreateForm({
      mobile_number: '',
      email: '',
      full_name: '',
      role: 'customer',
      password: '',
      confirm_password: '',
    });
    setIsLoading(false);
  };

  // Handle update member
  const handleUpdateMember = async () => {
    if (!selectedMember) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setMembers(prev => prev.map(m =>
      m.id === selectedMember.id ? { ...m, ...editForm } : m
    ));
    
    setSuccessMessage('Member updated successfully!');
    setSuccessModalVisible(true);
    setEditModalVisible(false);
    setIsLoading(false);
  };

  // Handle delete member
  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
    setSuccessMessage('Member deleted successfully!');
    setSuccessModalVisible(true);
    setModalVisible(false);
    setActionModalVisible(false);
    setIsLoading(false);
  };

  // Handle toggle status
  const handleToggleStatus = async () => {
    if (!selectedMember) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setMembers(prev => prev.map(m =>
      m.id === selectedMember.id ? { ...m, is_active: !m.is_active } : m
    ));
    
    const action = selectedMember.is_active ? 'deactivated' : 'activated';
    setSuccessMessage(`Member ${action} successfully!`);
    setSuccessModalVisible(true);
    setModalVisible(false);
    setActionModalVisible(false);
    setIsLoading(false);
  };

  // Handle change role
  const handleChangeRole = async () => {
    if (!selectedMember || !newRole) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const roleDisplay = ROLE_OPTIONS.find(r => r.value === newRole)?.label || newRole;
    setMembers(prev => prev.map(m =>
      m.id === selectedMember.id ? { ...m, role: newRole as any, role_display: roleDisplay } : m
    ));
    
    setSuccessMessage(`Role changed to ${roleDisplay}!`);
    setSuccessModalVisible(true);
    setModalVisible(false);
    setActionModalVisible(false);
    setNewRole('');
    setIsLoading(false);
  };

  // Show action confirmation
  const showActionConfirmation = (type: 'delete' | 'deactivate' | 'activate' | 'role_change', member: Member) => {
    setSelectedMember(member);
    setActionType(type);
    if (type === 'role_change') {
      setNewRole('');
    }
    setActionModalVisible(true);
  };

  // Execute action
  const executeAction = async () => {
    if (actionType === 'delete') {
      await handleDeleteMember();
    } else if (actionType === 'activate' || actionType === 'deactivate') {
      await handleToggleStatus();
    } else if (actionType === 'role_change') {
      await handleChangeRole();
    }
  };

  // Open edit modal
  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setEditForm({
      full_name: member.full_name || '',
      email: member.email || '',
      mobile_number: member.mobile_number,
      role: member.role,
    });
    setEditModalVisible(true);
  };

  // Render stat card
  const StatCard: React.FC<{ label: string; value: number; color: string; icon: string }> = ({ label, value, color, icon }) => (
    <div className={`${color} rounded-2xl p-4 min-w-[120px] flex-1 shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white text-lg font-bold">{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/80">{label}</p>
        </div>
      </div>
    </div>
  );

  // Render member item
  const renderMemberItem = (member: Member) => {
    const initials = getUserInitials(member);
    const displayName = getDisplayName(member);
    const roleColor = getRoleColor(member.role);
    const roleBadgeClass = getRoleBadgeClass(member.role);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: roleColor + '20' }}>
              <span className="text-base font-bold" style={{ color: roleColor }}>{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-semibold text-gray-900 dark:text-white">{displayName}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeClass}`}>
                  {member.role_display}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{member.mobile_number}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>✉</span>
                  <span className="truncate max-w-[120px]">{member.email || 'No email'}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  member.is_active 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  {member.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0 ml-2">
            <button
              className="p-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/30 transition-colors"
              onClick={() => openEditModal(member)}
              title="Edit"
            >
              <span className="text-cyan-500">✏</span>
            </button>
            <button
              className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 transition-colors"
              onClick={() => showActionConfirmation(member.is_active ? 'deactivate' : 'activate', member)}
              title={member.is_active ? 'Deactivate' : 'Activate'}
            >
              <span className="text-orange-500">⏻</span>
            </button>
            <button
              className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 transition-colors"
              onClick={() => showActionConfirmation('role_change', member)}
              title="Change Role"
            >
              <span className="text-purple-500">⇄</span>
            </button>
            <button
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
              onClick={() => showActionConfirmation('delete', member)}
              title="Delete"
            >
              <span className="text-red-500">🗑</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading && members.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading members...</p>
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
                  Member Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage users and roles</p>
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
                onClick={() => setCreateModalVisible(true)}
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
              placeholder="Search by name, phone, or email..."
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
      {stats && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total" value={stats.total} color="bg-gradient-to-br from-cyan-500 to-cyan-600" icon="#" />
            <StatCard label="Active" value={stats.active} color="bg-gradient-to-br from-green-500 to-green-600" icon="✓" />
            <StatCard label="Inactive" value={stats.inactive} color="bg-gradient-to-br from-red-500 to-red-600" icon="✕" />
            <StatCard label="Admins" value={stats.admin} color="bg-gradient-to-br from-purple-500 to-purple-600" icon="★" />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedRoleFilter === 'all'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelectedRoleFilter('all')}
          >
            All
          </button>
          {ROLE_OPTIONS.map(role => (
            <button
              key={role.value}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedRoleFilter === role.value
                  ? `bg-${role.color}20 text-${role.color} shadow-md`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              style={{
                backgroundColor: selectedRoleFilter === role.value ? role.color + '20' : '',
                color: selectedRoleFilter === role.value ? role.color : '',
              }}
              onClick={() => setSelectedRoleFilter(role.value)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Member Count */}
      <div className="max-w-7xl mx-auto px-4 pb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredMembers.length}</span> of{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{members.length}</span> members
        </p>
        <button onClick={handleRefresh} disabled={refreshing} className="text-cyan-500 hover:text-cyan-600 transition-colors font-medium">
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Member List */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        {filteredMembers.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-5xl font-bold text-gray-400 dark:text-gray-500">👤</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No members found' : 'No members available'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? 'Try a different search term' : 'Add your first member to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setCreateModalVisible(true)}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
              >
                + Add First Member
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.map((member) => renderMemberItem(member))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {createModalVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Create Member</h3>
                <p className="text-sm text-white/90 mt-1">Add a new member to the system</p>
              </div>
              <button
                onClick={() => setCreateModalVisible(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl font-bold transition-all duration-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="+255 712 345 678"
                    value={createForm.mobile_number}
                    onChange={(e) => setCreateForm({ ...createForm, mobile_number: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="user@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="Full Name"
                    value={createForm.full_name}
                    onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map(role => (
                      <button
                        key={role.value}
                        className={`px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-medium ${
                          createForm.role === role.value
                            ? `border-${role.color} bg-${role.color}20 text-${role.color}`
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}
                        style={{
                          borderColor: createForm.role === role.value ? role.color : '',
                          backgroundColor: createForm.role === role.value ? role.color + '20' : '',
                          color: createForm.role === role.value ? role.color : '',
                        }}
                        onClick={() => setCreateForm({ ...createForm, role: role.value as any })}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Confirm"
                      value={createForm.confirm_password}
                      onChange={(e) => setCreateForm({ ...createForm, confirm_password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200"
                    onClick={() => setCreateModalVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50"
                    onClick={handleCreateMember}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Member'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalVisible && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Edit Member</h3>
                <p className="text-sm text-white/90 mt-1">Update member information</p>
              </div>
              <button
                onClick={() => setEditModalVisible(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl font-bold transition-all duration-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center`} style={{ backgroundColor: getRoleColor(selectedMember.role) + '20' }}>
                  <span className="text-2xl font-bold" style={{ color: getRoleColor(selectedMember.role) }}>
                    {getUserInitials(selectedMember)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{getDisplayName(selectedMember)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.mobile_number}</p>
                  <p className="text-xs text-gray-400">Joined {formatDate(selectedMember.date_joined)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="Full Name"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="Email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Mobile Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="Mobile Number"
                    value={editForm.mobile_number}
                    onChange={(e) => setEditForm({ ...editForm, mobile_number: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map(role => (
                      <button
                        key={role.value}
                        className={`px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-medium ${
                          editForm.role === role.value
                            ? `border-${role.color} bg-${role.color}20 text-${role.color}`
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}
                        style={{
                          borderColor: editForm.role === role.value ? role.color : '',
                          backgroundColor: editForm.role === role.value ? role.color + '20' : '',
                          color: editForm.role === role.value ? role.color : '',
                        }}
                        onClick={() => setEditForm({ ...editForm, role: role.value as any })}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200"
                    onClick={() => setEditModalVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50"
                    onClick={handleUpdateMember}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={actionModalVisible}
        message={
          actionType === 'delete' ? 'Are you sure you want to permanently delete this member? This action cannot be undone.' :
          actionType === 'deactivate' ? 'Are you sure you want to deactivate this member? They will not be able to log in.' :
          actionType === 'activate' ? 'Are you sure you want to activate this member? They will be able to log in again.' :
          actionType === 'role_change' && selectedMember ? 
            `Change role from ${selectedMember.role_display} to ${newRole ? ROLE_OPTIONS.find(r => r.value === newRole)?.label || newRole : 'new role'}?` :
          ''
        }
        onConfirm={executeAction}
        onCancel={() => {
          setActionModalVisible(false);
          setNewRole('');
        }}
        isDestructive={actionType === 'delete'}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        message={successMessage}
        onClose={() => {
          setSuccessModalVisible(false);
          setModalVisible(false);
          setEditModalVisible(false);
        }}
      />

      {/* Loading Overlay */}
      {isLoading && !successModalVisible && !createModalVisible && !editModalVisible && (
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

export default MemberManagement;