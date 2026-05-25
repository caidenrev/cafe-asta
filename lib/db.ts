import mysql from 'mysql2/promise';

declare global {
  var dbPool: mysql.Pool | undefined;
  var dbInitialized: boolean | undefined;
}

// Config pool with fallback variables
const pool = globalThis.dbPool || mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cafe_qr',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.dbPool = pool;
}

// Automatic migrations runner
export async function initDb() {
  if (globalThis.dbInitialized) return pool;

  let connection;
  try {
    connection = await pool.getConnection();
    
    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` VARCHAR(50) NOT NULL,
        \`table_number\` VARCHAR(10) NOT NULL,
        \`total_amount\` DECIMAL(10, 2) NOT NULL,
        \`status\` VARCHAR(20) NOT NULL DEFAULT 'Pending',
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create order_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`order_items\` (
        \`id\` INT AUTO_INCREMENT NOT NULL,
        \`order_id\` VARCHAR(50) NOT NULL,
        \`menu_item_id\` VARCHAR(50) NOT NULL,
        \`menu_item_name\` VARCHAR(100) NOT NULL,
        \`menu_item_price\` DECIMAL(10, 2) NOT NULL,
        \`menu_item_image\` VARCHAR(255) NOT NULL,
        \`quantity\` INT NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    globalThis.dbInitialized = true;
    console.log('MySQL Database successfully initialized with orders & order_items tables.');
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
  } finally {
    if (connection) connection.release();
  }

  return pool;
}

// Wrapper for query execution
export async function executeQuery(sql: string, params?: any[]) {
  const activePool = await initDb();
  const [results] = await activePool.execute(sql, params);
  return results;
}

// Helper to retrieve connection for manual transaction workflows
export async function getPool() {
  await initDb();
  return pool;
}
