import userModel from "../models/userModel.js";

export default class UserManager{
    constructor(){}

    get = async()=>{
        try{
            return await userModel.find();
        }
        catch (err) {
            throw err;
        }
    }

    getUserById = async(userId)=>{
        try {
            const selectedUser = await userModel.findById(userId)
            return selectedUser
        }
        catch (err) {
            throw err;
        }
    }
    
    createUser = async(user)=>{
        try{
            const newUser = new userModel(user);
            await newUser.save();
            return newUser;
        }
        catch (err) {
            throw err;
        }   
    } 
    
    deleteUser = async(userId)=>{
        try {
            const result = await userModel.findByIdAndDelete(cartId);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    updateUserProperty = async(id,property)=>{
        try {
            let result = await userModel.findByIdAndUpdate({_id:id},property)
            return result
        }
        catch (err) {
            throw err;
        }
    }
}