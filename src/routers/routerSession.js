import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import nodemailer from 'nodemailer'
import usuariomodel from '../dao/models/modelsUsuario.js'
import { createHash } from '../util.js'
import UsuarioClass from '../dao/clases/clasesUsuario.js'
import config from '../config/config.js'

const usuarioService = new UsuarioClass()

const routersession = express.Router()
routersession.use(express.json())
routersession.use(express.urlencoded({extended:true}))
routersession.use(cookieParser('cookieToken'))


const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user: config.nodemailer_user,
        pass: config.nodemailer_pass
    }
})





routersession.get('/iniciarsesion', (req,res)=>{
    res.render('login')
    
})

routersession.post('/iniciarsesion',passport.authenticate('login',{failureRedirect:'/session/faillogin'}),

async(req,res)=>{
    
    if(!req.user) res.send('No se ha encontrado el usuario')
        req.session.user = req.user
        const user = await usuariomodel.findOne({usuario: req.session.user.usuario})
                user.totalConection = user.totalConection +1
                user.save()
         res.cookie('cookieToken', req.user.token).redirect('/')}
)


routersession.get('/faillogin',(req,res)=>{
     res.render('faillogin')
})


// ----              ----                     ----                ----            -----      -----


routersession.get('/registrar', (req,res)=>{
    res.render('registro')
})

routersession.post('/registrar',passport.authenticate('register',{failureRedirect: '/session/failregister'}) ,(req,res)=>{
    
res.redirect('/session/iniciarsesion')
})

routersession.get('/failregister',(req,res)=>{
    res.render('failregister')
})



// -----                 ----                     -----                       -----          ---- 

routersession.get('/logout', async(req,res)=>{
    try {
        if(req.session.user.usuario){
        let user = await usuariomodel.findOne({usuario: req.session.user.usuario})
            const date = new Date()
            user.lastConnection = `${new Date().toLocaleString()}`
            user.save()
        }
        if(req.session){
        req.session.destroy(err =>{
            if(err){
           return res.render('Hubo un error al desconcectarse', err)}
       return res.clearCookie('cookieToken').redirect('/')
        
    })}
       else{return res.redirect('/')} 
        
    } catch (error) {
        
    }
})

// -----                  -----                     -----

routersession.get('/login-google',passport.authenticate('google', {scope: ['email','profile']}),
    async(req,res)=>{}
    )





routersession.get('/google',passport.authenticate('google', {failureRedirect:'/iniciarsesion'}),async(req,res)=>{
    req.session.user = req.user
    res.redirect('/')
})


// -----              - ---                          ---                      ---                ---



routersession.get('/perfil', passport.authenticate('jwt'), async(req,res)=>{
    let userp = await usuarioService.getUsuarioById(req.user._id)
    
    
    let user = userp
   req.session.user = req.user
   req.session.user.token = req.cookies.cookieToken
    user.p = req.session.user.rol == config.user_status1 ? false : true
    
    res.render('perfil', {user})
})

routersession.get('/veremail', (req,res)=>{
    res.render('verificacionEmail')
})


routersession.post('/mailing', async (req,res)=>{
    let {email} = req.body
        
    let verification = await usuariomodel.findOne({email:email})
        if(verification == undefined || null ){
            let i = {message:`Error al obtener el email, email invalido`,
                     url: '/session/veremail'}
            return res.render('Errors', {i})
        }
   let verificationLink = "http://localhost:8080/session/psw"
    const result = await transport.sendMail({
        from: email,
        to: email,
        subject: 'Restablecer la contraseña',
        html: `
            <a href="${verificationLink}">Haga click aqui </a>`
    })
    let i = email
    res.render('entrega',{i})
})

routersession.get('/psw',(req,res)=>{
    res.render('psw')

})

routersession.post('/verify', async(req,res)=>{
    const {email,password_1,password_2} = req.body
    
    const verifyEmail = await usuariomodel.findOne({email:email})
    
        if(verifyEmail == null || password_1 !== password_2){
            let i = {
                message: 'Error al crear la nueva contraseña, el mail no es valido o las contraseñas no son iguales',
                url: "/session/psw"
            }   
            return res.render('Errors', {i})
        }
        
            verifyEmail.contraseña = createHash(password_1)
            verifyEmail.save()
        res.render('password_confirm')

})



routersession.get('/getP', (req,res)=>{
    if(req.session.user){
       
    res.render('getP')}
        else{
            let i= {message: 'Error al cargar la pagina'}
                res.render('Errors',{i})
        }
})

routersession.get('/doneP', async(req,res)=>{
    
    if(req.session.user){
        
        const user = await usuariomodel.findOne({usuario:req.session.user.usuario})
        if(user){
            user.rol = 'premium'
            req.user = user
            req.user.token = req.session.user.token
            user.save()}
        }
            else{
                let i= {message: 'Error al cargar la pagina'}
                    res.render('Errors',{i})
            }
            
            if(!req.user) res.send('No se ha encontrado el usuario')
            console.log(req.user);
                req.session.user = req.user
            
             res.cookie('cookieToken', req.session.user.token).redirect('/')

             
})



export default routersession




