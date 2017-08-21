const {FuseBox, QuantumPlugin} = require("fuse-box");
const fuse = FuseBox.init({
	homeDir: "src",
	output: "dist/$name.js",
	cache: false,
	sourceMaps: true,
	plugins: [
		//EnvPlugin({NODE_ENV: production ? "production" : "development"}),
		QuantumPlugin({
			bakeApiIntoBundle: 'ts-json-schema-decorator',
			containedAPI: true,
			target: 'npm'
		})
	],
	package: {
		name: "ts-json-schema-decorator",
		main: 'index.ts'
	},
	globals: {
		'ts-json-schema-decorator': '*'
	}
});
fuse.bundle("ts-json-schema-decorator")
	.instructions('> [index.ts]');

fuse.run();
