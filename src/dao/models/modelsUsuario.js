import mongoose from "mongoose";


const usuarioSchema =  mongoose.Schema({
    usuario: String,
    contraseña: String,
    email: String,
    rol: {type: String, default: 'user'},
    carritoId: Number,
    lastConnection: String,
    totalConection: {type: Number, default: 0},
    imgPerfil: {type: String , default: '/img/perfil/user_icon.png'},
    
    
})

const usuariomodel = mongoose.model('usuarios', usuarioSchema)

export default usuariomodel