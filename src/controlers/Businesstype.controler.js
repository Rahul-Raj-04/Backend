import connectDB from '../confige/database.confige.js';
import businesstype from '../models/BusinessType.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addBusinessType = async (req, res) => {
      await connectDB(); // Assuming connectDB is a function that establishes a database connection

      try {
            const { name } = req.body;

            // Check if name is provided
            if (!name) {
                  throw new ApiError(400, "Business type name is required");
            }

            const existingBusinessType = await businesstype.findOne({ name });

            if (existingBusinessType) {
                  throw new ApiError(400, "Business type name already exists");
            }

            // Create the business type
            const businessType = await businesstype.create({ name });

            return res.status(201).json({
                  success: true,
                  message: "Business type added successfully",
                  businessType: businessType
            });
      } catch (error) {
            console.error("Error adding business type:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};

const getAllBusinessTypes = async (req, res) => {
      try {
            const allBusinessTypes = await businesstype.find({})
            return res.status(200).json(new ApiResponse(200, allBusinessTypes, "Bussiness retrieved successfully"));
      } catch (error) {
            console.error("Error while fetching Bussiness:", error);

            // Handle errors
            return res.status(500).json({ success: false, message: "Internal server error" });
      }

};
export { addBusinessType, getAllBusinessTypes };
