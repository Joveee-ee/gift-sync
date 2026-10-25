export async function onRequestPost(context) {
  const { env, request } = context;
  const { room, id } = await request.json();

  await env.DB.prepare('DELETE FROM gifts WHERE id=? AND room=?').bind(id, room).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}