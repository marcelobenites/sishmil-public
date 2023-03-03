module.exports = app =>{
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/categories')
        .get(app.api.category.get)
        .post(app.api.category.save)

    app.route('/categories/tree')/**Em caso de roteamentos com o mesmo tipo de chamada, URLs menos genericas devem ficar encima */
        .get(app.api.category.getTree)
        
    app.route('/categories/:id')/**Em caso de roteamentos com o mesmo tipo de chamada, URLs mais genericas devem ficar embaixo */
        .put(app.api.category.save)
        .get(app.api.category.getById)
        .delete(app.api.category.remove)

    app.route('/categories/:id/articles')/**Em caso de roteamentos com o mesmo tipo de chamada, URLs mais genericas devem ficar embaixo */
        .get(app.api.article.getByCategory)
    
    app.route('/articles')
        .get(app.api.article.get)
        .post(app.api.article.save)

    app.route('/articles/:id')
        .get(app.api.article.getById)
        .put(app.api.article.save)
        .delete(app.api.article.remove)



}