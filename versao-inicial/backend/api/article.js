const queries = require('./queries')

module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validator /**Recebe funcoes de validacao */

    const save = (req, res) => {
        const article = {...req.body}
        if(req.params.id) article.id = req.params.id

        try{
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        }catch(msg){
            res.status(400).send(msg)/** STATUS 400: o servidor não pode ou não irá processar a requisição devido a alguma coisa que foi entendida como um erro do cliente*/
        }

        /**Persistindo no banco*/ 
        if(article.id)/**UPDATE*/{
            app.db('articles')
                .update(article)
                .where({id: article.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{
            console.log('Inserindo no banco')
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            const rowsDeleted = await app.db('articles')
                .where({id: req.params.id}).del()
            notExistsOrError(rowsDeleted, 'Artigo não foi encontrado.')
        }catch(msg){
            res.status(500).send(msg)
        }
    }

    /**Paginacao dos artigos */
    const limit = 10 /**limite maximo de artigos por pagina */
    const get = async(req, res) => {
        const page = req.query.page || 1 /**O atributo que especifica qual pagina o usuario quer acessar vem da query */

        const result = await app.db('articles').count('id').first() /**puxa do banco quantos registros tem para fazer a distribuicao por paginas */
        const count =  parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)/**calcula o deslocamento de onde comecar em cada pagina*/
            .then(articles => res.json({data: articles, count, limit}))/**Inclui count e limit para responder toda a informacao necessaria para montar o paginador numa unica chamada*/
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({id: req.params.id})
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    /** Pega todos os artigos de uma determinada categoria, incluindo artigos de categorias filhas*/
    const getByCategory = async (req, res) => {
        const categoryId = req.params.id /**Embora seja o js de artigos, neste caso a funcao recebe o id da categoria */
        const page = req.query.page || 1 
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId) /**consulta com sql raw passando o id recebido na requisicao*/
        const ids = categories.rows.map(c => c.id)/**faz um map nos ids recebidos no comando anterior */

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {author: 'u.name'})
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id','a.userId'])
            .whereIn('categoryId', ids)/**todos os artigos que pertencem as categorias cujos ids foram obtidos no comando anterior*/
            .orderBy('a.id', 'desc')/**ordena por tempo de publicacao */
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }
        

    
    return{get, getByCategory, getById, save, remove}


}