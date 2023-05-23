import ProductoClass from "../clases/clasesProducto.js"
import { faker } from "@faker-js/faker";
import config from "../../config/config.js";


faker.locale = 'es'


const productoService = new ProductoClass ()

const products = []

 export const  createProduct = async(req,res)=>{
   try {
      const result = await productoService.createProduct(req.body)
      if(result.value == false){
         let i = {status:result.status, error:result.message, url: req.url}
        return res.render('Errors', {i})
      }
      req.logger.info('Producto/s creado')
  return res.send({result: result })
      
   } catch (error) {
      req.logger.error(`Error al crear el producto , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }
 }


 export const findProductByCode = async(req,res)=>{
   const {codigo} = req.body? req.body : req.query.codigo
   
   try {
      const result = await  productoService.findProductByCode(codigo)
      console.log(result.value);

      if(result.value == false){
         let i = {status: result.status,error: result.message, url: req.url}
         return res.render('Errors', {i})

      }
      
   return  res.send({status:true,value:result})
      
   } catch (error) {
      req.logger.error(`Error al buscar el producto ${codigo} , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }
 }




 export const renderProduct = async(req,res)=>{
  
   try {
      const response = await productoService.renderProduct(req)
      const result = response[0]
      
      let i
      
      if(req.session.user){
        
          let d = req.session.user
            i = d
      }
      res.render('index',{result, i})
      
   } catch (error) {
      req.logger.error(`Error al cargar los productos , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }

 }

 export const mockingProducts = async(req,res)=>{
   for (let index = 0; index < 100; index++) {
      const product = {
         marca: faker.commerce.productName(),
         modelo: faker.commerce.productName(),
        precio: parseInt(faker.commerce.price()),
        stock: Math.round(faker.commerce.price()/10),
        codigo: faker.commerce.productName()
      }
      products.push(product)
      
   }
   res.send(products)
 }


export const renderComunity = async(req,res)=>{
   const user = req.session.user
   try {
      const result = await productoService.renderComunityProduct(req)
      result.dev = req.session.user.rol == config.developer ? true : false
      
    return  res.render('productComunity', {result, user})
      
   } catch (error) {
      req.logger.error(`Error al cargar los productos, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }
}

export const renderCreateComunityProduct = async(req,res)=>{
   const products = await productoService.renderComunityProduct(req)
   res.render('createProduct')
}

export const createComunityProduct = async(req,res)=>{
   try {
      const result = await productoService.createComunityProduct(req)
         if(result.result == false){
            let i = {message: result.message, url:'/api/comunity/renderCreate'}
            return res.render('Errors', {i})
         }
         req.logger.info('Producto creado')
      return res.redirect('/api/comunity')
      
   } catch (error) {
      req.logger.error(`Error al crear el producto , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }
}

export const personalProduct = async(req,res)=>{
   const user = req.session.user.usuario
   try {
      const result = await productoService.personalProduct(req)
         result.long = result.length == 0 ? false : true
            
      return res.render('personalProduct',{result, user})
      
   } catch (error) {
      req.logger.error(`Error al cargar los productos, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }

}

export const personalProductDelete = async(req,res) =>{
   let {code}= req.query
   try {
      const result = await productoService.personalProductDelete(req,code)
         if(result.status == false){
            let i = {message: result.message , url: '/api/personalProduct'}
              return res.render('Errors', {i})
         }
         if(req.session.user.rol == config.developer) return res.redirect('/api/comunity')
         else{
      return res.redirect('/api/personalProduct')}
      
   } catch (error) {
      req.logger.error(`Error al eliminar el producto codigo ${code}, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }
}

export const RenderproductEdit = async(req,res)=>{
   const {code} = req.query
   try {
      const product = await  productoService.findProductByCode(code)
      
      res.render('editProduct',{product})
   } catch (error) {
      req.logger.error(`Error al buscar el producto ${code} , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }
}

export const productEdit = async(req,res)=>{
   try {
      const result = await productoService.productEdit(req.body)
         if(result == false){
            let i = {message:'error al actualizar el producto', url: '/api/comunity'}
             return  res.render('Errors', {i})
         }
      req.logger.info("se edito correctamente");
      res.redirect('/api/comunity')
      
   } catch (error) {
      req.logger.error(`Error al editar el producto , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i})
   }
}

export const agregarProducto = async(req,res)=>{
   const {codigo} = req.query
   try {
      const result = await productoService.agregarProducto(codigo,req)
      
       return   req.logger.info(result.message)
      
      
   } catch (error) {
       req.logger.error(`Error al agreagar el producto codigo ${codigo} , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
   }

}