import { Router } from "express";
import userDB from "../DAO/models/userModel.js";
import passport from "passport";
import userModel from "../DAO/models/userModel.js";

const sessionsRouter = Router();
const user = new userDB();

export const userSignup = async (req, res, next) => {
    passport.authenticate('signup', { failureRedirect: '/failregister' }, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(400).json({ message: 'Failed to create user' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Usuario Creado', data: user });
      });
    })(req, res, next);
  };
  


export const failRegister = async (req, res)=>{ 
    console.log('Ha habido un error. Por favor intente nuevamente')
    res.render ('failRegister')
};

export const loginUser = async (req, res)=>{ 
  passport.authenticate('login', {failureRedirect: 'faillogin'}) 


    // Si no se encuentra al  usuario...
    if(user.length === 0){
    return res.redirect("/signup");
}

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }

    res.redirect('/current');

     // Se borra la password.
    delete user.password;
    req.session.user = user[0];

    res.redirect('/current');
};

export const renderUser =  async (req,res)=>{
    if (await req.session?.user){
        const userData = await userModel.findOne({
            email: req.session.user.email
        });
        res.render("user")

    }
        
};

export const githubLogin = (req, res)=>{} 

export const githubCall = (req, res) => {
  req.login(req.user, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al iniciar sesión con GitHub' });
    }
    req.session.user = req.user;
    res.redirect('/products');
  });
};


export const logout = (req, res)=>{
    req.session.destroy(err=>{
        if(err) res.send({status:'error', message:'Error al cerrar la sesión: '+err});

        res.redirect('/login');
    });
};