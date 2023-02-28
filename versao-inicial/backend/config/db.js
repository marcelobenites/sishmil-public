const config = require('../knexfile.js')
const knex = require('knex')(config)

/** knex.migrate.latest([config])Atualiza as migrations sempre que a aplicacao do backend subir */
module.exports = knex