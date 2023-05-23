import express from 'express'
import {auth,auth_api,auth_carrito, auth_P} from '../middlewares/auth/auth.middleware.js'
import {productEdit, renderProduct,createProduct, mockingProducts, renderComunity,renderCreateComunityProduct, createComunityProduct,personalProduct, personalProductDelete,RenderproductEdit, agregarProducto, findProductByCode} from '../dao/controller/controllerProducto.js'


const routerProd = express.Router()
routerProd.use(express.json())


routerProd.get('/', renderProduct)
routerProd.post('/api',auth_api, createProduct)
routerProd.get('/mockingProducts',auth_api, mockingProducts)
routerProd.get('/api/findProduct', auth_api,findProductByCode)
routerProd.get('/api/renderProductEdit',auth_api,RenderproductEdit)
routerProd.post('/api/productEdit', auth_api,productEdit)
        
routerProd.get('/api/comunity',auth_P,renderComunity)
routerProd.get('/api/comunity/renderCreate',auth_P,renderCreateComunityProduct)
routerProd.post('/api/comunity/createProduct', auth_P,createComunityProduct )
routerProd.get('/api/personalProduct',auth_P,personalProduct)
routerProd.get('/api/personalProduct/delete',auth_P, personalProductDelete)
routerProd.get('/api/agregarProductoComunity', auth_P, agregarProducto)
routerProd.get('/api/agregarProducto', auth, agregarProducto)


export default routerProd