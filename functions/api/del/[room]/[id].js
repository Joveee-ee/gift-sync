import { neon } from "@neondatabase/serverless";

export async function onRequest({ params, env }) {
  const sql = neon(env.DATABASE_URL);
  await sql("DELETE FROM gifts WHERE room = $1 AND id = $2", [params.room, params.id]);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}