import connectDB from "../confige/database.confige.js";
import Business from "../models/Bussiness.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBusiness = async (req, res) => {
      await connectDB();
      try {
            // Checking if req.body is not defined or empty
            if (!req.body || Object.keys(req.body).length === 0) {
                  throw new ApiError(400, "Request body is missing or empty");
            }

            // Destructure required fields from the request body
            const { businessName, businessCategory, businessType, businessEmail } = req.body;

            // Check if required fields are missing
            if (!businessName || !businessCategory || !businessType) {
                  throw new ApiError(400, "Business name and email are required");
            }

            // Check if a business with the same email already exists
            const existingBusiness = await Business.findOne({ businessEmail });
            if (existingBusiness) {
                  throw new ApiError(409, "A business with the same email already exists");
            }

            // Create the business entity
            const business = await Business.create(req.body);

            // Return the created business entity in the response
            return res.status(201).json(
                  new ApiResponse(201, business, "Business created successfully")
            );
      } catch (error) {
            console.error("Error creating business:", error);

            // Handle specific API errors
            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            // Handle other unexpected errors
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const getallbussiness = async (req, res) => {
      try {
            const allbusiness = await Business.find({})
            return res.status(200).json(new ApiResponse(200, allbusiness, "Bussiness retrieved successfully"));
      } catch (error) {
            console.error("Error while fetching Bussiness:", error);

            // Handle errors
            return res.status(500).json({ success: false, message: "Internal server error" });
      }

};
const updatebusiness = async (req, res) => {
      try {
            const { _id, businessName, businessCategory, businessType, businessLogo, address, staffSize, businessSubcategory, businessRegisterType, gstRegistered } = req.body
            if (!_id || !businessName || !businessCategory || !businessType) {
                  return res.status(400).json({ error: "All fields are required" });
            }
            const business = await Business.findByIdAndUpdate(
                  _id,
                  {
                        $set: {

                              businessName,
                              businessCategory,
                              businessType,
                              businessLogo,
                              address,
                              staffSize,
                              businessSubcategory,
                              businessRegisterType,
                              gstRegistered
                        }
                  },
                  { new: true }
            ).select("-password")
            if (!business) {
                  return res.status(404).json({ error: "bussiness not found" });
            }
            return res.status(200).json({ message: " bussiness Account details updated successfully", business });
      } catch (error) {
            console.error("Error updating bussiness details:", error);
            return res.status(500).json({ error: "Internal Server Error" });
      }
}


export { createBusiness, getallbussiness, updatebusiness };
