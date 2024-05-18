import { Router } from "express";
import { addBookName, assignStaffToBook, getallbooks } from "../controlers/Airbook.controler.js";


const router = Router()

router.route("/add").post(addBookName)
router.route("/assinstaff").patch(assignStaffToBook)
router.route("/allbooks").get(getallbooks)
export default router