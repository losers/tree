module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: 'http://localhost:5000',
                secure : false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
        pages: {
            index: {
                entry: 'src/pages/index/main.js',
                template: 'public/index.html',
                filename: 'index.html',
            },
            app: {
                entry: 'src/pages/app/app.js',
                template: 'public/app.html',
                filename: 'app.html',
            }
        }
}