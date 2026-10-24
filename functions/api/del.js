import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });

export async function onRequest(ctx) {
  const { room, id } = ctx.params;
  await pool.query('DELETE FROM gifts WHERE id=$1 AND room_id=$2', [id, room]);
  return new Response(JSON.stringify({ok:true}));
}