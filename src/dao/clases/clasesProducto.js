
import productomodel from "../models/modelsProducto.js"
import productoUserModel from "../models/modelsProductoComunity.js"
import config from "../../config/config.js"
import carritomodel from "../models/modelsCarrito.js"

export default class ProductoClass {

    findProductByCode = async(code)=>{
        const filter = await productoUserModel.findOne({codigo:code}) || await productomodel.findOne({codigo:code})
            if(filter == null){
                return {value:false, message:`Error al encontrar el producto codigo ${code}, producto no encontrado`, status: 404}
            }
        if(filter.createUser){
        let result = {
            marca: filter.marca,
            modelo: filter.modelo,
            precio: filter.precio,
            codigo: filter.codigo,
            stock: filter.stock,
            createUser: filter.createUser}

        return result
    }
        else{
            let result = {
                marca: filter.marca,
                modelo: filter.modelo,
                precio: filter.precio,
                codigo: filter.codigo,
                stock: filter.stock}

                return result
        }
    }



    createProduct = async(body)=>{
        let number =  body.length? body.length : 1
        if(!body.marca && !body.modelo && !body.precio && !body.stock && !body.codigo){
            return {value:false, message:"Error al crear el producto, datos erroneos", status:400}
        }
    if(number == 1){
        const result = await productomodel.create(body)
        
        return result 
    }if(number > 1){
        const result = await productomodel.insertMany(body)
        
    return result
    }
    if(number == 0){
        return {value:false, message:"Error al crear el producto, datos erroneos", status:400}
    }

}

   
    
    renderProduct = async(req)=>{
        let i = {}
        if(req.session.user){

           let d = req.session.user
          
           i = d
           i.u = i.rol == 'user'? true : false
             
        }
        
       
         
    
        const limit = req.query?.limit || 10
        const page = req.query?.page || 1
        const filter = req.query?.query || req.body?.query || ""
        const sort = req.query?.sort || ""
        
    
        let options = {limit,page,lean:true}
        if(sort) options = {limit,page,lean:true,sort:{"precio":sort}}
        const search = {}
    
        if(filter){
            search["$or"] =[
                {modelo: {$regex: filter}}, 
                {marca: {$regex: filter}},
                {codigo: {$regex: filter}}
            ]
        }
            
        const result = await productomodel.paginate(search,options)

            result.userOn = req.session.user? true : false
            result.isValid = true
            result.nextLink = result.hasNextPage && sort>= -1?  `/?page=${result.nextPage}&sort=${sort}` : `/?page=${result.nextPage}`
            result.prevLink = result.hasPrevPage && sort>= -1? `/?page=${result.prevPage}&sort=${sort}` : `/?page=${result.prevPage}`
            
            result.asc = filter!== ""? `/?page=${result.page}&limit=${result.limit}&sort=1&query=${filter}` :`/?page=${result.page}&limit=${result.limit}&sort=1`  
            result.desc = filter!== ""? `/?page=${result.page}&limit=${result.limit}&sort=-1&query=${filter}`: `/?page=${result.page}&limit=${result.limit}&sort=-1`  
    
        
    
     
    return [result, i]


}

    renderComunityProduct = async(req)=>{
        const page = req.query?.page || 1
        const limit = req.query?.limit || 10
        const filter = req.query?.query || req.body?.query || ""
        const sort = req.query?.sort || ""
        const search = {}
        
        
        let options = {page,limit,lean:true}
        if(sort) options = {page,limit,lean:true, sort:{"precio":sort}}

        if(filter){
            search["$or"] = [{createUser: {$regex: filter}},
                             {marca: {$regex: filter}}]
        }
        

        const productsList = await productoUserModel.paginate(search,options)

         productsList.userOn = req.session.user? true : false
            productsList.isValid = true
            productsList.nextLink = productsList.hasNextPage && sort>= -1?  `/?page=${productsList.nextPage}&sort=${sort}` : `/?page=${productsList.nextPage}`
            productsList.prevLink = productsList.hasPrevPage && sort>= -1? `/?page=${productsList.prevPage}&sort=${sort}` : `/?page=${productsList.prevPage}`
            
            productsList.asc = filter!== ""? `/?page=${productsList.page}&limit=${productsList.limit}&sort=1&query=${filter}` :`/?page=${productsList.page}&limit=${productsList.limit}&sort=1`  
            productsList.desc = filter!== ""? `/?page=${productsList.page}&limit=${productsList.limit}&sort=-1&query=${filter}`: `/?page=${productsList.page}&limit=${productsList.limit}&sort=-1`  
        

       for (const object of productsList['docs']) {
            let indice = productsList['docs'].findIndex(e=> {return e.stock == 0})
            
                if(indice > -1){
                    productsList['docs'].splice(indice, 1)
                }
       }
       
        return productsList
    }
  
