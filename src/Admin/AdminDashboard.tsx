import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  role: 'admin' | 'mechanic' | 'garage_owner' | 'customer';
  role_display: string;
  is_active: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  registration_stage: number;
  date_joined: string;
  personal_info_completed_at: string | null;
  contact_details_completed_at: string | null;
  location_completed_at: string | null;
  security_completed_at: string | null;
  is_admin: boolean;
  is_mechanic: boolean;
  is_garage_owner: boolean;
  is_customer: boolean;
}

interface StatsData {
  total_users: number;
  active_users: number;
  verified_users: number;
  role_distribution: {
    admin?: number;
    garage_owner?: number;
    mechanic?: number;
    customer?: number;
  };
  registration_stages: {
    [key: string]: number;
  };
  recent_users: number;
}

// Configuration texts
const CONFIG_TEXTS = {
  deleteConfirm: {
    title: 'Delete User',
    message: 'Are you sure you want to permanently delete this user? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
  deactivateConfirm: {
    title: 'Deactivate User',
    message: 'Are you sure you want to deactivate this user? They will not be able to log in.',
    confirmText: 'Deactivate',
    cancelText: 'Cancel',
  },
  activateConfirm: {
    title: 'Activate User',
    message: 'Are you sure you want to activate this user? They will be able to log in again.',
    confirmText: 'Activate',
    cancelText: 'Cancel',
  },
  roleChangeConfirm: {
    title: 'Change User Role',
    message: (oldRole: string, newRole: string) => 
      `Change user role from ${oldRole || 'current'} to ${newRole}? This will affect their permissions.`,
    confirmText: 'Change Role',
    cancelText: 'Cancel',
  },
  adminRoleWarning: {
    title: 'Admin Role Assignment',
    message: 'Are you sure you want to assign ADMIN role? This user will have full system access.',
    confirmText: 'Make Admin',
    cancelText: 'Cancel',
  },
  emailVerifyConfirm: {
    title: 'Verify Email',
    message: 'Mark this user\'s email as verified?',
    confirmText: 'Verify',
    cancelText: 'Cancel',
  },
  phoneVerifyConfirm: {
    title: 'Verify Phone',
    message: 'Mark this user\'s phone as verified?',
    confirmText: 'Verify',
    cancelText: 'Cancel',
  },
  successMessages: {
    delete: 'User deleted successfully!',
    deactivate: 'User deactivated successfully!',
    activate: 'User activated successfully!',
    roleChange: 'User role changed successfully!',
    adminRole: 'User is now an Administrator!',
    emailVerify: 'Email marked as verified!',
    phoneVerify: 'Phone marked as verified!',
  },
  roleDescriptions: {
    admin: 'Full system administrator with complete access to all features, user management, and system settings.',
    mechanic: 'Professional mechanic for performing repairs and maintenance services.',
    garage_owner: 'Business owner managing a garage with staff and service management capabilities.',
    customer: 'Personal customer account for booking services and managing appointments.',
  },
};

// Role options
const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator' },
  { value: 'garage_owner', label: 'Garage Owner' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'customer', label: 'Customer' },
];

