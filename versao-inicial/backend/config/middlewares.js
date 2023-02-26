const bodyParser = require('body-parser')
const cors = require('cors')

/*app recebido em app e' definido em index.js e uma instancia do express*/
module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}