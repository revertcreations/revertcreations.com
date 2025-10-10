const mix = require('laravel-mix');
const chokidar = require('chokidar');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/home.js', 'js')
    .js('resources/js/projectDetail.js', 'js')
//    .js('resources/js/playground.js', 'js')
    .postCss('resources/css/app.css', 'public/css', [
        require('tailwindcss'),
    ]);

mix.options({
    hmrOptions: {
        host: 'revertcreations.test',
        port: 8080,
    },
});


mix.webpackConfig({
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        onBeforeSetupMiddleware(server) {
            chokidar.watch([
              './resources/views/**/*.blade.php'
            ]).on('all', function() {
              server.sendMessage(server.webSocketServer.clients, 'content-changed');
            })
        },
    },
});
