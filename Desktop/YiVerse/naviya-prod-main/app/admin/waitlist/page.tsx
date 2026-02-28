"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getAllWaitlistEntries, WaitlistEntry } from "@/lib/waitlist";
import Navbar from "../../components/Navbar";

export default function WaitlistAdminPage() {
  const { user } = useAuth();
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // 检查管理员权限
  const isAdmin = user?.email === "mcherrybb@ucla.edu";

  useEffect(() => {
    if (isAdmin) {
      loadWaitlistEntries();
    }
  }, [isAdmin]);

  const loadWaitlistEntries = async () => {
    try {
      setLoading(true);
      const entries = await getAllWaitlistEntries(1000);
      setWaitlistEntries(entries);
    } catch (err) {
      setError("Failed to load waitlist entries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'converted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-4 min-h-screen">
        <Navbar />
        <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
          <div className="w-full max-w-2xl">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
              <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
              <p>This page is only accessible to administrators.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-screen">
        <Navbar />
        <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading waitlist entries...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Waitlist Management</h1>
              <p className="text-gray-600">Total Entries: <span className="font-semibold text-purple-600">{waitlistEntries.length}</span></p>
            </div>
            <button
              onClick={loadWaitlistEntries}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔄 Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {waitlistEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No waitlist entries yet</h3>
              <p className="text-gray-500">When people join your waitlist, they'll appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waitlistEntries.map((entry, index) => (
                      <tr key={entry.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{entry.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(entry.timestamp)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 capitalize">{entry.source || 'unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status || 'pending')}`}>
                            {entry.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export Section */}
          {waitlistEntries.length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Export Options</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const csv = [
                      ['Name', 'Email', 'Date Joined', 'Source', 'Status'],
                      ...waitlistEntries.map(entry => [
                        entry.name,
                        entry.email,
                        formatDate(entry.timestamp),
                        entry.source || '',
                        entry.status || ''
                      ])
                    ].map(row => row.join(',')).join('\n');
                    
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📊 Export to CSV
                </button>
                
                <button
                  onClick={() => {
                    const json = JSON.stringify(waitlistEntries, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  📄 Export to JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
