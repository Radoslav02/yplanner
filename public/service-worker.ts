/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// Ensure that Workbox is loaded before proceeding
declare const workbox: any;

const { routing, strategies, expiration } = workbox;

routing.registerRoute(
	/\.(?:css|js|jsx|json)(\?|$)/,
	new strategies.StaleWhileRevalidate({
		cacheName: 'assets',
		plugins: [
			new expiration.Plugin({
				maxEntries: 1000,
				maxAgeSeconds: 31536000,
			}),
		],
	})
);

routing.registerRoute(
	/\.(?:png|jpg|jpeg|gif|woff2)$/,
	new strategies.CacheFirst({
		cacheName: 'images',
		plugins: [
			new expiration.Plugin({
				maxEntries: 1000,
				maxAgeSeconds: 31536000,
			}),
		],
	})
);

routing.registerRoute(
	/(\/)$/,
	new strategies.StaleWhileRevalidate({
		cacheName: 'startPage',
		plugins: [
			new expiration.Plugin({
				maxEntries: 1000,
				maxAgeSeconds: 31536000,
			}),
		],
	})
);
