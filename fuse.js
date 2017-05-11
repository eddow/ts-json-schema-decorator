const {FuseBox} = require("fuse-box");
const fuse = FuseBox.init({
	homeDir: "src",
	output: "dist/$name.js",
	cache: false,
	package: {
		name: "ts-json-schema-decorator",
		main: "src/index.ts"
	}
});
fuse.bundle("ts-json-schema-decorator")
	.instructions(`> index.ts`);

fuse.run();
