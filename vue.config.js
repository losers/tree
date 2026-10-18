const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = function (algorithm, options) {
    return crypto_orig_createHash(algorithm === "md4" ? "sha256" : algorithm, options);
};

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
