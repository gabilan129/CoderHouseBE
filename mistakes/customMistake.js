export default class CustomMistake{
    static createError({name = "Error",cause,message,code=1}){
        const error = new Error(message,{cause})
        error.code = code;
        error.name = name;
        throw error
    }
}