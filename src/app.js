import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './util.js'
import mongoose from 'mongoose'
import routerProd from './routers/routerProducto.js'
import routerCarrito from './routers/routerCarrito.js'
import { Server } from 'socket.io'
import carritomodel from './dao/models/modelsCarrito.js'
import productomodel from './dao/models/modelsProducto.js'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import routersession from './routers/routerSession.js'
import initPassport from './config/passportConfig.js'
import passport from 'passport'
import config from '../src/config/config.js'
import routerTicket from './routers/routerTicket.js'
import compression from 'express-compression'
import errorMiddleware from './middlewares/errors/error.middleware.js'
import { addLoger } from './util.js'
import routerUsuario from './routers/routerUsuario.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const app = express()

app.use(compression({
    brotli: {enabled: true, zlib: {}}
}))

app.use(addLoger)

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
/* app.use('/css', express.static(__dirname + '/css'))
app.use('/img/perfil', express.static(__dirname + '/img/perfil')) */





const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title: 'Documentacion',
            descripcion: 'Descripcion'
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        dbName: 'sessions',
        mongoOptions:{
                useNewUrlParser: true,
                useUnifiedTopology: true
        },
        ttl: 300
    }),
    secret: `${config.mongo_session_secret}`,
    resave: true,
    saveUninitialized: true
}))


initPassport()
app.use(passport.initialize())
app.use(passport.session())



mongoose.set('strictQuery', true)
mongoose.connect(config.mongo_url,{dbName:'Ecommerce'}, error =>{
    if(error){
        console.log("Hubo un problema al conectar el servidor " + error)
        process.exit() }
    
    console.log("Base de datos conectada ")

   const http=  app.listen(config.port,()=>{console.log("Servidor corriendo")})
    const io = new Server(http)

    app.use('/', routerProd)
    
    app.use('/carrito', routerCarrito)

    app.use('/session',routersession)

    app.use('/ticket',routerTicket )
    
    app.use('/usuario',routerUsuario)


    //app.use(errorMiddleware)
    
})