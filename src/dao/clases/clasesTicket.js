import ticketModel from "../models/modelsTicket.js"
import productomodel from "../models/modelsProducto.js"
import carritomodel from "../models/modelsCarrito.js"
import { deleteInfoErrorInfo ,getInfoByIdErrorInfo,getInfoErrorInfo,createInfoErrorInfo,putInfoErrorInfo,renderInfoErrorInfo,DbInfoErrorInfo} from "../../services/error/info.error.js";
import C_errors from "../../services/error/enums.error.js";
import CustomError from "../../services/error/custom.error.js";
import productoUserModel from "../models/modelsProductoComunity.js";

export default class TicketClass {

    getTickets = async()=>{
        const result = await ticketModel.find()
            return result 
    }

    getTicketById = async(id)=>{
       
        if(id == ""|| id == undefined || id== null){
            return {value:false,message:`Error al obtener el valor del id`, status:400}
            }
        
        const result = await ticketModel.findById({_id:id})
            
            return result 
    }

    getTicketByUser = async(user)=>{
        if(user == '' || undefined || null){
            return `Error al obtener el valor del user: ${user}`
            
        }
        const result = await ticketModel.findOne({usuario: user})
            if(result == null){
                return {value:false, status:404, message:`No se encontro el ticket del usuario ${user},en la DB`}
            }
            return result
    }


    generateRandomString = (num) => {
       const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       let result1= ' ';
       const charactersLength = characters.length;
       for ( let i = 0; i < num; i++ ) {
           result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
   
       return result1;
   }

    createTicket = async(datacarrito, user)=>{
        if(!datacarrito || !user){
            return {value:false, message:`Error al crear el ticket, No se encuentran los datos solicitados`, status:400}
        }

        const codigos = []
        for (const product of datacarrito['productos']) {
            codigos.push(product.codigo)
        }
        
        const ticket= {
            codigo: this.generateRandomString(5),
            fecha: new Date().toLocaleString(),
            monto: datacarrito.descuento? datacarrito.descuento : datacarrito.total,
            productos:codigos,
            usuario: user.email

        }

            const result = await ticketModel.create(ticket)

    
      for (const product of datacarrito['productos']) {
        
       const valor = await productomodel.findOne({codigo: product.codigo}) || await productoUserModel.findOne({codigo:product.codigo})
       
            if(valor){
                valor.stock = valor.stock - product.cantidad
            }
         valor.save() 
        
      }

      const carrito = await carritomodel.findOne({id:datacarrito.id})
        carrito['productos'].splice(0,carrito['productos'].length)
        carrito.save()
    
        return result  

    }



}