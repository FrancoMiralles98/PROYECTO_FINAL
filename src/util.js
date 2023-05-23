import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from './config/config.js'
import dotenv from 'dotenv'
import winston from 'winston'
import carritomodel from './dao/models/modelsCarrito.js'

const optionsLevels = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3
    }
}

const logger = winston.createLogger({
    levels: optionsLevels.levels,
    transports:[
        new winston.transports.Console({
            level:'info',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename:'./error.log',
            level:'warning',
            format:winston.format.simple()
        })

    ]
})

export const addLoger = (req,res,next)=>{
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

dotenv.config()

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (user,password)=>{
    
    return bcrypt.compareSync(password,user.contraseña)
}

const a = fileURLToPath(import.meta.url)

const __dirname = dirname(a)

export default __dirname



const PRIVATE_KEY = config.private_key

export const generateToken = (user) =>{
    const token = jwt.sign({user}, PRIVATE_KEY)
    return token 
}

export const authToken = (req,res,next)=>{
    const authToken = req.cookies.cookieToken
    if(authToken){
        return res.status(401).send({error: 'Not auth'})
    }

    
    jwt.verify(authToken,PRIVATE_KEY,(error,credentials)=>{
        if(error) return res.status(403).send({error: 'Not auth'})
        req.user = credentials.user
    })
}


export const  generadorid = async()=>{

    const array = await carritomodel.find().lean().exec()
    
    let id = array.length > 0 ? array[array.length -1].id + 1 : 1
    await carritomodel.create({id: id})
    return id
}

 