module.exports = {
    pages: {
        index: {
            entry: 'src/pages/index/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        },
        app: {
            entry: 'src/pages/list/list.js',
            template: 'public/app.html',
            filename: 'app.html',
        }
      }
};