import express from 'express'
import { getCarritoById,getCarritos,deleteAllProdCarrito,deleteProdCarrito,renderCarrito,createCarrito,agregarProdCarrito,sacarProdCarrito} from '../dao/controller/controllerCarrito.js'
import errorMiddleware from '../middlewares/errors/error.middleware.js'
import {auth_api,auth_carrito,auth } from '../middlewares/auth/auth.middleware.js'


const routerCarrito = express.Router()
routerCarrito.use(errorMiddleware)

routerCarrito.use(express.json())



routerCarrito.get('/:id',auth_api, getCarritoById )

routerCarrito.get('/',auth_api, getCarritos)


routerCarrito.post('/',auth_api, createCarrito)

routerCarrito.delete('/api/:cid/products/:pid',auth_api,deleteProdCarrito)

routerCarrito.delete('/api/:cid',auth_carrito,deleteAllProdCarrito)

 routerCarrito.get('/agregar/:cprod',auth_carrito, agregarProdCarrito)

routerCarrito.get('/sacar/:cprod',auth_carrito, sacarProdCarrito) 

        

routerCarrito.get('/listado/:cid',auth,renderCarrito)


export default routerCarrito
 