// Mock user data
const mockCurrentUser: User = {
  id: '1',
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User',
  phone: '+255 712 345 678',
  city: 'Dar es Salaam',
  state: 'Dar es Salaam',
  role: 'admin',
  role_display: 'Administrator',
  is_active: true,
  is_email_verified: true,
  is_phone_verified: true,
  registration_stage: 4,
  date_joined: new Date().toISOString(),
  personal_info_completed_at: new Date().toISOString(),
  contact_details_completed_at: new Date().toISOString(),
  location_completed_at: new Date().toISOString(),
  security_completed_at: new Date().toISOString(),
  is_admin: true,
  is_mechanic: false,
  is_garage_owner: false,
  is_customer: false,
};

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    phone: '+255 712 345 678',
    city: 'Dar es Salaam',
    state: 'Dar es Salaam',
    role: 'admin',
    role_display: 'Administrator',
    is_active: true,
    is_email_verified: true,
    is_phone_verified: true,
    registration_stage: 4,
    date_joined: new Date().toISOString(),
    personal_info_completed_at: new Date().toISOString(),
    contact_details_completed_at: new Date().toISOString(),
    location_completed_at: new Date().toISOString(),
    security_completed_at: new Date().toISOString(),
    is_admin: true,
    is_mechanic: false,
    is_garage_owner: false,
    is_customer: false,
  },
  {
    id: '2',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+255 712 345 678',
    city: 'Dar es Salaam',
    state: 'Dar es Salaam',
    role: 'customer',
    role_display: 'Customer',
    is_active: true,
    is_email_verified: true,
    is_phone_verified: false,
    registration_stage: 3,
    date_joined: new Date().toISOString(),
    personal_info_completed_at: new Date().toISOString(),
    contact_details_completed_at: new Date().toISOString(),
    location_completed_at: new Date().toISOString(),
    security_completed_at: null,
    is_admin: false,
    is_mechanic: false,
    is_garage_owner: false,
    is_customer: true,
  },
  {
    id: '3',
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '+255 713 456 789',
    city: 'Arusha',
    state: 'Arusha',
    role: 'mechanic',
    role_display: 'Mechanic',
    is_active: true,
    is_email_verified: true,
    is_phone_verified: true,
    registration_stage: 4,
    date_joined: new Date().toISOString(),
    personal_info_completed_at: new Date().toISOString(),
    contact_details_completed_at: new Date().toISOString(),
    location_completed_at: new Date().toISOString(),
    security_completed_at: new Date().toISOString(),
    is_admin: false,
    is_mechanic: true,
    is_garage_owner: false,
    is_customer: false,
  },
  {
    id: '4',
    email: 'bob@example.com',
    first_name: 'Bob',
    last_name: 'Johnson',
    phone: '+255 714 567 890',
    city: 'Mwanza',
    state: 'Mwanza',
    role: 'garage_owner',
    role_display: 'Garage Owner',
    is_active: false,
    is_email_verified: false,
    is_phone_verified: false,
    registration_stage: 2,
    date_joined: new Date().toISOString(),
    personal_info_completed_at: new Date().toISOString(),
    contact_details_completed_at: null,
    location_completed_at: null,
    security_completed_at: null,
    is_admin: false,
    is_mechanic: false,
    is_garage_owner: true,
    is_customer: false,
  },
];

const mockStats: StatsData = {
  total_users: 24,
  active_users: 18,
  verified_users: 12,
  role_distribution: {
    admin: 2,
    garage_owner: 5,
    mechanic: 7,
    customer: 10,
  },
  registration_stages: {
    '1': 4,
    '2': 6,
    '3': 8,
    '4': 6,
  },
  recent_users: 5,
};

