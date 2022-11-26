module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{png,jpg,webmanifest,css,json,js,html}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};