import express from 'express';
import 'dotenv/config'
import cors from "cors"
import cookieParser from 'cookie-parser';
import connectDB from './confige/database.confige.js';
import { initializeSuperAdmin } from './controlers/SuperAdmin.controler.js';
const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: "25kb" }))
app.use(express.urlencoded({ extended: true, limit: "25kb" }))
app.use(cookieParser())




const port = process.env.PORT || 8000

connectDB()
      .then(() => {
            console.log('MongoDB connected successfully');
            initializeSuperAdmin();
            app.listen(port, () => {
                  console.log(`Server is running on port ${port}`);
            });
      })
      .catch((err) => {
            console.log("mongoosedb connection failed", err);
      })




// routes
import loginRouter from './routes/Login.routes.js';
import adminrouter from "./routes/Admin.routes.js"
import paymentmode from "./routes/Payment.routes.js"
import addstaff from "./routes/Staff.routes.js"
import addbusiness from "./routes/Bussiness.routes.js"
import airbook from "./routes/Airbook.routes.js"
import payment from "./routes/Paymentsentry.routes.js"
import businesstype from "./routes/Businesstype.routes.js"
import businesscategory from "./routes/BusinessCategory.routes.js"
import customer from "./routes/Customer.routes.js"
// routes declearation
app.use("/superadmin", loginRouter)
app.use("/paymentmode", paymentmode)
app.use("/Admin", adminrouter)
app.use("/staff", addstaff)
app.use("/businesstype", businesstype)
app.use("/businesscategory", businesscategory)
app.use("/Airbook", airbook)
app.use("/business", addbusiness)
app.use("/Customer", customer)
app.use("/payment", payment)

