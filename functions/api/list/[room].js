export async function onRequestGet(ctx) {
  return new Response(JSON.stringify({ok:true, room: ctx.params.room}), {
    headers: {"content-type":"application/json"}
  });
}