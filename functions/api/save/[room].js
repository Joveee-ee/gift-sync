import { neon } from "@neondatabase/serverless";

export async function onRequest({ params, request, env }) {
  const { name } = await request.json();
  const sql = neon(env.DATABASE_URL);
  await sql(
    "INSERT INTO gifts (room, name) VALUES ($1, $2)",
    [params.room, name]
  );
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}