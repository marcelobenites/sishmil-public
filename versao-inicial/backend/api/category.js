module.exports = app =>{
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validator /**Recebe funcoes de validacao */
    
    const save = (req, res) => {
        const category = {...req.body}
        if(req.params.id) category.id = req.params.id

        try{
            existsOrError(category.name, 'Nome da categoria  não informado')
            /**TODO: adicionar validacao de tamanho de string */
        }catch(msg){
            return res.status(400).send(msg)
        }

        
        if(category.id) {/**Update */
            app.db('categories')
                .update(category)
                .where({id:category.id})
                .then(_ =>res.status(204).send('Categoria atualizada com sucesso'))
                .catch(err => res.status(500).send(err))/**erro na parte da aplicacao */
        }else{/**Insert*/
            app.db('categories')
                .insert(category)
                .then(_ =>res.status(204).send('Categoria atualizada com sucesso'))
                .catch(err => res.status(500).send(err))/**erro na parte da aplicacao */
        }
    }

    /**Remocao */
    const remove = async(req, res) => {/**Remocao deve conter todas as validacoes para evitar erros de remocao no banco*/
        try{
            existsOrError(req.params.id, 'Codigo da categoria nao informado.')

            const subcategory = await app.db('categories')
                .where({parentId: req.params.id})
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')

            const articles = await app.db('articles')
                .where({parentId: req.params.id})
            notExistsOrError(articles, 'Categoria possui artigos.')

            const rowsDeleted = await app.db('categories')
                .where({id: req.params.id}).del()
            existsOrError(rowsDeleted, 'Categoria nao foi encontrada')

            res.status(204).send()
        }catch(msg) {/**Erro na validacao */
            res.status(400).send(msg)
        }

    }

    /**Recebe uma lista de categorias e retorna uma copia dessa lista na qual cada categoria tera seu path incluido */
    const withPath = categories => {
        const getParent = (categories, parentId) => {/**pega categoria pai ou nulo se nao ha pai */
            let parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {/**acrescenta o atributo path as categorias, nulo se a categoria nao tiver pai */
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent){/** monta o path separando o nome das categorias ancestrais com < */
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return {...category, path}
        })

        /**funcao sort de ordenacao que organiza a lista em ordem alfabetica as categorias e subcategorias */
        /**para reproduzir em outras situacoes, verifique a funcao sort de array no js */
        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    /**get retorna todas as categorias */
    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))/**erro na parte da consulta/backend */
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({id: req.params.id})
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    return {save, get, getById, remove}
}