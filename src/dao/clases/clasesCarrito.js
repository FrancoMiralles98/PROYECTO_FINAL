import config from "../../config/config.js";
import carritomodel from "../models/modelsCarrito.js";
import productomodel from "../models/modelsProducto.js";
import productoUserModel from "../models/modelsProductoComunity.js";
import usuariomodel from "../models/modelsUsuario.js";






export default class CarritoClass {


        getCarritoById =async(id)=>{
            let params =parseInt(id)
            
            if(params == "" || params == undefined || typeof params !== 'number' ){
                
             return {value: false, message:'Error al querer encontrar el carrito, valores no validos', status: 400}
             }
            else{
                const result = await carritomodel.findOne({id:params}).lean().exec()
                if(result == null){
                    return {value:false, message: 'Error al buscar el carrito, carrito no encontrado', status: 404}
                }
                return result
            }
        }

        getCarritos = async()=>{
            let result = await carritomodel.find().lean().exec()
            if(result == undefined || null ){
                return {value: false, message:'Error al obtener el listado', status: 400}
                
            }
                return result
        }

        createCarrito = async()=>{
            const array = await carritomodel.find().lean().exec()
    
            let id = array.length > 0 ? array[array.length -1].id + 1 : 1
            let carrito = {
                    id: id
                            }
            const result = await carritomodel.create(carrito)
              return result
        }

        deleteProdCarrito = async(cid,pid)=>{
            const carritoid = cid
                const carrito = await carritomodel.find({id: carritoid})
                const productocod = pid
                const indice = carrito.findIndex(e=>e.id == carritoid)
                if(indice == -1){
                    return {value: false, message:`Error al buscar  el carrito ${cid} en la base de datos `, status: 404}
                }

                const indice2 = carrito[indice]['productos'].findIndex(e=>e.codigo === productocod)
                if(indice2 == -1){
                    return {value:false,message: `No se encontro el id del producto ${pid} en el carro ${cid}`, status:404}
                }


                if(indice2 > -1){
                    carrito[indice]['productos'].splice([indice2],1)

                carrito[indice].save()
                return {value:true, result: carrito[indice]}
                }
               
        }

        
        deleteAllProdCarrito = async(cid)=>{
            let carritoid = parseInt(cid) ? parseInt(cid) : null
            
                if(carritoid == null){
                    return {value:false, message:`error al cargar el dato, dato invalido: ${cid} `, status: 400}
                }
            
            const carrito = await carritomodel.find({id:carritoid})
            const indice = carrito.findIndex(e=>e.id === carritoid)
                
            
            if(carrito.length == 0){
                return {value:false, message:`error al cargar el carrito, carrito no encontrado: ${cid} `, status: 400}
            }
            
            if(indice > -1){
               
                carrito[indice]['productos'].splice(0,carrito[indice]['productos'].length)
                carrito[indice].save()
        
                return {result:true, value:carrito[indice]}
            }
                else{
                    return {value:false, message:`error al cargar el carrito, carrito no encontrado: ${cid} `, status: 400}
                }
            }

        agregarProdCarrito = async(i, cprod)=>{
            const usercid = i.carritoId
            
            const carrito = await carritomodel.findOne({id:usercid})
            
            const producto = await productomodel.findOne({codigo:cprod}).lean().exec() || await productoUserModel.findOne({codigo:cprod})

            const indice = carrito['productos'].findIndex(e => e.codigo == cprod)
                
           
                let stock = producto.stock

                if(indice > -1 && stock > 0 && carrito['productos'][indice].cantidad < stock){
                        carrito['productos'][indice].cantidad =   carrito['productos'][indice].cantidad +1
                        carrito['productos'][indice].precio =  producto.precio * carrito['productos'][indice].cantidad

                    carrito.save()
                    
                    return true
                }

                else{
                    
                    
                    return {value:false, message: `No se puede agregar mas productos al carro, no hay suficiente stock`}
                }
            
        }

        sacarProdCarrito = async(i,cprod)=>{
            const usercid = i.carritoId
            const carrito = await carritomodel.findOne({id:usercid})
            const producto = await productomodel.findOne({codigo:cprod}).lean().exec() || await productoUserModel.findOne({codigo:cprod})
            const indice = carrito['productos'].findIndex(e => e.codigo == cprod)

                if(indice > -1){
                        carrito['productos'][indice].cantidad =   carrito['productos'][indice].cantidad -1
                        carrito['productos'][indice].precio =   producto.precio *  carrito['productos'][indice].cantidad
                                if( carrito['productos'][indice].cantidad == 0){
                                carrito['productos'].splice(indice, 1)
                                    carrito.save()
                                return true
                            }

                    carrito.save()
                    return true
        }
            else{
                return {value:false, message:`No se pudo sacar el producto ${cprod}, del carrito ${usercid}`, status:400}
            }
    }


        renderCarrito = async(cid)=>{
            let carritoid = parseInt(cid)

            const carrito = await carritomodel.find({id:carritoid}).lean().exec()
            const user = await usuariomodel.findOne({carritoId:cid})
            const example = carrito[0]
            let Arraytotal = []
            let suma 

           

            if(carrito[0]['productos'].length !== 0){

            example.productos.forEach(e =>Arraytotal.push(e.precio))
            suma = Arraytotal.reduce((acc ,vA)=> acc + vA)
            example.total = suma
            
            if(user.rol == config.user_status2){

                example.descuento = suma > 150000 ? suma - (suma * 5 /100) : undefined
            } 
           example.length
            return example
            }

            else{ suma = 0
            example.total = suma
                console.log(example);
            return  example}
                    }

                }