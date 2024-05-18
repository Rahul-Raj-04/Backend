import connectDB from '../confige/database.confige.js';
import customer from '../models/Customer.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addCustomer = async (req, res) => {
      await connectDB(); // Assuming connectDB is a function that establishes a database connection

      try {
            const { customername, customerMobile, customeremail } = req.body;

            // Check if required fields are provided
            if (!customername || !customerMobile || !customeremail) {
                  throw new ApiError(400, "All fields are required");
            }

            // Check if mobile number already exists
            const existingCustomer = await customer.findOne({ customerMobile });
            if (existingCustomer) {
                  throw new ApiError(400, "Mobile number already exists");
            }

            // Create the customer
            const newCustomer = await customer.create({ customername, customerMobile, customeremail });

            return res.status(201).json({
                  success: true,
                  message: "Customer added successfully",
                  customer: newCustomer
            });
      } catch (error) {
            console.error("Error adding customer:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};

const editCustomer = async (req, res) => {
      await connectDB(); // Assuming connectDB is a function that establishes a database connection

      try {
            const { customerId, customername, customerMobile, customeremail } = req.body;

            // Check if required fields are provided
            if (!customerId || !customername || !customerMobile || !customeremail) {
                  throw new ApiError(400, "All fields are required");
            }

            // Check if customer exists
            const existingCustomer = await customer.findById(customerId);
            if (!existingCustomer) {
                  throw new ApiError(404, "Customer not found");
            }

            // Check if mobile number already exists for another customer
            const otherCustomerWithMobile = await customer.findOne({ customerMobile, _id: { $ne: customerId } });
            if (otherCustomerWithMobile) {
                  throw new ApiError(400, "Mobile number already exists for another customer");
            }

            // Update the customer
            existingCustomer.customername = customername;
            existingCustomer.customerMobile = customerMobile;
            existingCustomer.customeremail = customeremail;
            await existingCustomer.save();

            return res.status(200).json({
                  success: true,
                  message: "Customer details updated successfully",
                  customer: existingCustomer
            });
      } catch (error) {
            console.error("Error updating customer:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const getAllCustomers = async (req, res) => {
      try {
            const allCustomers = await customer.find({});
            return res.status(200).json(new ApiResponse(200, allCustomers, "Customers retrieved successfully"));
      } catch (error) {
            console.error("Error while fetching customers:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const deleteCustomer = async (req, res) => {
      await connectDB(); // Assuming connectDB is a function that establishes a database connection

      try {
            const { customerId } = req.body;

            // Check if customerId is provided
            if (!customerId) {
                  throw new ApiError(400, "Customer ID is required");
            }

            // Check if customer exists
            const existingCustomer = await customer.findById(customerId);
            if (!existingCustomer) {
                  throw new ApiError(404, "Customer not found");
            }

            // Delete the customer
            await customer.findByIdAndDelete(customerId);

            return res.status(200).json({
                  success: true,
                  message: "Customer deleted successfully",
            });
      } catch (error) {
            console.error("Error deleting customer:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};



export { addCustomer, getAllCustomers, editCustomer, deleteCustomer };
