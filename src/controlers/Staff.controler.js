// import Staff from "../models/Staff.model.js";
// Filename: controllers/staffController.js

import Staff from '../models/Staff.model.js';
import connectDB from '../confige/database.confige.js'; // Assuming you have a connectDB function
import { ApiError } from '../utils/ApiError.js'; // Assuming you have an ApiError class
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have an ApiResponse class
import { Admin } from '../models/Admin.model.js';
const addStaff = async (req, res) => {
      try {
            await connectDB();

            if (!req.body || Object.keys(req.body).length === 0) {
                  throw new ApiError(400, "Request body is missing or empty");
            }

            const { name, mobile, password, adminName } = req.body;

            if (![name, mobile, password, adminName].every(field => field?.trim())) {
                  throw new ApiError(400, "All fields are required and must be strings");
            }

            const existingStaffByMobile = await Staff.findOne({ mobile });
            if (existingStaffByMobile) {
                  throw new ApiError(409, "Staff with the same mobile number already exists");
            }

            const existingStaffByName = await Staff.findOne({ name });
            if (existingStaffByName) {
                  throw new ApiError(409, "Staff with the same name already exists");
            }

            const existingAdmin = await Admin.findOne({ username: adminName });

            if (!existingAdmin) {
                  throw new ApiError(404, "Admin with the provided username does not exist");
            }

            const staff = await Staff.create({
                  name,
                  mobile,
                  password,
                  admin: existingAdmin.username
            });

            const { _id, admin, ...createdStaff } = staff.toObject();

            return res.status(201).json(
                  new ApiResponse(201, { ...createdStaff, adminName }, "Staff added successfully")
            );

      } catch (error) {
            console.error("Error during staff addition:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};



const getallstaff = async (req, res) => {
      try {
            const allstaff = await Staff.find()
            return res.status(200).json(new ApiResponse(200, allstaff, "Allstaff retrieved successfully"));


      } catch (error) {
            console.error("Error during staff addition:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }

}
const getStaffByAdminId = async (req, res) => {
      try {
            const { adminName } = req.query;

            // If adminName is not provided, return a bad request error
            if (!adminName) {
                  throw new ApiError(400, "Admin name is required");
            }

            // Find all staff associated with the specified admin name
            const staff = await Staff.find({ admin: adminName });

            return res.status(200).json(new ApiResponse(200, staff, "Staff members retrieved successfully"));
      } catch (error) {
            console.error("Error while retrieving staff by admin ID:", error);
            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const editStaff = async (req, res) => {
      try {
            // Assuming staff member's ID is passed as a parameter
            const { name, mobile, password, id } = req.body;

            // Check if the required fields are provided
            if (!name || !mobile || !password) {
                  throw new ApiError(400, "Name, mobile, and password are required fields");
            }

            // Find and update the staff member's details
            const updatedStaff = await Staff.findOneAndUpdate(
                  { _id: id }, // Filter by staff member's ID
                  { name, mobile, password }, // Updated fields
                  { new: true } // Return the updated document
            );

            // If staff member with the provided ID doesn't exist, throw an error
            if (!updatedStaff) {
                  throw new ApiError(404, "Staff member not found");
            }

            return res.status(200).json(new ApiResponse(200, updatedStaff, "Staff member updated successfully"));
      } catch (error) {
            console.error("Error while editing staff member:", error);
            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const editStaffStatus = async (req, res) => {
      try {
            const { id } = req.body;

            // Find the staff member by ID and update the status to false
            const updatedStaff = await Staff.findOneAndUpdate(
                  { _id: id }, // Filter by staff member's ID
                  { status: false }, // Update status to false
                  { new: true } // Return the updated document
            );

            // If staff member with the provided ID doesn't exist, throw an error
            if (!updatedStaff) {
                  throw new ApiError(404, "Staff member not found");
            }

            return res.status(200).json({ success: true, data: updatedStaff, message: "Staff member status updated successfully" });
      } catch (error) {
            console.error("Error while updating staff member status:", error);
            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};

export { addStaff, getallstaff, editStaff, editStaffStatus };
