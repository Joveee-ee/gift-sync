export async function onRequestPost(ctx) {
  return new Response(JSON.stringify({ok:true, saved: ctx.params.room}), {
    headers: {"content-type":"application/json"}
  });
}