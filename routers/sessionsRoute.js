import { Router } from "express";
import userDB from "../DAO/models/userModel.js";
import {failRegister, renderUser, githubLogin, githubCall, logout, userSignup, loginUser} from '../Controllers/sessionsRouteController.js'
import { authMiddleware } from "../auth.js";
import { renderSignup } from "../Controllers/singupRouteController.js";
import changeRol from "../Controllers/userRoleControllers.js";
import {  googleCallback } from "../Controllers/googleAuthController.js";
import passport from "passport";

const sessionsRouter = Router();
const user = new userDB();

//Registro de Nuevo Usuario
sessionsRouter.post("/signup",  userSignup);


sessionsRouter.get("/signup",renderSignup);

sessionsRouter.get('/failregister', failRegister)

// Login de usuarios.
sessionsRouter.post('/login', loginUser)

sessionsRouter.get("/current", authMiddleware, renderUser) //muestra ruta current


//Login con Github

sessionsRouter.get('/github', githubLogin)

// Login  exitoso.
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), githubCall);


sessionsRouter.get('/logout', logout)


//Cambio de rol de Usuario

sessionsRouter.put('/premium/:id', changeRol);

// Ruta para iniciar sesión con Google
sessionsRouter.get("/auth/google", (req, res) => {
  const redirectUrl = `/auth/google/callback${req.query.redirect ? `?redirect=${req.query.redirect}` : ''}`;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}${req.query.redirect ? `?redirect=${req.query.redirect}` : ''}&response_type=code&scope=profile%20email`;

  res.redirect(googleAuthUrl);
});

// Callback de Google para redireccionar después de la autenticación
sessionsRouter.get("/auth/google/callback", googleCallback);
  
export default sessionsRouter;
