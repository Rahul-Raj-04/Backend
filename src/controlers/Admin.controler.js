import connectDB from "../confige/database.confige.js";
import { Admin } from "../models/Admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// Ensure database connection
connectDB();

const registerAdmin = async (req, res) => {
      try {
            // Check if req.body is not defined or empty
            if (!req.body) {
                  throw new ApiError(400, "Request body is missing or empty");
            }

            // Destructure req.body if it exists
            const { mobile, email, username, avatar, status, password, Admindatatype } = req.body;

            // Check if any required fields are missing
            if (![mobile, email, username, password].every(field => field?.trim())) {
                  throw new ApiError(400, "All fields are required");
            }

            // Check if user already exists
            const existedUser = await Admin.findOne({
                  $or: [{ email }, { mobile }]
            });

            if (existedUser) {
                  throw new ApiError(409, "User with email or mobile already exists");
            }
            const avatarLocalPath = req.files?.avatar[0]?.path;

            if (!avatarLocalPath) {
                  throw new ApiError(400, "Avatar file is required")
            }
            const avatarimage = await uploadOnCloudinary(avatarLocalPath)
            if (!avatarimage) {
                  throw new ApiError(400, "Avatar file is required")
            }

            // const viewdatamode = await Payment.findOne({ name: viewdata });
            // if (!viewdatamode) {
            //       throw new ApiError(404, "view data mode not found");
            // }

            // Create user
            const admin = await Admin.create({
                  mobile,
                  email,
                  password,
                  username,
                  avatar: avatarimage.url,
                  status,
                  Admindatatype



            });

            // Remove sensitive fields
            const { _id: _, ...createdAdmin } = admin.toObject();

            // Return response
            return res.status(201).json(
                  new ApiResponse(200, createdAdmin, "Admin registered successfully")
            );
      } catch (error) {
            console.error("Error during user registration:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};
// const loginAdmin = async (req, res) => {
//       const generateAccessAndRefereshTokens = async (userId) => {
//             try {
//                   const user = await SuperAdmin.findById(userId)
//                   const accessToken = user.generateAccessToken()
//                   const refreshToken = user.generateRefreshToken()

//                   user.refreshToken = refreshToken
//                   await user.save({ validateBeforeSave: false })

//                   return { accessToken, refreshToken }


//             } catch (error) {
//                   throw new ApiError(500, "Something went wrong while generating referesh and access token")
//             }
//       }
//       // try {
//       //       // Check if req.body is not defined or empty
//       //       if (!req.body) {
//       //             throw new ApiError(400, "Request body is missing or empty");
//       //       }

//       //       // Destructure req.body if it exists
//       //       const { mobile, otp } = req.body;

//       //       // Check if the mobile number and OTP are provided
//       //       if (!mobile || !otp) {
//       //             throw new ApiError(400, "Mobile number and OTP are required");
//       //       }

//       //       // Check if user exists with the provided mobile number
//       //       const admin = await Admin.findOne({ mobile });
//       //       if (!admin) {
//       //             throw new ApiError(404, "Admin not found");
//       //       }

//       //       // Compare the received OTP with the fixed OTP
//       //       if (otp !== "1234") {
//       //             throw new ApiError(401, "Invalid OTP");
//       //       }

//       //       // Return response
//       //       return res.status(200).json(new ApiResponse(200, { mobile }, "Login successful"));
//       // } catch (error) {
//       //       console.error("Error during login:", error);

//       //       if (error instanceof ApiError) {
//       //             return res.status(error.statusCode).json({ success: false, message: error.message });
//       //       }

//       //       return res.status(500).json({ success: false, message: "Internal server error" });
//       // }
// };

const loginAdmin = async (req, res) => {
      const generateAccessAndRefereshTokens = async (userId) => {
            try {
                  const admin = await Admin.findById(userId);
                  const accessToken = admin.generateAccessToken();
                  const refreshToken = admin.generateRefreshToken();

                  admin.refreshToken = refreshToken;
                  await admin.save({ validateBeforeSave: false });

                  return { accessToken, refreshToken };
            } catch (error) {
                  throw new ApiError(500, "Something went wrong while generating refresh and access token");
            }
      };

      try {
            const { email, username, password } = req.body;

            if (!username && !email) {
                  throw new ApiError(400, "Username or email is required");
            }

            // Find the user by username or email
            const admin = await Admin.findOne({ $or: [{ username }, { email }] });

            if (!admin) {
                  throw new ApiError(404, "Admin does not exist");
            }

            // Check if user status is true
            if (!admin.status) {
                  throw new ApiError(403, "User is not active");
            }

            // Validate password
            const isPasswordValid = await admin.isPasswordCorrect(password);

            if (!isPasswordValid) {
                  throw new ApiError(401, "Invalid user credentials");
            }

            // Generate access and refresh tokens
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id);

            // Fetch logged-in user data (excluding password and refreshToken)
            const loggedInUser = await Admin.findById(admin._id).select("-password -refreshToken");
            admin.loginstatus = true;
            await admin.save({ validateBeforeSave: false });
            // Set options for cookies
            const options = {
                  httpOnly: true,
                  secure: true
            };

            // Send response with cookies and logged-in user data
            return res
                  .status(200)
                  .cookie("accessToken", accessToken, options)
                  .cookie("refreshToken", refreshToken, options)
                  .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));

      } catch (error) {
            console.error("Error during login:", error);

            // Handle specific errors
            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal server error" });
      }
};

