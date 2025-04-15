'use client';

import { useState, useEffect } from 'react';
import { testSupabaseConnection, logDatabaseStatus } from '@/lib/utils/supabase-test';

export default function SupabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        setLoading(true);
        const status = await testSupabaseConnection();
        console.log('Supabase connection status:', status);
        setConnectionStatus(status);
        setError(null);
      } catch (err: any) {
        console.error('Error testing connection:', err);
        setError(err.message || 'An unknown error occurred');
        setConnectionStatus(null);
      } finally {
        setLoading(false);
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Tester</h1>
      
      {loading ? (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
          <p className="text-blue-800 flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Testing Supabase connection...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Connection Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="mb-8">
          <div className={`p-6 rounded-lg shadow-md mb-6 ${connectionStatus?.connected ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className={`text-xl font-semibold mb-2 ${connectionStatus?.connected ? 'text-green-800' : 'text-red-800'}`}>
              {connectionStatus?.connected ? '✅ Connected to Supabase' : '❌ Failed to connect to Supabase'}
            </h2>
            <p className={connectionStatus?.connected ? 'text-green-700' : 'text-red-700'}>
              {connectionStatus?.message}
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4">Table Access Status</h2>
          
          {connectionStatus?.tables && Object.entries(connectionStatus.tables).map(([tableName, status]: [string, any]) => (
            <div 
              key={tableName}
              className={`p-6 rounded-lg shadow-md mb-4 ${status.accessible ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="mr-2">{status.accessible ? '✅' : '❌'}</span>
                <span className="font-mono">{tableName}</span>
              </h3>
              
              {status.accessible ? (
                <p className="text-green-700">
                  Table is accessible. Row count: {status.rowCount}
                </p>
              ) : (
                <p className="text-red-700">
                  Cannot access table: {status.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Debugging Information</h2>
        <p className="mb-4">Check your browser console for detailed logs.</p>
        
        <h3 className="text-lg font-semibold mb-2">Common Issues:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Incorrect Supabase URL or API key in environment variables</li>
          <li>Database tables not created properly</li>
          <li>Missing Row Level Security (RLS) policies</li>
          <li>Network connectivity issues</li>
        </ul>
      </div>
    </div>
  );
}
