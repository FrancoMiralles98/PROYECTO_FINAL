 import C_errors from "../../services/error/enums.error.js"

export default (error, req,res,next)=>{
        switch(error.code){
            case C_errors.INVALID_TYPES_ERROR:
                res.send({status: 'error', error: error.name, cause: error.cause})
                    break
            case C_errors.DATABASE_ERROR:
                res.send({status:'error',error:error.name, cause: error.cause })
                break

            case C_errors.ROUTING_ERROR:
                res.send({status:'error',error: error.name})
            break
            default:
                res.send({status:error, error: 'Error no manejado'})
        }
}

export const getErrorInfo = (req,res,element)=>{
    
        if(!element.status && !element.message){
            return   res.render('Errors',{error:'Faltan datos de element', status:400})
        }
        else{
             let i = {status: element.status,
             error: element.message,
             url: req.url}
             return i}
           
}