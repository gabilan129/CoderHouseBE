import userModel from "../DAO/models/userModel.js";
import crypto from "crypto";
import PasswordResetToken from "../DAO/models/passwordToken.js";
import nodemailer from "nodemailer";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

mongoose.model("Usuarios", userModel.schema);

export const renderForgot = (req, res) => {
    res.render("forgot");
};

export const renderReset = (req, res) => {
    const { token } = req.params;
    const { email } = req.body;
    res.render("resetPassword", { token, email });
};

export const postForgot = async (req, res) => {
    const { email } = req.body;

    try {
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: "El usuario no existe" });
    }

    // Genera un token
    const token = crypto.randomBytes(15).toString("hex");

    // Guarda el token en la base de datos
    await PasswordResetToken.create({
        userId: user._id,
        token,
    });

    // Envia mail con el link para reestablecer contraseña
    const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 8080,
    auth: {
        user: "l.katz92@gmail.com",
        pass: " wgtmyxoujarkujym",
    },
    });
    const resetLink = `http://localhost:8080/reset/${token}`;
    const message = {
    to: user.email,
    subject: "Recuperación de contraseña",
    html: `<a href="http://localhost:8080/reset/${token}">Enlace de restablecimiento de contraseña</a>`,
    };

    await transporter.sendMail(message);

    res.json({
    message:
        "El correo electrónico de restablecimiento de contraseña se ha enviado",
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

export const resetPassword = async (req, res) => {
    const { token, password, repeatPassword, email } = req.body;

    console.log("Token:", token);
    console.log("Password:", password);
    console.log("Repeat Password:", repeatPassword);

    try {
        const passwordResetToken = await PasswordResetToken.findOne({ token });
        console.log("por aqui vamos", passwordResetToken);

        if (!passwordResetToken) {
            return res.status(404).json({ error: "El token no es válido o ha expirado" });
        }

        if (!password || !repeatPassword) {
            return res.status(400).json({ error: "Faltan campos" });
        }

        if (password !== repeatPassword) {
            return res.status(400).json({ error: "Las contraseñas no coinciden" });
        }
        console.log("de momento todo bien");

        const user = await userModel.findOne({ email }); 
        console.log(user);

        if (!user) {
            return res.status(404).json({ error: "El usuario no existe" });
        }

        const isSamePassword = await bcrypt.compare(password, user.password);

        if (isSamePassword) {
            return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior" });
        }

        if (passwordResetToken.expiration < Date.now()) {
            return res.render("reset"); // Renderizamos una vista especial para solicitar un nuevo correo de restablecimiento
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true });

        await passwordResetToken.deleteOne({ _id: passwordResetToken._id });

        res.json({ message: "La contraseña se ha actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
