/**
 * Build config for electron 'Main Process' file
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import BabiliPlugin from 'babili-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
    /**
     * Set target to Electron specific node.js env.
     * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
     */
    target: 'electron-main',

    devtool: 'source-map',

    entry: './app/main',

    // 'main.js' in root
    output: {
        path: __dirname,
        filename: './static/main.js'
    },

    plugins: [
        /**
         * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
         */
        new BabiliPlugin(),

        new BundleAnalyzerPlugin({
            analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
            openAnalyzer: process.env.OPEN_ANALYZER === 'true'
        }),

        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
            'process.env.DEBUG_PROD': JSON.stringify(process.env.DEBUG_PROD || 'false')
        })
    ]
});

