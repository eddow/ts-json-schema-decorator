const {FuseBox, TypeScriptHelpers, EnvPlugin, QuantumPlugin} = require("fuse-box");
const fuse = FuseBox.init({
	homeDir: "src",
	output: "dist/$name.js",
	cache: false,
	//debug: true,
	sourceMaps: true,
	plugins: [
		TypeScriptHelpers(),
		//EnvPlugin({NODE_ENV: production ? "production" : "development"}),
		//QuantumPlugin()
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
	.watch()
	.instructions('> [index.ts]');

fuse.run();
