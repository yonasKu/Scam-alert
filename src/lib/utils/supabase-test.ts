import { supabase } from '../supabase';

// Define types for our connection test results
interface TableStatus {
  accessible: boolean;
  rowCount?: number;
  message?: string;
}

interface ConnectionStatus {
  connected: boolean;
  message: string;
  tables: Record<string, TableStatus>;
}

/**
 * Tests the Supabase connection and table access
 * This function can be used to verify that your application 
 * can successfully connect to Supabase and access all required tables
 */
export async function testSupabaseConnection(): Promise<ConnectionStatus> {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection by checking if we can reach Supabase at all
    // We'll just check if we can connect at all
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return {
        connected: false,
        message: `Connection failed: ${error.message}`,
        tables: {}
      };
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test access to each table
    const tables = ['reports', 'businesses', 'watchlist'];
    const tableResults: Record<string, TableStatus> = {};
    
    for (const table of tables) {
      try {
        console.log(`🔍 Testing access to "${table}" table...`);
        const { count, error: tableError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
          
        if (tableError) {
          console.error(`❌ Failed to access "${table}" table:`, tableError.message);
          tableResults[table] = {
            accessible: false,
            message: tableError.message
          };
        } else {
          console.log(`✅ Successfully accessed "${table}" table!`);
          tableResults[table] = {
            accessible: true,
            rowCount: count || 0
          };
        }
      } catch (err: any) {
        console.error(`❌ Error testing "${table}" table:`, err);
        tableResults[table] = {
          accessible: false,
          message: err?.message || 'Unknown error'
        };
      }
    }
    
    return {
      connected: true,
      message: 'Connection successful',
      tables: tableResults
    };
    
  } catch (err: any) {
    console.error('❌ Unexpected error testing Supabase connection:', err);
    return {
      connected: false,
      message: `Unexpected error: ${err?.message || 'Unknown error'}`,
      tables: {}
    };
  }
}

/**
 * Log database connection status and details
 * Useful for debugging in development
 */
export async function logDatabaseStatus(): Promise<ConnectionStatus> {
  const connectionStatus = await testSupabaseConnection();
  
  console.log('=============================================');
  console.log('📊 SUPABASE CONNECTION STATUS');
  console.log('=============================================');
  console.log(`Connection: ${connectionStatus.connected ? '✅ CONNECTED' : '❌ DISCONNECTED'}`);
  console.log(`Message: ${connectionStatus.message}`);
  console.log('---------------------------------------------');
  console.log('TABLE ACCESS:');
  
  for (const [table, status] of Object.entries(connectionStatus.tables)) {
    console.log(`- ${table}: ${status.accessible ? '✅ ACCESSIBLE' : '❌ INACCESSIBLE'}`);
    if (status.accessible) {
      console.log(`  Rows: ${status.rowCount}`);
    } else {
      console.log(`  Error: ${status.message}`);
    }
  }
  console.log('=============================================');
  
  return connectionStatus;
}
