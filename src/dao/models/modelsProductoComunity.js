import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'


const productosUserSchema = mongoose.Schema({
    marca: String,
    modelo: String,
    precio: Number,
    codigo: {type: String, unique: true},
    createUser: {type: String, unique: false},
    stock: Number
})

productosUserSchema.plugin(mongoosePaginate)
const productoUserModel = mongoose.model('productoUser', productosUserSchema)


export default productoUserModel