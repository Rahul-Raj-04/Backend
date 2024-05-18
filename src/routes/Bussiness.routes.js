import { Router } from "express";
import { createBusiness, getallbussiness, updatebusiness } from "../controlers/Bussiness.controler.js";
const router = Router()

router.route("/add").post(createBusiness)
router.route("/allbusiness").get(getallbussiness)
router.route("/update").patch(updatebusiness)


export default router