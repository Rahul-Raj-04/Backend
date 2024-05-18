import connectDB from "../confige/database.confige.js";
import { Payment } from "../models/Paymentmode.model.js";

import Entry from "../models/Paymentsentry.model.js";
import { ApiError } from "../utils/ApiError.js";
import Staff from "../models/Staff.model.js";

const addpaymententry = async (req, res) => {
      await connectDB();
      try {
            // Destructure required fields from request body
            const { paymentmode, amount, customername, remark, attachbill, paymenttype, datatype, staffname, adminstaff } = req.body;

            // Check if all required fields are provided
            if (!paymentmode || !amount || !customername || !datatype || !staffname || !adminstaff) {
                  throw new ApiError(400, " payment mode, amount,staffname, and customer name are required");
            }


            const existingStaff = await Staff.findOne({ name: staffname });
            if (!existingStaff) {
                  throw new ApiError(404, "Staff and admin not found");
            }

            // Check if the admin exists
            const existingAdmin = await Staff.findOne({ admin: adminstaff });
            if (!existingAdmin) {
                  throw new ApiError(404, "Admin not found");
            }

            // Check if the payment mode exists
            // const existingPaymentMode = await Payment.findOne({ name: paymentmode });
            // if (!existingPaymentMode) {
            //       throw new ApiError(404, "Payment mode not found");
            // }


            // Create the entry
            const newEntry = await Entry.create({

                  paymentmode,
                  amount,
                  customername,
                  remark,
                  attachbill,
                  paymenttype,
                  datatype,
                  staffname: existingStaff.name,
                  adminstaff: existingAdmin.admin,


            });

            return res.status(201).json({
                  success: true,
                  entry: newEntry,
                  message: "Entry created successfully"
            });
      } catch (error) {
            console.error("Error creating entry:", error);
            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
      }

};
const getAllPaymentsEntries = async (req, res) => {
      try {
            // Fetch all entries
            const entries = await Entry.find();

            return res.status(200).json({
                  success: true,
                  entries,
                  message: "All entries retrieved successfully"
            });
      } catch (error) {
            console.error("Error fetching entries:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const updateEntryStatus = async (req, res) => {
      const { id } = req.body;
      try {

            const updatedEntry = await Entry.findOneAndUpdate(
                  { _id: id },
                  { status: true },
                  { new: true }
            );

            if (!updatedEntry) {
                  // If no entry found with the provided ID
                  return res.status(404).json({ success: false, message: "Entry not found" });
            }

            return res.status(200).json({
                  success: true,
                  entry: updatedEntry,
                  message: "Entry status updated successfully"
            });
      } catch (error) {
            console.error("Error updating entry status:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};


export { addpaymententry, getAllPaymentsEntries, updateEntryStatus };
