/**Arquivo com as consultas em sql raw ao banco */
module.exports = {
    categoryWithChildren: /**consulta gera de forma recursiva os ids de uma categoria e todas as suas subcategorias associadas*/ `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories`    
}