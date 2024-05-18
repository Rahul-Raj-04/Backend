import { Router } from "express";
import { addpaymentmode, getallpaymentmode } from "../controlers/Paymentmode.controler.js";

const router = Router()


router.route("/add").post(addpaymentmode);
router.route("/allmode").get(getallpaymentmode);

export default router