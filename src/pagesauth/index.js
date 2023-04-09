import { Auth } from "@auth/core";

const actions = [
    "providers",
    "session",
    "csrf",
    "signin",
    "signout",
    "callback",
    "verify-request",
    "error",
];

async function getAuthOptions(pagesAuthOptions, context) {
    const authOptions = typeof pagesAuthOptions === "object"
        ? pagesAuthOptions
        : await pagesAuthOptions(context);

    authOptions.secret ??= context.env.AUTH_SECRET;
    authOptions.trustHost ??= context.env.AUTH_TRUST_HOST;
    
    return authOptions;
}

export async function getSession(context, pagesAuthOptions = {providers: []}) {
    const { request } = context;
    const authOptions = await getAuthOptions(pagesAuthOptions, context);
    const url = new URL("/auth/session", request.url);
    const sessionRequest = new Request(url, { headers: request.headers });
    const response = await Auth(sessionRequest, authOptions);
    const { status = 200 } = response;
    const data = await response.json();
    if (!data || !Object.keys(data).length)
        return null;
    if (status === 200)
        return data;
    throw new Error(data.message);
}

export function PagesAuth(pagesAuthOptions) {
    return async function (context) {
        const { request, next } = context;
        const url = new URL(request.url);
        const authOptions = await getAuthOptions(pagesAuthOptions, context);
        const { prefix = "/auth" } = authOptions;
        const action = url.pathname
            .slice(prefix.length + 1)
            .split("/")[0];
        if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
            return next();
        }
        return Auth(request, authOptions);
    };
}