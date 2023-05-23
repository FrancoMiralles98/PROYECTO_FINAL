import { Router } from "express"
import { createTicket,getTicketById,getTickets,getTicketByUser } from "../dao/controller/controllerTicket.js"
import {auth_api,auth_carrito} from '../middlewares/auth/auth.middleware.js'


const routerTicket = Router()

routerTicket.get('/api',auth_api, getTickets)
routerTicket.get('/api/:tid',auth_api,getTicketById)
routerTicket.get('/api/user/:uid',auth_api, getTicketByUser)
routerTicket.get('/compra/:cid',auth_carrito, createTicket)



export default routerTicket