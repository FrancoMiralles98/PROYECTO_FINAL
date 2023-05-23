import mongoose from "mongoose"

const Schema =  mongoose.Schema({
    codigo: String,
    fecha: String,
    productos: [],
    monto: Number,
    usuario: String



})


const ticketModel = mongoose.model('Ticket',Schema)

export default ticketModel