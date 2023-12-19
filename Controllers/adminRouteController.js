import userModel from "../DAO/models/userModel.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:"l.katz92@gmail.com",
    pass:" wgtmyxoujarkujym"
  },
});

// Función para enviar correo electrónico
const sendEmail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: "adminCoder@coder.com",
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo electrónico enviado a ${email}`);
  } catch (error) {
    console.error(`Error al enviar el correo electrónico a ${email}: ${error}`);
  }
};

export const paginatedUsers = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || 1;
    let query;
    let prevURL;
    let nextURL;
  
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  
    try {
      const listUsers = await userModel.paginate({}, {
        page: page || 1,
        limit: limit,
        sort: { first_name: sort },
        lean: true
      });
  
      query = {};
  
      const response = listUsers.docs;
      const totalPages = listUsers.totalPages;
      const prevPage = listUsers.prevPage;
      const nextPage = listUsers.nextPage;
      const currentPage = listUsers.page;
      const hasPrevPage = listUsers.hasPrevPage;
      const hasNextPage = listUsers.hasNextPage;
  
      if (hasPrevPage) {
        prevURL = url.replace(`page=${currentPage}`, `page=${prevPage}`);
      }
  
      if (hasNextPage) {
        nextURL = url.replace(`page=${currentPage}`, `page=${nextPage}`);
      }
  
      res.render("listOfUsers", {
        users: response,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        currentPage: currentPage,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevURL,
        nextLink: nextURL
      });
    } catch (err) {
      console.error('Error al obtener los usuarios', err);
      res.status(500).send('Error al obtener los usuarios');
    }
  };
  

  export const deleteUsers = async (req, res) => {
    try {
      // Calcula la fecha limite 2 meses atras
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      // Busca los usuarios inactivos
      const inactiveUsers = await userModel.find({
        email: { $exists: true, $ne: null },
        last_connection: { $lt: twoMinutesAgo },
      });
  
      // Elimina los usuarios inactivos
      const deleteResult = await userModel.deleteMany({
        email: { $exists: true, $ne: null },
        last_connection: { $lt: twoMinutesAgo },
      });
  
      // Envia correo a los usuarios eliminados notificando la eliminacion de la cuenta
      const emails = inactiveUsers.map((user) => user.email);
      const emailSubject = "Eliminación de cuenta por inactividad";
      const emailMessage = "Tu cuenta ha sido eliminada por inactividad.";
  
      for (const email of emails) {
        await sendEmail(email, emailSubject, emailMessage);
      }
  
      res
        .status(200)
        .json({ status: "success", message: "Usuarios eliminados correctamente" });
      console.log("Usuarios eliminados correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  };

export const adminChangesRol = async (req, res) => {
    try {
      const userId = req.body.userId || req.params.userId; 
  
      // Comprobación de la existencia del usuario
      const response = await userModel.findById(userId);
      if (!response) {
        return res.status(404).json({ status: "error", message: "El usuario no está registrado" });
      }
  
      // Comprobación de rol del usuario
      if (response.rol === "Admin") {
        return res.status(400).json({
          status: "error",
          message:
            "El usuario tiene el rol de Administrador, por lo tanto no es posible realizar el cambio de rol",
        });
      }
  
      // Realiza el cambio de rol del usuario
      let result;
      if (response.rol === "Premium") {
        await userModel.findByIdAndUpdate(userId, { rol: "Usuario" });
        result = await userModel.findById(userId);
      } else {
        await userModel.findByIdAndUpdate(userId, { rol: "Premium" });
        result = await userModel.findById(userId);
      }
  
      console.log(result);
      res.status(200).json({ status: "success", payload: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  };
  
  export default adminChangesRol;
  