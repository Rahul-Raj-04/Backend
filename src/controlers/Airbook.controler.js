import connectDB from "../confige/database.confige.js";
import Airbook from "../models/Airbook.model.js";
import Staff from "../models/Staff.model.js"; //
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller function to add a book name
const addBookName = async (req, res) => {
      await connectDB();
      try {
            const { bookname } = req.body;

            // Check if bookname is provided
            if (!bookname) {
                  throw new ApiError(400, "Book name is required");
            }
            const existingBook = await Airbook.findOne({ bookname });
            if (existingBook) {
                  throw new ApiError(400, "Book name already exist");
            }
            // Create the book with only bookname
            const book = await Airbook.create({ bookname, });

            return res.status(201).json(
                  new ApiResponse(201, book, "Book name added successfully")
            );
      } catch (error) {
            console.error("Error adding book name:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};

// Controller function to update book information
const updateBookInfo = async (req, res) => {
      try {
            const { bookId } = req.params;
            const { NetBalance, TotalIn, TotalOut, Amount, paymentmode, party, day } = req.body;

            // Check if bookId is provided
            if (!bookId) {
                  throw new ApiError(400, "Book ID is required");
            }

            // Find the book by ID and update its information
            const updatedBook = await Airbook.findOneAndUpdate(
                  { _id: bookId },
                  {
                        $set: {
                              NetBalance,
                              TotalIn,
                              TotalOut,
                              Amount,
                              paymentmode,
                              party,
                              day
                        }
                  },
                  { new: true } // Return the updated document
            );

            // Check if book exists
            if (!updatedBook) {
                  throw new ApiError(404, "Book not found");
            }

            return res.status(200).json(
                  new ApiResponse(200, updatedBook, "Book information updated successfully")
            );
      } catch (error) {
            console.error("Error updating book information:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const assignStaffToBook = async (req, res) => {
      try {
            const { bookId, staffId } = req.body;

            // Check if bookId and staffId are provided
            if (!bookId || !staffId) {
                  throw new ApiError(400, "Book ID and Staff ID are required");
            }

            // Find the book by ID
            const book = await Airbook.findById(bookId);
            if (!book) {
                  throw new ApiError(404, "Book not found");
            }

            // Find the staff by ID
            const staff = await Staff.findById(staffId);
            if (!staff) {
                  throw new ApiError(404, "Staff not found");
            }

            // Update the book to include the assigned staff
            book.staff = staffId;
            await book.save();

            return res.status(200).json(
                  new ApiResponse(200, book, "Staff assigned to book successfully")
            );
      } catch (error) {
            console.error("Error assigning staff to book:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const getallbooks = async (req, res) => {
      try {
            const allbooks = await Airbook.find()
            return res.status(200).json(new ApiResponse(200, allbooks, "allbooks  retrieved successfully"));


      } catch (error) {
            console.error("Error during staff addition:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }

}

export { addBookName, updateBookInfo, assignStaffToBook, getallbooks };
