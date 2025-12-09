/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/service/',
    encodeUrl: Ultraviolet.codec.plain.encode,
    decodeUrl: Ultraviolet.codec.plain.decode,
    handler: '/violet/violet.handler.js',
    client: '/violet/violet.client.js',
    bundle: '/violet/violet.bundle.js',
    config: '/violet/violet.config.js',
    sw: '/violet/violet.sw.js',
};
