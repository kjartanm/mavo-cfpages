export async function onRequestGet(context) {

    let path = context.params.path.join('/');
    let image;
    if (path.length > 1) {
        image = await context.env.MAVO_FILES.get(path);
    }

    if (!image) {
        return new Response(null, { status: 404 });
    }

    const headers = new Headers()
    image.writeHttpMetadata(headers)

    return new Response(image.body, {
        headers,
        status: 200
    });
}