export async function onRequestGet(context) {

    let key = context.request.headers.get("cfpages-kv-key");
    if(!key){
        return new Response(null, {status: 400})
    }  

    let data = await context.env.MAVO_DATA.get(key) || `{}`;

    return new Response(data);

}

export async function onRequestPut(context) {

    let key = context.request.headers.get("cfpages-kv-key");
    let data = await context.request.text();

    if(!key || !data){
        return new Response(null, {status: 400})
    }

    await context.env.MAVO_DATA.put(key, data).catch(err => {
        return new Response(err.message, {status: 500})
    });
    
    return new Response(data);
}