import userModel from "../DAO/models/userModel.js"
import { uploader } from "../Middlewares/uploadFiles.js"

export const uploadDocuments = async (req,res)=>{
    const userId = req.session.user
    const profiles = req.files?.profiles? req.files.profiles:[]
    const documents = req.files?.documents? req.files.documents:[]
    const products = req.files?.products? req.files.products:[]
    const identification = req.files?.identification? req.files.identification:[]
    const account = req.files?.account? req.files.account:[]
    const residence = req.files?.residence? req.files?.residence:[]

    let filesArray = [...profiles,...products,...documents,...identification,...account,...residence]

    let user = await userModel.findById(userId);

if(filesArray.length>0){
    console.log(req.files)
    filesArray.forEach(file => {
        file={
            name: file.fieldname,
            reference: file.path
        }
        user.documents.push(file)
    });
    user.save()
    res.status(200).json({status:"success", message: "Documentos subidos exitosamente"})
}
else{
    res.status(400).json({status:"error", message: "No hay documentos válidos para subir"})
}
}


export default uploadDocuments