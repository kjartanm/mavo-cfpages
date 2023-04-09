# mavo-pages

This repo contains a proof of concept of using Cloudflare Pages (https://pages.cloudflare.com/) and KV (https://developers.cloudflare.com/workers/runtime-apis/kv) to host and store data from a Mavo app (https://mavo.io/). Images and other files can be uploaded and stored using R2 (https://developers.cloudflare.com/r2/).

It also contains a proof of concept of how to use AuthJS (https://authjs.dev/) with Pages, and this is used to authenticate the Mavo app.

The example is an adaption of the Mavo homepage demo (https://mavo.io/demos/homepage/), and the backend for Mavo-Pages draws heavily on the other storage/backend plugins (https://plugins.mavo.io/).

## How to run

- Link your repo to Pages (https://developers.cloudflare.com/pages/get-started/)
    - use 'public' as build folder
    - use 'build' as build script (needed to force npm install even if nothing really gets built)
- Configure a KV namespace for your Pages project with the variable name MAVO_DATA (https://developers.cloudflare.com/pages/platform/functions/bindings/#kv-namespaces)
- Configure an R2 bucket in the same way with the variable name MAVO_FILES (https://developers.cloudflare.com/pages/platform/functions/bindings/#r2-buckets)

To test locally, run `npm install` and `npm dev`.

Just commit to your main branch to trigger deployment (or maybe use `wrangler publish`).


## Authentication

The example just uses some very basic credentials based authentication. To make this work locally, remove the .example suffix from .dev.vars.example. dev.vars contains necessary env variables for AuthJS to work.

You need to add a `AUTH_SECRET`, using for example https://generate-secret.vercel.app/32, and some values for the credentials (`AUTH_USERNAME`, `AUTH_PWD`).

Before deploying, the same env variables needs to be added to your Pages project (https://developers.cloudflare.com/pages/platform/functions/bindings/#environment-variables).

For more advanced authentication options, have a look at the AuthJS documentation, and add what you need to the config part of `functions/_middleware.js`.
