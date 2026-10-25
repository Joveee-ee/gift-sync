import { neon } from "@neondatabase/serverless";

export async function onRequest({ params, env }) {
  const sql = neon(env.DATABASE_URL);
  const rows = await sql(
    "SELECT id, name FROM gifts WHERE room = $1 ORDER BY id DESC",
    [params.room]
  );
  return new Response(JSON.stringify({ ok: true, list: rows }), {
    headers: { "Content-Type": "application/json" }
  });
}