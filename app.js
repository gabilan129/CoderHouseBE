import __dirname from "./utils.js";
import chatRoute from "./routers/chatRouter.js";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import messageRoute from "./routers/messageRouter.js";
import { messageModel } from "./DAO/models/chatModel.js";
import fs from "fs";
import productsRouteDB from "./routers/productsRouteDB.js"
import cartsRouteDB from "./routers/cartsRouteDB.js"
import loginRouter from "./routers/loginRoute.js"
import sessionsRouter from "./routers/sessionsRoute.js";
import currentUser from "./routers/sessionsRoute.js"
import mongoose from "mongoose";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import * as dotenv from "dotenv";
import forgotRoutes from "./routers/forgotRoutes.js"
import passport from "passport";
import initializePassport from "./config/passportConfig.js";
import nodemailer from "nodemailer"
import  Twilio from "twilio";
import errorHandler from "./mistakes/errorInfo.js";
import loggerTestingRoute from "./routers/loggerTest.js";
import Mockrouter from "./routers/mockingProducts.js"
import _dirname from "./utils.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress  from "swagger-ui-express";
import adminRouter from "./routers/adminRoute.js";
import ticketRouter from "./routers/ticketRoute.js";
import Thnxrouter from "./routers/thankyouRoute.js";
import googleAuthRoute from "./routers/sessionsRoute.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080 
const swaggerOptions = {
  definition:{
    openapi:'3.0.1',
    info:{
      title:"Documentacion de Backend de un ECommerce",
      description:"API que documenta la funcion de los endpoints del proyecto"
    }
  },
    apis:[`${__dirname}/Swagger/Docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)

const messages = [];



// Configuración de CORS
const corsOptions = {
  origin: "https://backendproject-production-c244.up.railway.app",
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'https://backendproject-production-c244.up.railway.app');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, 	X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-	Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, 	DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});



//Consts Mongo
const USER_MONGO=process.env.USER_MONGO
const PASS_MONGO=process.env.PASS_MONGO
const DB_MONGO=process.env.DB_MONGO

// Configuracion Express.
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/apidocs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs) )


app.post("/socketMessage", (req, res) => {
  const { message } = req.body;
  socketServer.emit("message", message);

  res.send("ok");
});


app.use(session({
  store: MongoStore.create({
      mongoUrl:`mongodb+srv://${USER_MONGO}:${PASS_MONGO}@codercluster.vdti2wf.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority`,
      mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
      ttl:3600
  }),
  secret:'coderProject',
  resave:true,
  saveUninitialized:true
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());




// Middleware para los datos de sesión.
app.use((req, res, next)=>{     
  res.locals.session = req.session;
  next();
})



const httpServer = app.listen(PORT,'0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);
});

/*const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

const socketServer = new Server(httpServer);

const readJson = async () => {
  const data = await fs.readFileSync("./database/productos.JSON", "utf-8");
  const products = await JSON.parse(data);
  return products;
};

const writeJson = async (data) => {
  const dataToWrite = await JSON.stringify(data, null, "\t");
  await fs.writeFileSync("./database/productos.JSON", dataToWrite);
};

const socketProductos = socketServer.of("/");

socketProductos.on("connection", (socket) => {
  console.log("nuevo user conectado");

  socket.on("message", async (data) => {
    let productos = await readJson();

    productos.push({ title: data });

    await writeJson(productos);

    socketProductos.emit("paragraph", productos); //productos lee el archivo
  });
});

const socketChat = socketServer.of("/chat");

socketChat.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!");
  socket.on("new-user", (data) => {
    socket.user = data.user;
    socket.id = data.id;
    socketChat.emit("new-user-connected", {
      user: socket.user,
      id: socket.id,
    });
  });
  socket.on("message", (data) => {
    messages.push(data);
    socketChat.emit("messageLogs", messages);
    messageModel.create(data);
  });
});


const environment = async () => {
  try {
    await mongoose.connect (
    `mongodb+srv://${USER_MONGO}:${PASS_MONGO}@codercluster.vdti2wf.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority`,

    );
    console.log("Conectado a la base de datos");

  } catch (error) {
    console.log(`Error al conectar a a la base de datos: ${error}`);
  }
};


const isValidStartDB = () => {
  if (USER_MONGO&& PASS_MONGO) return true;
  else return false;
};



// Rutas.

app.use("/chat", chatRoute);
app.use("/messages", messageRoute);
app.use("/products", productsRouteDB)
app.use("/api/carts", cartsRouteDB)
app.use("/login", loginRouter )
app.use("/", sessionsRouter)
app.use('/api/sessions/', sessionsRouter);
app.use('/logout', sessionsRouter)
app.use('/', forgotRoutes)
app.use ("/" , currentUser)
app.use("/", sessionsRouter)
app.use (errorHandler)
app.use("/loggerTest", loggerTestingRoute)
app.use("/mockingProducts", Mockrouter)
app.use("/", adminRouter)
app.use("/ticket", ticketRouter)
app.use("/thankyou", Thnxrouter)
app.use("/", ticketRouter);
app.use("/login", googleAuthRoute);
app.use('', loginRouter)


//inicializar el envio de mail

const transporter = nodemailer.createTransport({
  service: "gmail",
  port:587,
  auth:{
    user:"l.katz92@gmail.com",
    pass:" wgtmyxoujarkujym"
  }

})

app.get('/mail', async (req,res) =>{
  let result = await transporter.sendMail({
    from:'CoderHouse 37570 <coderhouse37570@gmail.com',
    to:'l.katz92@gmail.com',
    subject:'Prueba de Envio de Correo',
    text:'Este es un mail de prueba',
    html: '<h1>Probando probando 1 2 3 probando</h1>'

  })
  res.send('Correo Enviado')
})


const TwilioAccountSid = 'ACf73ce9f782faaf542ec08542f770fe9c';
const TwilioAuthToken= "48fe3f25913ab5941925a9cbe265a170";
const TwilioPhoneNumber="+15855523701"

const client = Twilio (
  TwilioAccountSid,
  TwilioAuthToken,
  TwilioPhoneNumber
)

app.get('/sms', async (req,res) =>{
  let result = await client.messages.create({
    from:TwilioPhoneNumber,
    to:"+541122876495",
    body: "Mensaje de Prueba Backend 37570"
})

res.send ("SMS Enviado")
})

app.post('/customSMS', async (req,res) =>{
  let {name, product} = req.body
  let result = await client.messages.create({
    from:TwilioPhoneNumber,
    to:"+541122876495",
    body: ` Hola ${name}. Gracias por tu compra. Tu producto es ${product}`
})

res.send ("SMS Enviado")
})

console.log("isValidStartDB", isValidStartDB());
isValidStartDB() && environment();

export default app