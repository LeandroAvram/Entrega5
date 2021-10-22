const { Router } = require('express');
const FileArray = require('../Contenedor')

const routerproductos = Router();

const fa = new FileArray('./productos.txt')

// Get todos los productos
routerproductos.get('/', async (req, res) => {
    const array = await fa.read()
    return res.status(200).send(array)
});

// Get producto por ID 
routerproductos.get('/:id', async (req, res) => {
    const id = req.params.id
    const array = await fa.getById(id)
    if(!array){
        res.status(404).send({
            error: "Producto no encontrado"
        })
    }
    return res.status(200).send(array)
});

//Borrar un producto segun su id
routerproductos.delete('/:id', async (req, res) => {
    const id = req.params.id
    await fa.deleteById(id)
    const array = await await fa.read()
    return res.status(200).send(array)
});

//Agregar un producto
routerproductos.post('/', async (req, res) => {
    const { title, price, thumbnail } = req.body
    const json = {
        title: title,
        price: price,
        thumbnail: thumbnail
    }
    const num = await fa.save(json)
    const array = await fa.getById(num)
    return res.render('productform',{})
});

//Actualizar un producto
routerproductos.put('/:id', async (req, res) => {
    const { title, price, thumbnail } = req.body
    const arrayProduct = await fa.getAll()
    const index = arrayProduct.findIndex( result => result.id == req.params.id )

    if( index > -1){
        arrayProduct[index].title = title
        arrayProduct[index].price = price
        arrayProduct[index].thumbnail = thumbnail
        await fa.saveElementID(arrayProduct[index],index)
        return res.status(200).send(arrayProduct[index])
    }
   
    return res.status(400).send({
        error: 'Producto no encontrado'
    })
});


exports.routerproductos = routerproductos;