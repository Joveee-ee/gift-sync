export async function onRequestPost(context) {
  const { env, request } = context;
  const { room, item } = await request.json();

  if (item.id && item.id > 0) {
    await env.DB.prepare(
      'UPDATE gifts SET name=?, price=?, link=?, status=?, img=?, comments=? WHERE id=? AND room=?'
    ).bind(item.name, item.price, item.link, item.status, item.img, JSON.stringify(item.comments||[]), item.id, room).run();
  } else {
    await env.DB.prepare(
      'INSERT INTO gifts (room, name, price, link, status, img, comments) VALUES (?,?,?,?,?,?,?)'
    ).bind(room, item.name, item.price, item.link, item.status, item.img, JSON.stringify(item.comments||[])).run();
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}