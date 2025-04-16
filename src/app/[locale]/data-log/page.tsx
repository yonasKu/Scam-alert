'use client';

import { useState, useEffect } from 'react';
import { fetchReports } from '@/lib/api/reports';
import { fetchBusinesses } from '@/lib/api/businesses';
import { fetchWatchlist } from '@/lib/api/watchlist';

export default function DataLogPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({
    reports: true,
    businesses: true,
    watchlist: true
  });
  const [error, setError] = useState<Record<string, string | null>>({
    reports: null,
    businesses: null,
    watchlist: null
  });
  const [activeTab, setActiveTab] = useState<'reports' | 'businesses' | 'watchlist'>('reports');

  // Load data from Supabase
  useEffect(() => {
    async function loadData() {
      // Load reports
      try {
        setLoading(prev => ({ ...prev, reports: true }));
        const reportsData = await fetchReports();
        setReports(reportsData || []);
        setError(prev => ({ ...prev, reports: null }));
      } catch (err: any) {
        console.error('Error fetching reports:', err);
        setError(prev => ({ ...prev, reports: err.message || 'Failed to fetch reports' }));
      } finally {
        setLoading(prev => ({ ...prev, reports: false }));
      }

      // Load businesses
      try {
        setLoading(prev => ({ ...prev, businesses: true }));
        const businessesData = await fetchBusinesses();
        setBusinesses(businessesData || []);
        setError(prev => ({ ...prev, businesses: null }));
      } catch (err: any) {
        console.error('Error fetching businesses:', err);
        setError(prev => ({ ...prev, businesses: err.message || 'Failed to fetch businesses' }));
      } finally {
        setLoading(prev => ({ ...prev, businesses: false }));
      }

      // Load watchlist - Note: This would normally need a user ID
      // For demo purposes we'll try to get all entries
      try {
        setLoading(prev => ({ ...prev, watchlist: true }));
        // This is just for demo - in real use you'd pass a user ID
        const watchlistData = await fetchWatchlist('00112233-4455-6677-8899-aabbccddeeff');
        setWatchlist(watchlistData || []);
        setError(prev => ({ ...prev, watchlist: null }));
      } catch (err: any) {
        console.error('Error fetching watchlist:', err);
        setError(prev => ({ ...prev, watchlist: err.message || 'Failed to fetch watchlist' }));
      } finally {
        setLoading(prev => ({ ...prev, watchlist: false }));
      }
    }

    loadData();
  }, []);

  // Helper function to display timestamps in a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Data Logger</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['reports', 'businesses', 'watchlist'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-gray-100">
                  {
                    tab === 'reports' 
                      ? reports.length
                      : tab === 'businesses'
                        ? businesses.length
                        : watchlist.length
                  }
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reports Table */}
      {activeTab === 'reports' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Reports</h2>
          {loading.reports ? (
            <p className="text-gray-500">Loading reports...</p>
          ) : error.reports ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error.reports}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">No reports found. Use the CSV import function to add some!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Before</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price After</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.business_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.report_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.price_before || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.price_after || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(report.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Businesses Table */}
      {activeTab === 'businesses' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Businesses</h2>
          {loading.businesses ? (
            <p className="text-gray-500">Loading businesses...</p>
          ) : error.businesses ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error.businesses}</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">No businesses found. Use the CSV import function to add some!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businesses.map((business) => (
                    <tr key={business.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{business.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.report_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(business.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Watchlist Table */}
      {activeTab === 'watchlist' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Watchlist</h2>
          {loading.watchlist ? (
            <p className="text-gray-500">Loading watchlist...</p>
          ) : error.watchlist ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error.watchlist}</p>
            </div>
          ) : watchlist.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">No watchlist entries found. Use the CSV import function to add some!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {watchlist.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.business_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">How to Import Your CSV Data</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            <strong>Login to Supabase Dashboard</strong>: Go to <a href="https://app.supabase.com/" className="text-indigo-600 hover:text-indigo-800" target="_blank" rel="noopener noreferrer">app.supabase.com</a> and select your project
          </li>
          <li>
            <strong>Navigate to Table Editor</strong>: In the left sidebar, click on "Table Editor"
          </li>
          <li>
            <strong>Select the table</strong> you want to import data into (reports, businesses, or watchlist)
          </li>
          <li>
            <strong>Click "Import"</strong> at the top of the table view
          </li>
          <li>
            <strong>Choose CSV format</strong> and upload the corresponding fixed CSV file:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li><code className="bg-gray-100 px-2 py-1 rounded">reports_fixed.csv</code> for the reports table</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">businesses_fixed.csv</code> for the businesses table</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">watchlist_fixed.csv</code> for the watchlist table</li>
            </ul>
          </li>
          <li>
            <strong>Map columns</strong>: Make sure the CSV columns match the database columns
          </li>
          <li>
            <strong>Click "Import"</strong> to add the data
          </li>
          <li>
            <strong>Refresh this page</strong> to see your imported data
          </li>
        </ol>
      </div>
    </div>
  );
}
