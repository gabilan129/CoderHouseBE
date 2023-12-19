import multer from "multer";
import __dirname from "../utils.js";

const uploeadedFiles = multer.diskStorage({
    destination: function(req,file,callback){
        switch(file.fieldname){
            case "profiles":
                callback(null,__dirname+"/public/files/profiles")
            break
            case "products":
                callback(null,__dirname+"/public/files/products")
            break
            case "documents":
                callback(null,__dirname+"/public/files/documents")
            break
            case "identification":
                callback(null,__dirname+"/public/files/documents")
            break
            case "residence":
                callback(null,__dirname+"/public/files/documents")
            break
            case "account":
                callback(null,__dirname+"/public/files/documents")
            break
        }
    },
    filename: function(req,file,callback){
                callback(null,`${req.session.passport.user}-${file.fieldname}-${Date.now()}`)
    }
})

export const uploader = multer({uploeadedFiles},);