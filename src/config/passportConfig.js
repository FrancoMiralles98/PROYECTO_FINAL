import passport from "passport";
import local from 'passport-local'
import { createHash , generateToken, isValidPassword } from "../util.js";
import GoogleStrategy from 'passport-google-oauth2'
import jwt from 'passport-jwt'
import carritomodel from "../dao/models/modelsCarrito.js";
import config from "./config.js";
import usuariomodel from "../dao/models/modelsUsuario.js";
import { generadorid } from "../util.js";

const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const coockieExtractor = req =>{
    
    const token = (req && req.cookies)? req.cookies['cookieToken']: null
    
    return token
}


const initPassport = ()=>{


        passport.use('jwt', new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([coockieExtractor]),
                secretOrKey: config.private_key
                
            },
            async(jwt_payload, done)=>{
                try {
                        
                    return done(null, jwt_payload.user)
                } catch (error) {
                        done(error)
                }
            }
        ))


        passport.use('google', new GoogleStrategy(
            {
                clientID: config.google_clientID,
                clientSecret: config.google_clientSecret,
                callbackURL: 'http://localhost:8080/session/google',
                passReqToCallback: true
            },
            async(request,accessToken,refreshToken,profile,done)=>{
                
                try {
                    const user = await usuariomodel.find({email:profile.email})
                    const valid= user[0]
                    
                    if(valid !== undefined){
                        console.log("Usuario  ya existe");
                        return done(null,user)
                    }
                    const newUser={
                        usuario: profile.displayName,
                        email: profile.email,
                        password: '',
                        rol: config.user_status1,
                        carritoId: generadorid()

                    }
                    const result = await usuariomodel.create(newUser)
                    return done(null,result)
                } catch (error) {
                    return done('error', error)
                }
            }
        ))



        passport.use('register', new localStrategy(
        {
             passReqToCallback: true, usernameField: 'email'
        },
        async(req,username,password,done)=>{
            
            const {usuario,email,rol}= req.body
            
            try {
                const userEmail = await usuariomodel.findOne({email:username})
                const userName = await usuariomodel.findOne({usuario:usuario})
                if(userEmail || userName){
                    console.log('Usuario ya existe');
                    return done(null,false)
                }
            
                    const NewUser ={
                        usuario,
                        email,
                        contraseña: createHash(password),
                        carritoId: await generadorid()
                    }
                    
                    
                  const  result = await usuariomodel.create(NewUser)
                    return done(null,result)

                
            } catch (error) {
                return done('error', error)
            }
        }
        ))

        passport.use('login', new localStrategy(
            {usernameField: 'email'},
            async(username,password,done)=>{
                
                try {
                    const user = await usuariomodel.find({email:username}).lean().exec()
                    const valid = user[0]
                    if(valid == undefined){
                        console.log("usuario no encontrado")
                    return done(null,false)
                    }
                         if(isValidPassword(valid,password)){
                            valid.token = generateToken(valid)
                            
                             return done(null,user[0])
                    }
                                else{
                                 console.log("no se encontro el usuario");
                                 return done(null,false)
                    }
                } catch (error) {
                   return done(error)
                }
            }
        )
        )


passport.serializeUser((user,done)=>{
    

   
    done(null,user._id)
})

passport.deserializeUser(async(id,done)=>{
    const user = await usuariomodel.findById(id)
    done(null,user)
})




}

export default initPassport



