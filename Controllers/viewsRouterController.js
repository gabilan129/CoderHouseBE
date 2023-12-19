import express from 'express';
const viewsRouter = express.Router();


export const realTimeProducts =  async (req, res)=>{

    res.render('realTimeProducts', {});
}

export const getProducts = async (req, res)=>{

    res.render('login', {});
}