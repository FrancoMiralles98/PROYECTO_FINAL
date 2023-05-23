import { getErrorInfo } from "../../middlewares/errors/error.middleware.js"
import UsuarioClass from "../clases/clasesUsuario.js"
import multer from "multer"


const usuarioService = new UsuarioClass ()

    export const getUsuarios = async(req,res)=>{
        try {
            const result = await usuarioService.getUsuarios()
            return res.send({result:result})
            
        } catch (error) {
            req.logger.error(`Error al obtener los usuarios de la DB, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            return   res.render('Errors',{i})
        }
    
}

    export const getUsuarioById = async(req,res)=>{
        let id = req.params.id
        try {
            const result = await usuarioService.getUsuarioById(id)
            if(result.value == false){
                let i = getErrorInfo(req,res,result)
                return res.render('Errors', {i})
            }
                return res.send({result: result})
            
        } catch (error) {
            req.logger.error(`Error al obtener los usuario ${id} de la DB, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            return   res.render('Errors',{i})
        }
    }

    export const deleteUsuario = async(req,res)=>{
        let id = req.params.id
        try {
            const result = await usuarioService.deleteUsuario(id)
            return res.send({result: result})
            
        } catch (error) {
            req.logger.error(`Error al eliminar el usuario ${id} de la DB, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            return   res.render('Errors',{i})
        }
    }

    export const getUsuariosPremium = async(req,res)=>{
        try {
            const result = await usuarioService.getUsuarioPremium()
            return res.send({result: result})
            
        } catch (error) {
            req.logger.error(`Error al obtener los usuarios premium de la DB, en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            return   res.render('Errors',{i})
        }
    }
    
    export const getHistorial = async(req,res)=>{
        try {
            let result = await usuarioService.getHistorial(req)
            result.largo = result.docs.length > 0 ? true : false
            res.render('historial', {result})
            
        } catch (error) {
            req.logger.error(`Error al obtener el historial , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            return   res.render('Errors',{i})
        }
    }
    
    export const renderConfigUser =(req,res)=>{
        
        const user = req.session.user
        user.imgPerfil = req.user.imgPerfil
        res.render('editPerfil', {user})
    }

    export const cambiarFoto = async(req,res)=>{
      
        if(!req.body){
                console.log('no se cargo la imagen');
        }
        try {
            const result = await usuarioService.cambiarFoto(req.file,req)
                if(result.value == false){
                    return req.logger.info(result.message)
                }
            req.session.user.imgPerfil = result.imgPerfil
            res.cookie('cookieToken', req.session.user.token).redirect('/')
       
         } catch (error) {
            req.logger.error(`Error al cargar la imagen , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            return   res.render('Errors',{i})
        } 
 

       
    }
    
    export const actualizarPassword = async(req,res)=>{
        try {
            const result = await usuarioService.actualizarPassword(req)
                if(result.value == true){
                    req.logger.info(result.message)
                    return res.redirect('/')
                }
                else{
                    req.logger.info(result.message)
                    return res.redirect('/usuario/api/configUser')
                }
            
        } catch (error) {
            req.logger.error(`Error al actualizar  la contraseña , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            return   res.render('Errors',{i})
        }
    }