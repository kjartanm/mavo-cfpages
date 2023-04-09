import { PagesAuth, getSession } from '../src/pagesauth';
import Credentials from "@auth/core/providers/credentials"

function getPagesAuthConfig(context) {

    let env = context.env;
    return {
        providers: [
            Credentials({
                credentials: {
                    username: { label: "Username" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(creds, req) {
                    if (env.AUTH_USERNAME !== creds.username || env.AUTH_PWD !== creds.password) {
                        return false;
                    }
                    const user = {
                        id: creds.username,
                        email: creds.username,
                    }
                    return user
                }
            })
        ],
        trustHost: true,
        session: {
            strategy: "jwt",
            maxAge: 2 * 3600, //two hours
        },
        callbacks: {

            async jwt({ token, profile, account }) {
                if (account) {
                    token.provider = account.provider;
                    token.access_token = account.access_token
                }
                return token;
            },

            async session({ session, token }) {
                if (token.provider === "feide" && token.access_token) {
                    const groups = await fetch("https://groups-api.dataporten.no/groups/me/groups", {
                        headers: { Authorization: `Bearer ${token.access_token}` },
                    }).then(async (res) => await res.json());
                    session.groups = groups
                    session.access_token = token.access_token;
                }
                session.provider = token.provider;
                return session
            }
        },
    }
}

async function authorization(context) {
    if (context.request.method === "POST" || context.request.method === "PUT") {
        const session = await getSession(context, getPagesAuthConfig(context));
        if (!session || !session.user) {
            return new Response(null, { status: 401 });
        }
    }
    return context.next();
}

const pagesAuth = PagesAuth(getPagesAuthConfig);

export const onRequest = [pagesAuth, authorization];