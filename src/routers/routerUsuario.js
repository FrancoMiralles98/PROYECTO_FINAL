import express, { Router } from 'express'
import { auth,auth_api } from '../middlewares/auth/auth.middleware.js'
import {actualizarPassword,cambiarFoto,renderConfigUser,getUsuarioById,getUsuarios,getUsuariosPremium,deleteUsuario,getHistorial } from '../dao/controller/controllerUsuario.js'
import multer from 'multer'
import __dirname from '../util.js'
import cookieParser from 'cookie-parser'


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, __dirname + '/public/img/perfil')
    },
    filename: function(req,file,cb){
        
        let img_name = ''
        if(file){
            
        let cut = file.originalname ? file.originalname.replace(/[(.png)]/gi,'') : undefined
        img_name = cut ? `${cut}_${req.session.user.usuario}.png`: undefined}
        cb(null, img_name)
        
    }
})

const uploader = multer({storage})

const routerUsuario = Router()

routerUsuario.use(cookieParser('cookieToken'))

routerUsuario.get('/api/',auth_api,getUsuarios)
routerUsuario.get('/api/user/:id',auth_api,getUsuarioById)
routerUsuario.get('/api/getPremium/',auth_api,getUsuariosPremium)
routerUsuario.get('/api/delete/:id',auth_api,deleteUsuario)
routerUsuario.get('/historial',auth,getHistorial)
routerUsuario.get('/api/configUser',auth,renderConfigUser)
routerUsuario.post('/api/cambiarFoto', auth, uploader.single('file'), cambiarFoto)
routerUsuario.post('/api/actualizarPassword', auth,actualizarPassword)
export default routerUsuario