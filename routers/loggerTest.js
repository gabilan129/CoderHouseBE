import { Router } from "express";
import { loggerTesting } from "../Controllers/loggerTestController.js";


const loggerTestingRoute = Router();

loggerTestingRoute.get("/", loggerTesting);

export default loggerTestingRoute