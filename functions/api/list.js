export async function onRequestGet(context) {
  const { env, request } = context;
  const room = new URL(request.url).searchParams.get('room') || 'default';
  const { results } = await env.DB.prepare(
    'SELECT * FROM gifts WHERE room=? ORDER BY id DESC'
  ).bind(room).all();
  const items = results.map(r => ({
    ...r,
    comments: r.comments ? JSON.parse(r.comments) : []
  }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}