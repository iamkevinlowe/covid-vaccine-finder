const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
	return {
		mode: env.NODE_ENV || 'production',
		entry: {
			background: './src/background.js',
			popup: './src/popup.js',
			sd_covid: './src/sd_covid.js',
			calvax: './src/calvax.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: ['babel-loader']
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				chunks: ['popup'],
				filename: 'popup.html',
				template: './src/popup.html'
			})
		],
		devtool: 'source-map'
	};
};
