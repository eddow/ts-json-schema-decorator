var rollup = require('rollup'),
	rollupTypescript = require('rollup-plugin-typescript'),
	cjs = require('rollup-plugin-commonjs');


rollup.rollup({
	entry: "./test/person.ts",
	format: "cjs",
	plugins: [
		rollupTypescript(),
		cjs()
	],
	external: ['../dist/ts-json-schema-decorator', 'reflect-metadata']
}).then(bundle=> {
	bundle.write({
		format: "cjs",
		dest: "./test/person.js",
		external: ['../dist/ts-json-schema-decorator', 'reflect-metadata']
	}).then(x=> {
		var t = require('./test/person.js');
		//console.dir(t);
	});

});
