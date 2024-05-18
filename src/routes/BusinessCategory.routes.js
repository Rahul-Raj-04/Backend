import { Router } from "express";

import { addBusinessCategory, getAllBusinessCategory } from "../controlers/Businessctegory.controler.js";

const router = Router()


router.route("/add").post(addBusinessCategory)
router.route("/Allcategory").get(getAllBusinessCategory)


export default router