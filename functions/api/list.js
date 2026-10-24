import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
export async function onRequest(ctx) {
  const room = ctx.params.room;
  const { rows } = await pool.query('SELECT * FROM gifts WHERE room_id=$1', [room]);
  return new Response(JSON.stringify(rows), { headers: { 'content-type': 'application/json' } });
}