var webpack = require("webpack"),
	path = require("path");

module.exports = {
  	target: 'node',
	mode: 'development',	//This is meant to be bundled afterward anyway
	context: path.resolve(__dirname, 'test'),
	entry: {
		test: ['./person.ts'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "test"),
		chunkFilename: "[chunkhash].js"
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			loader: 'ts-loader',
			options: {
				appendTsSuffixTo: [/\.vue$/]
			}
		}, {
			enforce: 'pre',
			test: /\.tsx?$/,
			exclude: [
				path.join(__dirname, '../node_modules')
			],
			use: "source-map-loader"
		}]
	},
	resolve: {
		extensions: [".ts"]
	}
};