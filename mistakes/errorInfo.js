import Errores from "../mistakes/kindOfError.js";

const errorHandler = async  (error,req,res,next)=>{
    switch(error.code){
        case Errores.TIPO_INVALIDO:
            res.send({status: "error", error: error.name})
    break;
    default:
    res.send({status: "error",error: "unhandled error"});
    }  
}

export default errorHandler
