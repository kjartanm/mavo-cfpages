export async function onRequestGet(context) {
    return new Response(context.env.AUTH_USERNAME + ":" + context.env.AUTH_PWD);
}