import config from "../../config/config.js"
import carritomodel from "../../dao/models/modelsCarrito.js"




export const auth = (req,res,next)=>{
    if(!req.session.user){
        let i = {
            message: 'Debes iniciar session para poder ingresar'
            }
            return  res.render('Errors', {i})
    }
    next()
}

export const auth_P = (req,res,next) => {
            
    if(!req.session.user){
        let i = {
            message: 'Debes iniciar session para poder ingresar'
            }
          return  res.render('Errors', {i})
    }
    if(req.session.user.rol == config.user_status1 ){
        let i ={
            message: 'Acceso no autorizado'
        }
       return  res.render('Errors', {i})
    }
    next()
}

export const auth_api = (req,res,next)=>{
        if(!req.session.user){
            req.logger.info('No hay sesion iniciada')
        let i = {message: 'Debes iniciar sesion'}
            return res.render('Errors', {i})
        }
    if(req.session.user){

        if(req.session.user.rol !== config.developer){
            let i = {message: 'Error al cargar la pagina'}
          return  res.render('Errors', {i})
        }}
            else{
                let i = {message: 'Error al cargar la pagina'}
                res.render('Errors', {i})
            }
    next()
}

export const auth_carrito = async(req,res,next)=>{
     
    if(req.session.user){
    const filtro = await carritomodel.findOne({id: req.session.user.carritoId})
        
        if(req.params.cid){
            if(parseInt(req.params.cid) !== req.session.user.carritoId){
                let i = {message: 'Error al ejecutar comando, acceso no autorizado'}
                return  res.render('Errors', {i})
            }
        }
    if(!filtro){
        let i = {message: 'Error al ejecutar comando, acceso no autorizado'}
      return  res.render('Errors', {i})
    }}
    if(!req.session.user){
        let i = {message: 'Error al ejecutar comando, acceso no autorizado'}
      return  res.render('Errors', {i})
    }
    next()
}