const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [currentUser, setCurrentUser] = useState<User | null>(mockCurrentUser);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [stats, setStats] = useState<StatsData | null>(mockStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [actionType, setActionType] = useState<
    'delete' | 'deactivate' | 'activate' | 'role_change' | 'verify_email' | 'verify_phone' | null
  >(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [newRole, setNewRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Get role color
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'garage_owner': return 'bg-green-500';
      case 'mechanic': return 'bg-orange-500';
      case 'customer': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Get user initials
  const getUserInitials = (user: User): string => {
    const firstInitial = user?.first_name?.[0] || '';
    const lastInitial = user?.last_name?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = (user: User): string => {
    if (!user) return 'User';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email?.split('@')[0] || 'User';
  };

  // Get role display text
  const getRoleDisplayText = (role: string): string => {
    if (!role) return 'Unknown';
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
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

  // Has permission
  const hasPermission = (action: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.is_admin) return true;
    return false;
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // Show action confirmation
  const showActionConfirmation = (
    type: 'delete' | 'deactivate' | 'activate' | 'verify_email' | 'verify_phone',
    user: User
  ) => {
    setSelectedUser(user);
    setActionType(type);
    setActionModalVisible(true);
  };

  // Show role change confirmation
  const showRoleChangeConfirmation = (user: User) => {
    setSelectedUser(user);
    setNewRole('');
    setActionType('role_change');
    setActionModalVisible(true);
  };

  // Execute action
  const executeAction = async () => {
    if (!selectedUser || !actionType) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    let message = '';
    switch (actionType) {
      case 'delete':
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        message = CONFIG_TEXTS.successMessages.delete;
        break;
      case 'deactivate':
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id ? { ...u, is_active: false } : u
        ));
        message = CONFIG_TEXTS.successMessages.deactivate;
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id ? { ...u, is_active: true } : u
        ));
        message = CONFIG_TEXTS.successMessages.activate;
        break;
      case 'verify_email':
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id ? { ...u, is_email_verified: true } : u
        ));
        message = CONFIG_TEXTS.successMessages.emailVerify;
        break;
      case 'verify_phone':
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id ? { ...u, is_phone_verified: true } : u
        ));
        message = CONFIG_TEXTS.successMessages.phoneVerify;
        break;
      default:
        break;
    }

    setSuccessMessage(message);
    setSuccessModalVisible(true);
    setIsLoading(false);
    setActionModalVisible(false);
    setModalVisible(false);
    setSelectedUser(null);
  };

  // Execute role change
  const executeRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, role: newRole as any, role_display: getRoleDisplayText(newRole) } : u
    ));

    const message = newRole === 'admin' 
      ? CONFIG_TEXTS.successMessages.adminRole 
      : CONFIG_TEXTS.successMessages.roleChange;

    setSuccessMessage(message);
    setSuccessModalVisible(true);
    setIsLoading(false);
    setActionModalVisible(false);
    setModalVisible(false);
    setSelectedUser(null);
    setNewRole('');
  };

  // Filter users
  useEffect(() => {
    let filtered = users;
    
    if (selectedRoleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRoleFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) ||
        (user.first_name?.toLowerCase() || '').includes(query) ||
        (user.last_name?.toLowerCase() || '').includes(query) ||
        (user.phone || '').includes(query)
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedRoleFilter]);

  // Render stat card
  const StatCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className={`${color} rounded-xl p-3 min-w-[100px]`}>
      <p className="text-white text-2xl font-bold text-center">{value}</p>
      <p className="text-white text-xs font-medium text-center mt-1">{label}</p>
    </div>
  );

  // Render user row
  const renderUserRow = (user: User) => {
    const initials = getUserInitials(user);
    const displayName = getDisplayName(user);
    const roleColor = getRoleColor(user.role);
    const roleText = user.role_display || getRoleDisplayText(user.role);

    return (
      <tr 
        key={user.id}
        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
        onClick={() => handleSelectUser(user)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${roleColor} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-sm">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColor} text-white`}>
            {roleText}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
          {user.phone || 'N/A'}
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {hasPermission('delete') && (
              <button
                className="px-2 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                onClick={(e) => { e.stopPropagation(); showActionConfirmation('delete', user); }}
              >
                Delete
              </button>
            )}
            {hasPermission('deactivate') && user.is_active && user.role !== 'admin' && (
              <button
                className="px-2 py-1 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                onClick={(e) => { e.stopPropagation(); showActionConfirmation('deactivate', user); }}
              >
                Deactivate
              </button>
            )}
            {hasPermission('activate') && !user.is_active && (
              <button
                className="px-2 py-1 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                onClick={(e) => { e.stopPropagation(); showActionConfirmation('activate', user); }}
              >
                Activate
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  // Loading state
  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
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
                onClick={() => navigate('/dashboard')}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-cyan-500 font-medium"
              >
                Back
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage users and permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>
              {currentUser && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getRoleColor(currentUser.role)} text-white text-xs font-semibold`}>
                  {currentUser.role_display || getRoleDisplayText(currentUser.role)}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 mb-3">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="Search users by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {currentUser?.is_admin && stats && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Statistics</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <StatCard label="Total Users" value={stats.total_users.toString()} color="bg-blue-500" />
            <StatCard label="Active Users" value={stats.active_users.toString()} color="bg-green-500" />
            <StatCard label="Verified" value={stats.verified_users.toString()} color="bg-purple-500" />
            {stats.role_distribution?.admin !== undefined && (
              <StatCard label="Admins" value={stats.role_distribution.admin.toString()} color="bg-red-500" />
            )}
            {stats.role_distribution?.garage_owner !== undefined && (
              <StatCard label="Garage Owners" value={stats.role_distribution.garage_owner.toString()} color="bg-green-600" />
            )}
            {stats.role_distribution?.mechanic !== undefined && (
              <StatCard label="Mechanics" value={stats.role_distribution.mechanic.toString()} color="bg-orange-500" />
            )}
          </div>
        </div>
      )}

      {/* Role Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedRoleFilter === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSelectedRoleFilter('all')}
          >
            All
          </button>
          {ROLE_OPTIONS.map(role => (
            <button
              key={role.value}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRoleFilter === role.value
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedRoleFilter(role.value)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Count */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredUsers.length}</span> of{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{users.length}</span> users
        </p>
        <button onClick={handleRefresh} disabled={refreshing} className="text-cyan-500 hover:text-cyan-600 transition-colors font-medium">
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* User Table */}
      <div className="max-w-7xl mx-auto px-4 py-4 pb-32 overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-4xl mb-4">👤</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'No users match the selected filters'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => renderUserRow(user))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal - Table Format */}
      {modalVisible && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${getRoleColor(selectedUser.role)} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{getUserInitials(selectedUser)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{getDisplayName(selectedUser)}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setModalVisible(false)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              >
                Close
              </button>
            </div>

            {/* Modal Body - Table Format */}
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 w-1/3">Phone</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{selectedUser.phone || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Location</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{selectedUser.city || 'N/A'}, {selectedUser.state || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Role</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)} text-white`}>
                          {selectedUser.role_display || getRoleDisplayText(selectedUser.role)}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Status</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${selectedUser.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {selectedUser.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Email Verified</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{selectedUser.is_email_verified ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Phone Verified</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{selectedUser.is_phone_verified ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Registration Stage</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Stage {selectedUser.registration_stage}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Role Description */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Description:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {CONFIG_TEXTS.roleDescriptions[selectedUser.role] || 'No description available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {hasPermission('delete') && (
                  <button
                    className="py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    onClick={() => {
                      setModalVisible(false);
                      showActionConfirmation('delete', selectedUser);
                    }}
                  >
                    Delete User
                  </button>
                )}
                {hasPermission('change_role') && (
                  <button
                    className="py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    onClick={() => {
                      setModalVisible(false);
                      showRoleChangeConfirmation(selectedUser);
                    }}
                  >
                    Change Role
                  </button>
                )}
                {hasPermission('deactivate') && selectedUser.is_active && selectedUser.role !== 'admin' && (
                  <button
                    className="py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    onClick={() => {
                      setModalVisible(false);
                      showActionConfirmation('deactivate', selectedUser);
                    }}
                  >
                    Deactivate
                  </button>
                )}
                {hasPermission('activate') && !selectedUser.is_active && (
                  <button
                    className="py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    onClick={() => {
                      setModalVisible(false);
                      showActionConfirmation('activate', selectedUser);
                    }}
                  >
                    Activate
                  </button>
                )}
                {hasPermission('verify_email') && !selectedUser.is_email_verified && (
                  <button
                    className="py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    onClick={() => {
                      setModalVisible(false);
                      showActionConfirmation('verify_email', selectedUser);
                    }}
                  >
                    Verify Email
                  </button>
                )}
                {hasPermission('verify_phone') && !selectedUser.is_phone_verified && (
                  <button
                    className="py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    onClick={() => {
                      setModalVisible(false);
                      showActionConfirmation('verify_phone', selectedUser);
                    }}
                  >
                    Verify Phone
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {actionModalVisible && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Processing...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-5xl mb-3">
                    {actionType === 'delete' && '🗑️'}
                    {actionType === 'deactivate' && '⚠️'}
                    {actionType === 'activate' && '✅'}
                    {actionType === 'verify_email' && '📧'}
                    {actionType === 'verify_phone' && '📱'}
                  </p>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {actionType === 'delete' && CONFIG_TEXTS.deleteConfirm.title}
                    {actionType === 'deactivate' && CONFIG_TEXTS.deactivateConfirm.title}
                    {actionType === 'activate' && CONFIG_TEXTS.activateConfirm.title}
                    {actionType === 'verify_email' && CONFIG_TEXTS.emailVerifyConfirm.title}
                    {actionType === 'verify_phone' && CONFIG_TEXTS.phoneVerifyConfirm.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {actionType === 'delete' && CONFIG_TEXTS.deleteConfirm.message}
                    {actionType === 'deactivate' && CONFIG_TEXTS.deactivateConfirm.message}
                    {actionType === 'activate' && CONFIG_TEXTS.activateConfirm.message}
                    {actionType === 'verify_email' && CONFIG_TEXTS.emailVerifyConfirm.message}
                    {actionType === 'verify_phone' && CONFIG_TEXTS.phoneVerifyConfirm.message}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold transition-colors"
                    onClick={() => {
                      setActionModalVisible(false);
                      setNewRole('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`flex-1 py-3 rounded-xl text-white font-semibold transition-colors ${
                      actionType === 'delete' ? 'bg-red-500 hover:bg-red-600' :
                      actionType === 'deactivate' ? 'bg-orange-500 hover:bg-orange-600' :
                      actionType === 'activate' ? 'bg-green-500 hover:bg-green-600' :
                      'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={executeAction}
                  >
                    {actionType === 'delete' && CONFIG_TEXTS.deleteConfirm.confirmText}
                    {actionType === 'deactivate' && CONFIG_TEXTS.deactivateConfirm.confirmText}
                    {actionType === 'activate' && CONFIG_TEXTS.activateConfirm.confirmText}
                    {actionType === 'verify_email' && CONFIG_TEXTS.emailVerifyConfirm.confirmText}
                    {actionType === 'verify_phone' && CONFIG_TEXTS.phoneVerifyConfirm.confirmText}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {actionType === 'role_change' && actionModalVisible && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <p className="text-5xl mb-3">🔄</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Change User Role</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedUser && CONFIG_TEXTS.roleChangeConfirm.message(
                  selectedUser.role_display || getRoleDisplayText(selectedUser.role),
                  newRole ? getRoleDisplayText(newRole) : 'new role'
                )}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select New Role:</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map(role => (
                  <button
                    key={role.value}
                    className={`py-3 rounded-xl transition-colors font-medium ${
                      newRole === role.value
                        ? getRoleColor(role.value) + ' text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setNewRole(role.value)}
                    disabled={selectedUser?.role === role.value}
                  >
                    {role.label}
                    {selectedUser?.role === role.value && (
                      <span className="text-[10px] text-gray-400 block">(Current)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold transition-colors"
                onClick={() => {
                  setActionModalVisible(false);
                  setNewRole('');
                }}
              >
                Cancel
              </button>
              <button
                className={`flex-1 py-3 rounded-xl text-white font-semibold transition-colors ${
                  newRole ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={executeRoleChange}
                disabled={!newRole}
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalVisible && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-8 text-center">
            <p className="text-6xl mb-4">✅</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">{successMessage}</p>
            <button
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors"
              onClick={() => {
                setSuccessModalVisible(false);
                setModalVisible(false);
                setSelectedUser(null);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;