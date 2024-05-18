import { Router } from "express";

import { addBusinessType, getAllBusinessTypes } from "../controlers/Businesstype.controler.js";
const router = Router()
router.route("/add").post(addBusinessType)
router.route("/Allbusinesstype").get(getAllBusinessTypes)

export default router