import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productoSchema = mongoose.Schema({
    marca: String,
    modelo: String,
    precio: Number,
    stock: Number,
    codigo:{ 
        type:String,
        unique: true}
})




productoSchema.plugin(mongoosePaginate)
const productomodel = mongoose.model('productos', productoSchema)

export default productomodel