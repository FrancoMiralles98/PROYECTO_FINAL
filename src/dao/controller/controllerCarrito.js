import CarritoClass from "../clases/clasesCarrito.js";
import ProductoClass from "../clases/clasesProducto.js";
const carritoService = new CarritoClass()
const productService = new ProductoClass()


    export const getCarritoById = async(req,res)=>{
        let cid = req.params.id
        try {
            const result = await carritoService.getCarritoById(cid)
            if(result.value == false){
                let i = {status: result.status, error: result.message, url: req.url}
                return res.render('Errors',{i})
            }
            return res.send({result: result })

        } catch (error) {
            req.logger.error(`Error al obtener el carrito id:${cid}, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i})
        }
    }

    export const getCarritos  = async(req,res)=>{
        try {
            const result = await carritoService.getCarritos()
            if(result.value == false){
                let i = {status: result.status, error: result.message, url: req.url}
                return res.render('Errors',{i})
            }
            
         return   res.json(result)
            
        } catch (error) {
            req.logger.error(`Error al obtener los carritos de la DB, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i})
        }
        }

    export const createCarrito = async(req,res)=>{
        try {
            let result = await carritoService.createCarrito()
            req.logger.info('Carrito creado')
            return   res.json(result)
        } catch (error) {
            req.logger.error(`Error al crear el carrito, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i})
        }
    }

    export const deleteProdCarrito = async(req,res)=>{
        let cid = req.params.cid
        let pid= req.params.pid
            try {
                const result = await carritoService.deleteProdCarrito(cid,pid)
                if(result.value == false){
                    let i = {status: result.status, error: result.message, url:req.url}
                return res.render('Errors', {i})
                }
                    req.logger.info(`producto ${pid} eliminado del carrito ${cid}`)
             return   res.send({result: result})
                
            } catch (error) {
            req.logger.error(`Error eliminar del carrito id: ${cid} el producto codigo: ${pid}, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i})
            }

        }
        

    export const deleteAllProdCarrito = async(req,res)=>{
        let cid = req.params.cid
        
        try {
            const result = await carritoService.deleteAllProdCarrito(cid)
            
            if(result.value == false){
                let i = {status: result.status, error: result.message, url: req.url}
                    return res.render('Errors', {i})
            }
            req.logger.info(`Se han borrado todos los productos del carrito ${cid}`)
            return res.send({result: result})

        } catch (error) {
            
            req.logger.error(`Error al eliminar los productos del carrito id: ${cid}, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
        }
        
    }



    export const renderCarrito = async(req,res)=>{
        let cid = req.params.cid
        try {
            if(req.session.user.carritoId == cid){
            const result = await carritoService.renderCarrito(cid)
            
                if(result['productos'].length == 0){
                    result.length = false
                }
                else{
                    result.length = true
                }
                
         return   res.render('carrito', result)}
         
                else{
                    let i = {message: 'Error al cargar esta pagina'}
                    res.render('Errors', {i})
                }
            
        } catch (error) {
            req.logger.error(`Error al agregar el producto ${cprod} al carrito ${i.carritoId}, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
        }
        }

     export const agregarProdCarrito = async(req,res)=>{
        
       const i= req.session.user
        const cprod = req.params.cprod

        try {
            const result = await carritoService.agregarProdCarrito( i,cprod)
            if(result.value == false){

                req.logger.info(`No se puede agregar mas producto ${cprod} al carrito,falta de stock`)
                return res.redirect(`/carrito/listado/${i.carritoId}`)
            }
            req.logger.info(`Se ha agregado el producto a tu carrito`)
            return res.redirect(`/carrito/listado/${i.carritoId}`)

        } catch (error) {
            req.logger.error(`Error al agregar el producto ${cprod} al carrito ${i.carritoId}, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
        }

       
    }

    export const sacarProdCarrito = async(req,res)=>{
        const user = req.session.user
        const cprod = req.params.cprod
        try {
            const result = await carritoService.sacarProdCarrito(user,cprod)
            if(result.value == false){
                let i = {status: result.status, error:result.message, url:req.url}
                return res.render('Errors', {i})
            }
            req.logger.info('Se ha restado el producto del carrito')
            return res.redirect(`/carrito/listado/${user.carritoId}`)
            
        } catch (error) {
            req.logger.error(`Error al sacar el producto ${cprod} al carrito ${user.carritoId}, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i}) 
        }
        
    } 