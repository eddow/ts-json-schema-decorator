const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
	homeDir: "src",
	output: "dist/$name.js",
	cache: false
});
fuse.bundle("ts-json-schema-decorator")
	.instructions(`> index.ts`);

fuse.run();
