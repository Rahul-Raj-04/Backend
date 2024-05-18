import { Router } from "express";
import { registerAdmin, loginAdmin, getAllAdmin, updateAdmin, deletadmin, getAdminDetails, logoutAdmin } from "../controlers/Admin.controler.js";
import { upload } from "../middlwares/FileUpload.middlwares.js"
const router = Router()

router.route("/register").post(upload.fields([
      {
            name: "avatar",
            maxCount: 1
      }
]), registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(logoutAdmin)
router.route('/Alladmin').get(getAllAdmin);
router.route('/update').patch(updateAdmin);
router.route('/delete').patch(deletadmin);
router.route('/profile').get(getAdminDetails);


export default router