'use strict';

const CACHE_NAME = "connect-app-estatico";

const FILES_STATIC = [

    'css/bootstrap.min.css',
    'css/styles.css',
    'icons/favicon.ico',
    'icons/152.png',
    'imgs/bg1.jpg',
    'imgs/cat_icon.png',
    'imgs/loading.gif',
    'imgs/logo1.png',
    'imgs/logo2.png',
    'imgs/offline.png',
    'js/app.js',
    'js/bootstrap.bundle.min.js',
    'offline.html'
];

//Instalação
self.addEventListener('install', (evt) => {

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log("Service Worker realizando caches estáticos");
            return cache.addAll(FILES_STATIC);

        })

    );
    self.skipWaiting();

});

//Ativação
self.addEventListener('activate', (evt) => {

    evt.waitUntil(

            caches.keys().then((keylist) => {

                return Promise.all(keylist.map((key) => {

                    if(key !== CACHE_NAME){
                        return caches.delete(key);
                    }

                }));

            })

    );

    self.clients.claim();

});

//Responder um página Offline (fetch)

self.addEventListener('fetch', (evt) => {

    if(evt.request.mode !== 'navigate'){
        return;
    }

    evt.respondWith(

        fetch(evt.request).catch(() => {
            return caches.open(CACHE_NAME).then((cache) => {

                return cache.match('offline.html');

            })
        })

    );

});