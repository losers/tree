module.exports = {
    lintOnSave: false,
    devServer: {
        before(app) {
            app.get('/app/*', (req, res, next) => {
                req.url = '/app.html';
                next();
            });
            app.get('/app', (req, res, next) => {
                req.url = '/app.html';
                next();
            });
        },
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
