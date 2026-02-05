import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'DNMembership',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function connectDatabase(): Promise<sql.ConnectionPool> {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    return connectDatabase();
  }
  return pool;
}

export async function query(queryString: string, params?: Record<string, unknown>): Promise<sql.IResult<unknown>> {
  const p = await getPool();
  const request = p.request();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
  }

  return request.query(queryString);
}

// Helper to query the game world database
export async function queryGameDB(queryString: string, params?: Record<string, unknown>): Promise<sql.IResult<unknown>> {
  const gameDbName = process.env.DB_GAME_NAME || 'DNWorld';
  const p = await getPool();
  const request = p.request();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
  }

  // Use the game database
  const fullQuery = `USE [${gameDbName}]; ${queryString}`;
  return request.query(fullQuery);
}

export { sql };
