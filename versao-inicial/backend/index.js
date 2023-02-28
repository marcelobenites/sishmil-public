const app = require('express')()
const consign = require('consign')/**Auxilia no gerenciamento de dependencias */
const db = require('./config/db')


app.db = db/**Instancia do knex ja configurado em db.js que faz a conexao com o banco de dados**/

consign()
    .then('./config/middlewares.js')
    .then('./api/validator.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app )/**Passa a instancia do express app para o arquivo middlewares */


app.listen(3000, () =>{
    console.log('Backend executando....')
})