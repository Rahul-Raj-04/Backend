import connectDB from "../confige/database.confige.js";
import { Payment } from "../models/Paymentmode.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Assuming ApiResponse is defined in this file



const addpaymentmode = async (req, res) => {
      try {
            await connectDB();
            if (!req.body || Object.keys(req.body).length === 0) {
                  throw new ApiError(400, "Request body is missing or empty");
            }

            const { name, thumbnail, isActive } = req.body;

            if (![name, thumbnail].every(field => field && field.trim())) {
                  throw new ApiError(400, "All fields are required");
            }

            // Check if payment mode with the same name already exists
            const existingPaymentMode = await Payment.findOne({ name });
            if (existingPaymentMode) {
                  throw new ApiError(409, "Payment mode with the same name already exists");
            }

            const paymentMode = await Payment.create({
                  name,
                  thumbnail,
                  isActive,
            });

            const { _id, ...createdPaymentMode } = paymentMode.toObject();
            return res.status(201).json(
                  new ApiResponse(201, createdPaymentMode, "Payment mode added successfully")
            );
      } catch (error) {
            console.error("Error during payment mode addition:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};

const getallpaymentmode = async (req, res) => {
      try {
            const allpayment = await Payment.find({})
            return res.status(200).json(new ApiResponse(200, allpayment, "paymentmode retrieved successfully"));

      } catch (error) {
            console.error("Error during  get allpayment mode:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }

}

export { addpaymentmode, getallpaymentmode };
