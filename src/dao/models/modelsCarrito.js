import mongoose from "mongoose";

const carritoSchema = mongoose.Schema({
    id:{
        type: Number,
        unique: true
    },
    productos: [
        {codigo: String,
         cantidad: Number,
         precio: Number}]

})

const carritomodel = mongoose.model('carrito',carritoSchema)

export default carritomodel