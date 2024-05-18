import { Router } from "express";
import { addpaymententry, getAllPaymentsEntries, updateEntryStatus } from "../controlers/Paymententry.controler.js";
const router = Router()



router.route("/add").post(addpaymententry)
router.route("/allpayment").get(getAllPaymentsEntries)
router.route("/update").patch(updateEntryStatus)


export default router