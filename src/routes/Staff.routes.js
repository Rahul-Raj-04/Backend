import { Router } from "express";
import { addStaff, editStaff, editStaffStatus, getallstaff } from "../controlers/Staff.controler.js";

const router = Router()

router.route("/add").post(addStaff)
router.route("/allstaff").get(getallstaff)
router.route("/edit").patch(editStaff)
router.route("/editstaus").patch(editStaffStatus)

export default router