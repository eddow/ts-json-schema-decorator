import typescript from 'rollup-plugin-typescript';

export default {
	entry: 'src/index.ts',
	format: 'cjs',
	plugins: [typescript()],
	sourceMap: true,
	external: ['reflect-metadata'],
	dest: 'dist/ts-json-schema-decorator.js'
};
