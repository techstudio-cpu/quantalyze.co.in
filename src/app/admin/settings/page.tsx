'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SeoMeta = {
  route: string;
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
};

type HistoryRow = {
  id: number;
  action: string;
  created_at: string;
  snapshot: any;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'footer' | 'seo'>('footer');

  const [token, setToken] = useState<string | null>(null);

  // Footer settings
  const [footerJson, setFooterJson] = useState<string>('{}');
  const [footerLoading, setFooterLoading] = useState(true);
  const [footerError, setFooterError] = useState('');
  const [footerSavedMessage, setFooterSavedMessage] = useState('');
  const [footerHistory, setFooterHistory] = useState<HistoryRow[]>([]);

  // SEO meta
  const routes = useMemo(() => ['/', '/services'], []);
  const [selectedRoute, setSelectedRoute] = useState<string>('/');
  const [seoMeta, setSeoMeta] = useState<SeoMeta>({ route: '/' });
  const [seoLoading, setSeoLoading] = useState(true);
  const [seoError, setSeoError] = useState('');
  const [seoSavedMessage, setSeoSavedMessage] = useState('');
  const [seoHistory, setSeoHistory] = useState<HistoryRow[]>([]);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!t) {
      router.push('/admin');
      return;
    }
    setToken(t);
  }, [router]);

  const authHeaders = useMemo<Record<string, string> | undefined>(() => {
    if (!token) return undefined;
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const fetchFooter = async () => {
    try {
      setFooterLoading(true);
      setFooterError('');
      setFooterSavedMessage('');

      const response = await fetch('/api/site-settings?scope=footer', {
        headers: authHeaders,
      });
      const data = await response.json();
      if (!data?.success) {
        setFooterError(data?.message || 'Failed to load footer settings');
        return;
      }
      setFooterJson(JSON.stringify(data.settings || {}, null, 2));
    } catch (e) {
      setFooterError('Failed to load footer settings');
    } finally {
      setFooterLoading(false);
    }
  };

  const fetchFooterHistory = async () => {
    try {
      const response = await fetch('/api/site-settings?scope=footer&action=history&limit=30', {
        headers: authHeaders,
      });
      const data = await response.json();
      if (data?.success) {
        setFooterHistory((data.history || []).map((r: any) => ({
          id: r.id,
          action: r.action,
          created_at: r.created_at,
          snapshot: r.snapshot,
        })));
      }
    } catch {
      // ignore
    }
  };

  const saveFooter = async () => {
    try {
      setFooterError('');
      setFooterSavedMessage('');
      const parsed = JSON.parse(footerJson);

      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scope: 'footer', settings: parsed }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        setFooterError(data?.message || 'Failed to save footer settings');
        return;
      }

      setFooterSavedMessage('Saved successfully');
      await fetchFooterHistory();
    } catch (e: any) {
      if (e?.message?.includes('JSON')) {
        setFooterError('Footer settings must be valid JSON');
      } else {
        setFooterError('Failed to save footer settings');
      }
    }
  };

  const restoreFooter = async (historyId: number) => {
    if (!confirm('Restore this footer settings version?')) return;
    try {
      setFooterError('');
      setFooterSavedMessage('');
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scope: 'footer', restoreHistoryId: historyId }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        setFooterError(data?.message || 'Failed to restore footer settings');
        return;
      }
      await fetchFooter();
      await fetchFooterHistory();
      setFooterSavedMessage('Restored successfully');
    } catch {
      setFooterError('Failed to restore footer settings');
    }
  };

  const fetchSeo = async (route: string) => {
    try {
      setSeoLoading(true);
      setSeoError('');
      setSeoSavedMessage('');

      const response = await fetch(`/api/seo-meta?route=${encodeURIComponent(route)}`);
      const data = await response.json();
      if (data?.success) {
        setSeoMeta({ route, ...(data.meta || {}) });
      } else {
        setSeoMeta({ route });
      }
    } catch {
      setSeoError('Failed to load SEO meta');
    } finally {
      setSeoLoading(false);
    }
  };

  const fetchSeoHistory = async (route: string) => {
    try {
      const response = await fetch(`/api/seo-meta?route=${encodeURIComponent(route)}&action=history&limit=30`, {
        headers: authHeaders,
      });
      const data = await response.json();
      if (data?.success) {
        setSeoHistory((data.history || []).map((r: any) => ({
          id: r.id,
          action: r.action,
          created_at: r.created_at,
          snapshot: r.snapshot,
        })));
      }
    } catch {
      // ignore
    }
  };

  const saveSeo = async () => {
    try {
      setSeoError('');
      setSeoSavedMessage('');

      const response = await fetch('/api/seo-meta', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: seoMeta.route,
          title: seoMeta.title ?? null,
          description: seoMeta.description ?? null,
          keywords: seoMeta.keywords ?? null,
          og_title: seoMeta.og_title ?? null,
          og_description: seoMeta.og_description ?? null,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        setSeoError(data?.message || 'Failed to save SEO meta');
        return;
      }

      setSeoSavedMessage('Saved successfully');
      await fetchSeoHistory(seoMeta.route);
    } catch {
      setSeoError('Failed to save SEO meta');
    }
  };

  const restoreSeo = async (historyId: number) => {
    if (!confirm('Restore this SEO meta version?')) return;
    try {
      setSeoError('');
      setSeoSavedMessage('');

      const response = await fetch('/api/seo-meta', {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ route: seoMeta.route, restoreHistoryId: historyId }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        setSeoError(data?.message || 'Failed to restore SEO meta');
        return;
      }

      await fetchSeo(seoMeta.route);
      await fetchSeoHistory(seoMeta.route);
      setSeoSavedMessage('Restored successfully');
    } catch {
      setSeoError('Failed to restore SEO meta');
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchFooter();
    fetchFooterHistory();
    fetchSeo(selectedRoute);
    fetchSeoHistory(selectedRoute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchSeo(selectedRoute);
    fetchSeoHistory(selectedRoute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                ← Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Settings</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('footer')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'footer' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-700'}`}
              >
                Footer
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'seo' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-700'}`}
              >
                SEO Meta
              </button>
            </div>
          </div>

          {activeTab === 'footer' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Footer settings</h2>
                  <p className="text-sm text-gray-600">Edit JSON used by the public footer via `/api/site-settings?scope=footer`.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchFooter}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={saveFooter}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {footerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {footerError}
                </div>
              )}
              {footerSavedMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {footerSavedMessage}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer JSON</label>
                  <textarea
                    value={footerJson}
                    onChange={(e) => setFooterJson(e.target.value)}
                    rows={18}
                    className="w-full font-mono text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    spellCheck={false}
                    disabled={footerLoading}
                  />
                  {footerLoading && <p className="text-sm text-gray-500 mt-2">Loading…</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">History</label>
                    <button
                      onClick={fetchFooterHistory}
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Refresh history
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-[420px] overflow-y-auto">
                      {footerHistory.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No history yet.</div>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">When</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {footerHistory.map((h) => (
                              <tr key={h.id}>
                                <td className="px-4 py-2 text-sm text-gray-700">{new Date(h.created_at).toLocaleString()}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{h.action}</td>
                                <td className="px-4 py-2 text-right">
                                  <button
                                    onClick={() => restoreFooter(h.id)}
                                    className="text-sm text-green-700 hover:underline"
                                  >
                                    Restore
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">SEO meta</h2>
                  <p className="text-sm text-gray-600">Controls `generateMetadata()` for selected routes.</p>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-sm text-gray-700">Route</label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    {routes.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      fetchSeo(selectedRoute);
                      fetchSeoHistory(selectedRoute);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={saveSeo}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {seoError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {seoError}
                </div>
              )}
              {seoSavedMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {seoSavedMessage}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        value={seoMeta.title ?? ''}
                        onChange={(e) => setSeoMeta((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={seoMeta.description ?? ''}
                        onChange={(e) => setSeoMeta((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                      <input
                        value={seoMeta.keywords ?? ''}
                        onChange={(e) => setSeoMeta((prev) => ({ ...prev, keywords: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                      <input
                        value={seoMeta.og_title ?? ''}
                        onChange={(e) => setSeoMeta((prev) => ({ ...prev, og_title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                      <textarea
                        value={seoMeta.og_description ?? ''}
                        onChange={(e) => setSeoMeta((prev) => ({ ...prev, og_description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {seoLoading && <p className="text-sm text-gray-500 mt-2">Loading…</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">History</label>
                    <button
                      onClick={() => fetchSeoHistory(selectedRoute)}
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Refresh history
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-[420px] overflow-y-auto">
                      {seoHistory.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No history yet.</div>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">When</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {seoHistory.map((h) => (
                              <tr key={h.id}>
                                <td className="px-4 py-2 text-sm text-gray-700">{new Date(h.created_at).toLocaleString()}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{h.action}</td>
                                <td className="px-4 py-2 text-right">
                                  <button
                                    onClick={() => restoreSeo(h.id)}
                                    className="text-sm text-green-700 hover:underline"
                                  >
                                    Restore
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
