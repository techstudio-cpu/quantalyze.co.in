'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  bio: string;
  avatar?: string;
  status: 'active' | 'inactive';
  joined_at: string;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    bio: '',
    avatar: '',
    status: 'active' as 'active' | 'inactive'
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchTeamMembers();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken') || getCookie('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.data || []);
      } else {
        // Fallback to static data if API doesn't exist yet
        const staticTeam = [
          {
            id: 1,
            name: 'Shubham Tiwari',
            email: 'shubham@quantalyze.co.in',
            role: 'Founder & CEO',
            department: 'Management',
            bio: 'Leading the digital transformation journey with expertise in marketing and technology.',
            avatar: '',
            status: 'active' as const,
            joined_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Tech Lead',
            email: 'tech@quantalyze.co.in',
            role: 'Technical Lead',
            department: 'Development',
            bio: 'Expert in web development and automation solutions.',
            avatar: '',
            status: 'active' as const,
            joined_at: '2024-02-01T00:00:00Z'
          }
        ];
        setTeamMembers(staticTeam);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      bio: member.bio,
      avatar: member.avatar || '',
      status: member.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/team', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        fetchTeamMembers();
        setSelectedMember(null);
        setShowModal(false);
      } else {
        alert('Failed to remove team member');
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      alert('Failed to remove team member');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedMember ? '/api/admin/team' : '/api/admin/team';
      const method = selectedMember ? 'PATCH' : 'POST';
      
      const payload = selectedMember 
        ? { id: selectedMember.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchTeamMembers();
        setSelectedMember(null);
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          role: '',
          department: '',
          bio: '',
          avatar: '',
          status: 'active'
        });
      } else {
        alert('Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Failed to save team member');
    }
  };

  const exportTeam = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status', 'Joined'],
      ...teamMembers.map(member => [
        member.name,
        member.email,
        member.role,
        member.department,
        member.status,
        new Date(member.joined_at).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team_members_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'management': return '👔';
      case 'development': return '💻';
      case 'marketing': return '📱';
      case 'design': return '🎨';
      case 'sales': return '💼';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team</h1>
                <p className="text-sm text-gray-600 mt-1">Manage team members and roles</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setSelectedMember(null);
                    setShowModal(true);
                    setFormData({
                      name: '',
                      email: '',
                      role: '',
                      department: '',
                      bio: '',
                      avatar: '',
                      status: 'active'
                    });
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  ➕ Add Member
                </button>
                <button
                  onClick={exportTeam}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  📤 Export CSV
                </button>
                <button
                  onClick={fetchTeamMembers}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading team members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchTeamMembers}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Team Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{getDepartmentIcon(member.department)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {member.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Department:</span> {member.department}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{member.bio}</p>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      Joined: {new Date(member.joined_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Team Member Modal */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedMember ? 'Edit Team Member' : 'Add New Team Member'}
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedMember(null);
                          setShowModal(false);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Senior Developer"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                          </label>
                          <select
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select department</option>
                            <option value="Management">Management</option>
                            <option value="Development">Development</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Design">Design</option>
                            <option value="Sales">Sales</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avatar URL (optional)
                        </label>
                        <input
                          type="url"
                          value={formData.avatar}
                          onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMember(null);
                            setShowModal(false);
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          {selectedMember ? 'Update Member' : 'Add Member'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
