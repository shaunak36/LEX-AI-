import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, ShieldAlert, Search, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { setCurrentView } = useApp();
  
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Standard', status: 'Active' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers: AppUser[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedUsers.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'Standard',
          status: data.status || 'Active'
        });
      });
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  // Access Control check (fallback to App.tsx)
  const isClient = currentUser?.role === 'Lawyer' || currentUser?.role === 'Viewer' || currentUser?.role === 'client';
  if (isClient) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in duration-500">
        <ShieldAlert size={64} className="text-rose-500" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">Access Denied</h2>
        <p className="text-slate-500 dark:text-zinc-400 mb-4">Clients cannot access User Management.</p>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Derived state
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user from the workspace?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  const openModal = (userToEdit: AppUser | null = null) => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        status: userToEdit.status
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'Standard', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = editingUser ? editingUser.id : `temp_${Date.now()}`;
      
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };

      await setDoc(doc(db, 'users', id), userData, { merge: true });
      
      await fetchUsers(); // Refresh the list
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  // Helper for role badges
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Admin': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Standard': return 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300';
      case 'Viewer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">User Management</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage platform access, roles, and privileges.</p>
          </div>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors duration-200 shadow-sm"
        >
          <Plus size={18} />
          Add New User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email..." 
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-600 dark:text-zinc-400">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              {filteredUsers.length > 0 ? filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-200 group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-zinc-100">{u.name}</div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span className="text-sm text-slate-600 dark:text-zinc-400">{u.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 dark:text-zinc-400">
                    No users found matching "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-zinc-800/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Standard">Standard</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
                  >
                    {saving ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
