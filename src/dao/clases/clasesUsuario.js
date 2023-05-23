import usuariomodel from "../models/modelsUsuario.js"
import ticketModel from '../../dao/models/modelsTicket.js'
import { createHash, isValidPassword } from "../../util.js"

export default class UsuarioClass{

    getUsuarios = async()=>{
        const result = await usuariomodel.find()
        return result 
    }

    getUsuarioById = async(id)=>{
        
        const result = await usuariomodel.findById({_id:id})
            let user = {
                usuario : result.usuario,
                contraseña: result.contraseña,
                carritoId: result.carritoId,
                imgPerfil: result.imgPerfil,
                rol: result.rol,
                email: result.email,
                lastConnection: result.lastConnection,
                totalConection: result.totalConection
            }
            return user 
    }

    deleteUsuario = async(id)=>{
    
        const result = await usuariomodel.deleteOne({_id: id})
        let message = `Usuario id:${id} eliminado.`
            return message
    }

    getUsuariosPremium = async()=>{
        const result = await usuariomodel.find({rol:'premium'})
        return result
    }

    getHistorial = async(req)=>{
        let list = { docs:[]}
            const productUser = await ticketModel.find({usuario:req.session.user.usuario})
            list.docs = productUser.map(e =>{
                return {fecha: e.fecha,
                codigo: e.codigo,
                productos: e.productos,
                monto: e.monto}
            })
           
        
        return list
    }

    cambiarFoto = async(file,req)=>{
        if(!file){
            return {value: false, message:'Error al cargar la imagen'}
        }
        let user = await usuariomodel.findOne({usuario: req.session.user.usuario})
        const cut = file.originalname.replace(/[(.png)]/gi,'')
        
            user.imgPerfil = `/img/perfil/${cut}_${req.session.user.usuario}.png`
        user.save()
        return user
    }

    actualizarPassword = async(req)=>{
        let user = await usuariomodel.findOne({usuario:req.session.user.usuario})
        if(isValidPassword(user,req.body.actualpassword)){
            if(req.body.nuevacontraseña == req.body.nuevacontraseña2){
                user.contraseña = createHash(req.body.nuevacontraseña)
                user.save()
             
             return {value:true, message:'contraseña actualizada'}
            }
            else{
             return {value:false, message:"error al actualizar, contraseña no coinciden"}
            }
        }else{
            return {value:false, message:"error al cambiar la contraseña"}
             }
        
    }
}