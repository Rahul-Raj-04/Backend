import { Router } from "express";
import { loginUser } from "../controlers/SuperAdmin.controler.js";

const router = Router()


router.route("/login").post(loginUser)


export default router 