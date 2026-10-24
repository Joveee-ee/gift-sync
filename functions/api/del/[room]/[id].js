export async function onRequestDelete(ctx) {
  return new Response(JSON.stringify({ok:true, del: ctx.params.id}), {
    headers: {"content-type":"application/json"}
  });
}