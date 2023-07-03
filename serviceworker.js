RESOURCES = [
    "/index.html"
]

self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open("v1");
        await cache.addAll(RESOURCES);
    })());
});

const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
};

self.addEventListener("fetch", (event) => {
    event.respondWith((async () => {
        try {
            const responseFromNetwork = await fetch(event.request, {cache: 'no-cache'});
            putInCache(event.request, responseFromNetwork.clone());  // No await

            return responseFromNetwork;
        } catch (e) {
            const responseFromCache = await caches.match(event.request);
            if (responseFromCache) {
                return responseFromCache;
            }

            throw (e);
        }
    })());
});
