import userModel from "../DAO/models/userModel.js"


export const changeRol = async (req, res) => {
    try {
        const user = req.session.user;
        const userId = user._id;

        // Comprobación de la existencia del usuario
        const response = await userModel.findById(userId);
        if (!response) {
            res.status(404).json({ status: "error", message: "El usuario no está registrado" });
            return;
        }

        // Comprobación de rol del usuario
        if (response.rol === "Admin") {
            res.status(400).json({ status: "error", message: "El usuario tiene el rol de Administrador, por lo tanto no es posible realizar el cambio de rol" });
            return;
        }

        // Verifica si el usuario ya tiene cargada la documentación requerida
        const identificationDoc = response.documents.some((file) => file.name === "identification");
        const accountDoc = response.documents.some((file) => file.name === "account");
        const residenceDoc = response.documents.some((file) => file.name === "residence");

        // Valida la existencia de la documentación requerida
        if (identificationDoc && accountDoc && residenceDoc) {
            // Acciones para realizar el cambio de rol del usuario
            if (response.rol === "Premium") {
                await userModel.findByIdAndUpdate(userId, { rol: "Usuario" });
                let result = await userModel.findById(userId);
                console.log(result);
                res.status(200).json({ status: "success", payload: result });
            } else {
                await userModel.findByIdAndUpdate(userId, { rol: "Premium" });
                let result = await userModel.findById(userId);
                console.log(result);
                res.status(200).json({ status: "success", payload: result });
            }
        } else {
            // Envia un mensaje indicando que falta cargar documentación
            res.status(400).json({ status: "error", message: "Falta cargar documentación" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
};



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