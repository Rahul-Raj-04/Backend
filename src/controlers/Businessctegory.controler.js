import connectDB from '../confige/database.confige.js';
import businesscategory from '../models/Businesscategory.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const addBusinessCategory = async (req, res) => {
      await connectDB(); // Assuming connectDB is a function that establishes a database connection

      try {
            const { name } = req.body;

            // Check if name is provided
            if (!name) {
                  throw new ApiError(400, "Business Category name is required");
            }

            const existingBusinessCategory = await businesscategory.findOne({ name });

            if (existingBusinessCategory) {
                  throw new ApiError(400, "Business Category name already exists");
            }

            // Create the business type
            const businessCategory = await businesscategory.create({ name, });

            return res.status(201).json({
                  success: true,
                  message: "Business Category added successfully",
                  businessCategory: businessCategory
            });
      } catch (error) {
            console.error("Error adding business Category:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};

const getAllBusinessCategory = async (req, res) => {
      try {
            const allBusinessCategory = await businesscategory.find({})
            return res.status(200).json(new ApiResponse(200, allBusinessCategory, "Bussiness category retrieved successfully"));
      } catch (error) {
            console.error("Error while fetching Bussiness:", error);

            // Handle errors
            return res.status(500).json({ success: false, message: "Internal server error" });
      }

};
export { addBusinessCategory, getAllBusinessCategory };
