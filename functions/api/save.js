import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });

export async function onRequest(ctx) {
  const room = ctx.params.room;
  const g = await ctx.request.json();
  await pool.query(`
    INSERT INTO gifts (id, room_id, name, price, link, recipient, image, status, notes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT(id) DO UPDATE SET
      name=EXCLUDED.name, price=EXCLUDED.price, link=EXCLUDED.link,
      recipient=EXCLUDED.recipient, image=EXCLUDED.image,
      status=EXCLUDED.status, notes=EXCLUDED.notes
  `, [g.id, room, g.name, g.price, g.link, g.recipient, g.image, g.status, JSON.stringify(g.notes||{})]);
  return new Response(JSON.stringify({ok:true}));