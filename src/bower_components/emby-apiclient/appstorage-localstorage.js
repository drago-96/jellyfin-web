define([], function() {
    "use strict";

    function onCachePutFail(e) {
        console.log(e)
    }

    function updateCache(instance) {
        var cache = instance.cache;
        cache && cache.put("data", new Response(JSON.stringify(instance.localData))).catch(onCachePutFail)
    }

    function onCacheOpened(result) {
        this.cache = result, this.localData = {}
    }

    function MyStore() {
        try {
            self.caches && caches.open("embydata").then(onCacheOpened.bind(this))
        } catch (err) {
            console.log("Error opening cache: " + err)
        }
    }
    return MyStore.prototype.setItem = function(name, value) {
        localStorage.setItem(name, value);
        var localData = this.localData;
        if (localData) {
            localData[name] !== value && (localData[name] = value, updateCache(this))
        }
    }, MyStore.prototype.getItem = function(name) {
        return localStorage.getItem(name)
    }, MyStore.prototype.removeItem = function(name) {
        localStorage.removeItem(name);
        var localData = this.localData;
        localData && (localData[name] = null, delete localData[name], updateCache(this))
    }, new MyStore
});