    generateRandomString = (num) => {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1= '';
        const charactersLength = characters.length;
        for ( let i = 0; i < num; i++ ) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result1;
    }

    createComunityProduct = async(req)=>{
            if(req.body.marca == "" || req.body.modelo  == "" || req.body.precio == "" || req.body.stock == "" || req.body.precio <= 0 || req.body.stock <= 0 ){
                return {result: false, message: 'Error al cargar el producto, compruebe todos los campos'}
            }
            const filter = await productoUserModel.findOne({marca: req.body.marca, modelo: req.body.modelo})
                if(filter){
                    return {result: false, message: 'Error al cagar el producto, producto ya existente'}
                }
        const element = {
            marca: req.body.marca,
            modelo: req.body.modelo,
            precio: parseInt(req.body.precio),
            codigo: this.generateRandomString(5),
            createUser: req.session.user.usuario,
            stock: parseInt(req.body.stock)
        }
        
        const create = await productoUserModel.create(element)

        return create
    }

    personalProduct = async(req)=>{
        const result = await productoUserModel.paginate({createUser:req.session.user.usuario})
        const list = result.docs.map(obj =>{
            return {
                marca: obj.marca,
                modelo: obj.modelo,
                precio: obj.precio,
                codigo: obj.codigo,
                createUser: obj.createUser,
                stock: obj.stock
            }
        })
        
            return list
    }
  
    

    personalProductDelete = async(req,value)=>{
        const productUser = await productoUserModel.findOne({codigo:value})

        if(req.session.user.usuario == productUser.createUser || req.session.user.rol == config.developer){
            const result = await productoUserModel.deleteOne({codigo:value})
        return true
        }
        
        else{return {status: false, message:`No se pudo eliminar el producto seleccionado: ${value}`}
        }}


    productEdit = async(values)=>{
        let product = await productoUserModel.findOne({codigo:values.codigo})
            product.marca = values.marca !== ''? values.marca : product.marca
            product.modelo = values.modelo !== ''? values.modelo : product.modelo
            product.precio = values.precio !== ''? values.precio : product.precio
            if(product.precio < 1){
               return false
                    
            }
        product.save()
    }


    agregarProducto = async(codigo,req)=>{
        let filtro = await productoUserModel.findOne({codigo:codigo}) ||  await productomodel.findOne({codigo:codigo})
        let carrito = await carritomodel.findOne({id:req.session.user.carritoId})
        
        let message = '' 

        if(filtro.stock == 0){
            
            return {message:'No se puede agregar mas, insuficiente stock!'}
        }
        
        let producto = {
            codigo: filtro.codigo,
            cantidad: 1,
            precio: filtro.precio,
        }
        
        if(carrito['productos'].length == 0 && filtro.stock > 0){
            carrito['productos'].push(producto)
            carrito.save()
        
            return {message:'producto por primera vez agregado'}
        }

        if(carrito['productos'].length > 0 && filtro.stock > 0){
            let search = carrito['productos'].findIndex(e => e.codigo === filtro.codigo)
               
                if(search == -1){
                    carrito['productos'].push(producto)
                    carrito.save()
                    return {message:'producto primera vez  agregado con cantidad'};
                }
                if(search > -1 && carrito['productos'][search].cantidad < filtro.stock){
                    carrito['productos'][search].cantidad = carrito['productos'][search].cantidad +1
                    carrito['productos'][search].precio = carrito['productos'][search].precio * carrito['productos'][search].cantidad
                    carrito.save()
                return {message:'producto sumado'};
                }
        if(filtro.stock == 0 || carrito['productos'][search].cantidad >= filtro.stock){
            return {message:'No se pueden agreagar mas productos, stock insuficiente'};
        }
        }

    }

    }

    






    