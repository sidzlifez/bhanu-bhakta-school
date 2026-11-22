export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.GITHUB_CLIENT_ID) {
    return new Response("Missing GITHUB_CLIENT_ID in Cloudflare Pages Environment Variables.", { status: 500 });
  }

  const state = crypto.randomUUID();
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
  authUrl.searchParams.set("scope", "repo,user");
  authUrl.searchParams.set("state", state);

  return Response.redirect(authUrl.toString(), 302);
}
