import { Router } from "express";
import { addCustomer, deleteCustomer, editCustomer, getAllCustomers } from "../controlers/Customer.controler.js";

const router = Router()

router.route("/add").post(addCustomer)
router.route("/Allcustomer").get(getAllCustomers)
router.route("/edit").patch(editCustomer)
router.route("/delete").delete(deleteCustomer)

export default router