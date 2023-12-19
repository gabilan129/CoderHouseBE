import { Router } from "express";
import { authAdminMiddleware, authMiddleware } from "../auth.js";
import adminChangesRol, {  paginatedUsers,deleteUsers } from "../Controllers/adminRouteController.js";
import uploadDocuments from "../Controllers/userRoleControllers.js"
import { uploader } from "../Middlewares/uploadFiles.js";


const uploadMiddleware = uploader.fields([{name:"profiles"},{name:"documents"},{name:"products"}, {name:"identification"},{name:"residence"},{name:"account"}])



const adminRouter = Router();

adminRouter.get("/listOfUsers",authAdminMiddleware, paginatedUsers )

adminRouter.put("/listOfUsers", authAdminMiddleware,adminChangesRol )

adminRouter.delete ("/deleteUser", authAdminMiddleware, deleteUsers)

adminRouter.post("/:id/documents",authMiddleware, uploadMiddleware,uploadDocuments)

export default adminRouter 