// filepath: /Users/rozaiman/mynextapp1/config/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;