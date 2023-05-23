import mongoose from "mongoose";
import UsuarioClass from "../src/dao/clases/clasesUsuario.js";
import assert from 'assert'
import config from "../src/config/config.js";

mongoose.set('strictQuery',true)
mongoose.connect(config.mongo_url,{dbName:'test'})

const userService = new UsuarioClass()

describe('testing "clasesUsuario.js" del dao', ()=>{
    
    
    beforeEach(function(){
        this.timeout(1000)
    })

    it('creando usuario en la base de datos', async()=>{
        let user = {
            usuario: 'German',
            contraseña:'contraseñaHasheada',
            email: 'German@gmail.com',
            rol: 'user',
            carritoId: 1,
            lastConnection: 'fecha'
        }
    })



    
    it('el dao debe obtener los usuarios en una array', async()=>{

        const result = await userService.getUsuarios('/api/')
        console.log(result);
       assert.strictEqual(Array.isArray(result),true)
        
    })

})