const path = require('path');

module.exports = {
    babel: {
        presets: [['@babel/preset-react', { runtime: 'automatic' }]],
        plugins: ['babel-plugin-ts-nameof', '@babel/plugin-proposal-nullish-coalescing-operator'],
    },
    webpack: {
        alias: {
            '~': path.resolve(__dirname, './src'),
            '@type': path.resolve(__dirname, './src/types'),
            '@core': path.resolve(__dirname, './src/core'),
        },
    },
};
