
import TicketClass from "../clases/clasesTicket.js"
import CarritoClass from "../clases/clasesCarrito.js"
import config from "../../config/config.js"
import { getErrorInfo } from "../../middlewares/errors/error.middleware.js"

const carritoService = new CarritoClass()
const ticketService = new TicketClass()

export const getTickets = async(req,res)=>{
    try {
        const result = await ticketService.getTickets()
        return res.send({result: result})
        
    } catch (error) {
        req.logger.error(`Error al obtener los tickets en la BD , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
            let i = {status: 500, error: error , url: req.url}
            res.render('Errors',{i})
    }
}

export const getTicketById = async(req,res)=>{
    const id = req.params.tid
    try {
        const result = await ticketService.getTicketById(id)
            if(result.value == false){
                let i = {status:result.vale, error:result.message, url:req.url}
                return res.render('Errors', {i})
            }
            return res.json({result:result})   
        
    } catch (error) {
        req.logger.error(`Error al obtener el ticket "${id}" el la DB , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
        let i = {status: 500, error: error , url: req.url}
     return   res.render('Errors',{i})
    }
}

export const getTicketByUser = async(req,res)=>{
    const user = req.params.uid
        try {
            const result = await ticketService.getTicketByUser(user)
            if(result.value == false){
                
                let i = getErrorInfo(req,res,result)
                    return res.render('Errors', {i})
            }
            return res.send({result: result})   
            
        } catch (error) {
            req.logger.error(`Error al obtener el ticket del usuario "${user}" el la DB , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
        let i = {status: 500, error: error , url: req.url}
     return   res.render('Errors',{i})
        }
}

export const createTicket =  async(req,res)=>{
        if(req.session.user.rol == config.developer){
            let i = {message:'un admin no puede comprar en la pagina!'}
            return res.render('Errors',{i})
        }
    const carritoid = req.params.cid
    const user = req.session.user

    try {
        const carrito = await carritoService.renderCarrito(carritoid)
        if(carrito['productos'].length == 0){
            let i={message:'Error al finalizar la compra'}
          return  res.render('Errors',{i})
        }
       const result = await ticketService.createTicket(carrito, user)
        if(result.value == false){
            let i = getErrorInfo(req,res,result)
          return  res.render('Errors',{i})
        }
        req.logger.info('Ticket generado')
       return res.render('ticket')

    } catch (error) {
        req.logger.error(`Error al crear el ticket del usuario "${user}", carrito${carritoid} , en ${req.method} ${req.url}, ${new Date().toLocaleString()}`)
        let i = {status: 500, error: error , url: req.url}
     return   res.render('Errors',{i})
    }
}

