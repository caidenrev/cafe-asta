import mysql from 'mysql2/promise';

declare global {
  var dbPool: mysql.Pool | undefined;
  var dbInitialized: boolean | undefined;
  var useMemoryFallback: boolean | undefined;
  var mockOrders: MockOrder[] | undefined;
  var mockOrderItems: MockOrderItem[] | undefined;
}

interface MockOrder {
  id: string;
  customer_name: string;
  table_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface MockOrderItem {
  id: number;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  menu_item_price: number;
  menu_item_image: string;
  quantity: number;
}

const getMockOrders = (): MockOrder[] => {
  if (!globalThis.mockOrders) {
    globalThis.mockOrders = [];
  }
  return globalThis.mockOrders;
};

const getMockOrderItems = (): MockOrderItem[] => {
  if (!globalThis.mockOrderItems) {
    globalThis.mockOrderItems = [];
  }
  return globalThis.mockOrderItems;
};

async function mockExecute(sql: string, params: any[] = []): Promise<any> {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');
  
  if (cleanSql.includes('SELECT * FROM orders ORDER BY created_at DESC')) {
    const sorted = [...getMockOrders()].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return [sorted];
  }
  
  if (cleanSql.includes('SELECT * FROM orders WHERE id =')) {
    const id = params[0];
    const order = getMockOrders().find((o) => o.id === id);
    return [order ? [order] : []];
  }
  
  if (cleanSql.includes('SELECT * FROM order_items WHERE order_id =')) {
    const orderId = params[0];
    const items = getMockOrderItems().filter((item) => item.order_id === orderId);
    return [items];
  }
  
  if (cleanSql.includes('SELECT * FROM order_items')) {
    return [getMockOrderItems()];
  }
  
  if (cleanSql.includes('UPDATE orders SET status =')) {
    const status = params[0];
    const id = params[1];
    const order = getMockOrders().find((o) => o.id === id);
    if (order) {
      order.status = status;
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }
  
  if (cleanSql.includes('INSERT INTO orders')) {
    const [id, customer_name, table_number, total_amount, status, created_at] = params;
    const newOrder: MockOrder = {
      id,
      customer_name,
      table_number,
      total_amount: parseFloat(total_amount),
      status: status || 'Pending',
      created_at: created_at ? new Date(created_at).toISOString() : new Date().toISOString(),
    };
    getMockOrders().push(newOrder);
    return [{ affectedRows: 1 }];
  }
  
  if (cleanSql.includes('INSERT INTO order_items')) {
    const [order_id, menu_item_id, menu_item_name, menu_item_price, menu_item_image, quantity] = params;
    const newId = getMockOrderItems().length + 1;
    const newItem: MockOrderItem = {
      id: newId,
      order_id,
      menu_item_id,
      menu_item_name,
      menu_item_price: parseFloat(menu_item_price),
      menu_item_image: menu_item_image || '',
      quantity: parseInt(quantity),
    };
    getMockOrderItems().push(newItem);
    return [{ affectedRows: 1 }];
  }
  
  return [[]];
}

const mockConnection = {
  beginTransaction: async () => {},
  commit: async () => {},
  rollback: async () => {},
  release: () => {},
  execute: async (sql: string, params: any[] = []) => {
    return mockExecute(sql, params);
  },
  query: async (sql: string, params: any[] = []) => {
    return mockExecute(sql, params);
  }
};

const mockPool = {
  getConnection: async () => mockConnection,
  execute: async (sql: string, params: any[] = []) => {
    return mockExecute(sql, params);
  },
  query: async (sql: string, params: any[] = []) => {
    return mockExecute(sql, params);
  }
};

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
  if (globalThis.dbInitialized) {
    return globalThis.useMemoryFallback ? (mockPool as any) : pool;
  }

  let connection;
  try {
    connection = await pool.getConnection();
    
    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` VARCHAR(50) NOT NULL,
        \`customer_name\` VARCHAR(100) NOT NULL DEFAULT '',
        \`table_number\` VARCHAR(10) NOT NULL,
        \`total_amount\` DECIMAL(10, 2) NOT NULL,
        \`status\` VARCHAR(20) NOT NULL DEFAULT 'Pending',
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Alter table if customer_name column does not exist (for existing databases)
    try {
      await connection.query('ALTER TABLE `orders` ADD COLUMN `customer_name` VARCHAR(100) NOT NULL DEFAULT \'\' AFTER `id`');
    } catch (e) {
      // Column might already exist, ignore
    }

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

    globalThis.useMemoryFallback = false;
    globalThis.dbInitialized = true;
    console.log('MySQL Database successfully initialized with orders & order_items tables.');
    return pool;
  } catch (error) {
    globalThis.useMemoryFallback = true;
    globalThis.dbInitialized = true; // Mark as initialized so we don't spam attempts
    console.warn('⚠️ WARNING: MySQL database server is offline (ECONNREFUSED). Falling back to dynamic IN-MEMORY store for local testing.');
    return mockPool as any;
  } finally {
    if (connection) connection.release();
  }
}

// Wrapper for query execution
export async function executeQuery(sql: string, params?: any[]) {
  await initDb();
  if (globalThis.useMemoryFallback) {
    const [results] = await mockExecute(sql, params);
    return results;
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

// Helper to retrieve connection for manual transaction workflows
export async function getPool() {
  await initDb();
  if (globalThis.useMemoryFallback) {
    return mockPool as any;
  }
  return pool;
}