const logoutAdmin = async (req, res) => {
      try {
            // Assuming you have the admin ID available in the request body or query parameters
            const adminId = req.body.adminId || req.query.adminId; // Modify this according to how the admin ID is sent in your request

            if (!adminId) {
                  throw new ApiError(400, "Admin ID is required");
            }

            // Find the admin by ID
            const admin = await Admin.findById(adminId);

            if (!admin) {
                  throw new ApiError(404, "Admin not found");
            }

            // Set login status to false
            admin.loginstatus = false;
            await admin.save({ validateBeforeSave: false });

            // Clear cookies (optional)
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(200).json({ success: true, message: "Admin logged out successfully" });
      } catch (error) {
            console.error("Error during logout:", error);

            // Handle specific errors
            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal server error" });
      }
};
const getAllAdmin = async (req, res) => {
      try {
            // Fetch all users from the database
            const admins = await Admin.find({}, { password: 0 }); // Excluding password field

            // Return response with the list of users
            return res.status(200).json(new ApiResponse(200, admins, "Admin retrieved successfully"));
      } catch (error) {
            console.error("Error while fetching users:", error);

            // Handle errors
            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};

const updateAdmin = async (req, res) => {
      const { mobile, email, password, username, avatar, status, Admindatatype, userId } = req.body;


      try {
            if (!userId) {
                  return res.status(400).json({ error: "admin id are required" });
            }

            const admin = await Admin.findByIdAndUpdate(
                  userId,
                  {
                        $set: {
                              username,
                              email,
                              avatar,
                              mobile,
                              password,
                              Admindatatype
                        }
                  },
                  { new: true }
            ).select("-password");

            if (!admin) {
                  return res.status(404).json({ error: "Admin not found" });
            }

            return res.status(200).json({ message: "Account details updated successfully", admin });
      } catch (error) {
            console.error("Error updating account details:", error);
            return res.status(500).json({ error: "Internal Server Error" });
      }
};
const deletadmin = async (req, res) => {
      const { id } = req.body;
      try {
            // Find user by ID and update status to false
            const updatedAdmin = await Admin.findByIdAndUpdate(
                  { _id: id },
                  { $set: { status: false } },
                  { new: true }
            );

            // Check if user exists
            if (!updatedAdmin) {
                  return res.status(404).json({ error: "User not found" });
            }

            // Send success response
            return res.status(200).json({ message: "User  deleted successfully", updatedAdmin });

      } catch (error) {
            console.error("Error during user registration:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }

}





const getAdminDetails = async (req, res) => {
      connectDB();
      try {
            const adminId = req.query.adminId; // Extract adminId from query params
            if (!adminId) {
                  throw new ApiError(400, "Admin ID is required in query params");
            }

            // Fetch admin details from the database based on the adminId
            const admin = await Admin.findById(adminId);

            if (!admin) {
                  throw new ApiError(404, "Admin not found");
            }


            const adminDetails = {
                  username: admin.username,
                  mobile: admin.mobile,
                  email: admin.email,
                  avatar: admin.avatar,
                  status: admin.status,
                  Admindatatype: admin.Admindatatype
            };

            // Send admin details in the response
            res.json(new ApiResponse(200, adminDetails, "Admin details retrieved successfully"));
      } catch (error) {
            console.error("Error fetching admin details:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({ success: false, message: error.message });
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
      }
};






export { registerAdmin, loginAdmin, getAllAdmin, updateAdmin, deletadmin, getAdminDetails, logoutAdmin };
