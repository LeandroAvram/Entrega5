const express = require('express')
const configRoutes = require('./router/routes')
const exphbs = require('express-handlebars')
const FileArray = require('./Contenedor')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const fa = new FileArray('./productos.txt')

const app = express()
app.use(express.json())
app.use('/', express.static('public'))
app.use(express.urlencoded({ extended: true }))

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

io.on('connection', async socket => {
  console.log('Nuevo cliente conectado')

  socket.emit('actualizarProductos', await fa.getAll())

  socket.on('nuevoProducto', async producto => {
      await fa.save(producto)
      io.sockets.emit('actualizarProductos', await fa.getAll())
  })

})

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index.hbs'
  }))

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('main',{})
  })

app.get('/product', async (req, res) => {
    const array = await fa.read()
    if(array.length!=0){
      dataexits = true
    }else{
      dataexits = false
    }
    res.render('product',{array,dataexits})
})

configRoutes(app)


/* Server Listen */
const PORT = 8080
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))