const { routerproductos } = require("./productoslogic")

function config(app) {
    app.use('/api/productos', routerproductos)
}

module.exports = config