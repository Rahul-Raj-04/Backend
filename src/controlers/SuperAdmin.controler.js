import connectDB from "../confige/database.confige.js";
import { SuperAdmin } from "../models/SuperAdmin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js  "

async function initializeSuperAdmin() {
      try {
            await connectDB();
            const superadmin = await SuperAdmin.findOne({ isAdmin: true });
            if (!superadmin) {
                  const superadminuser = new SuperAdmin({
                        username: 'admin',
                        password: 'rahul@123', // You should use a secure password hashing mechanism in a real application
                        email: 'admin@example.com',
                        isAdmin: true,
                        avatar: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg?size=626&ext=jpg&ga=GA1.1.447959664.1699399500&semt=sph",

                  })
                  await superadminuser.save();
                  console.log('Superadmin user created');

            } else {
                  console.log('Superadmin user already exists');
            }


      } catch (error) {
            console.log("Database connection failed in initialize SuperAdmin", error);
      }

}

export { initializeSuperAdmin }


/// Controller function to handle user login


const loginUser = async (req, res) => {
      const generateAccessAndRefereshTokens = async (userId) => {
            try {
                  const user = await SuperAdmin.findById(userId)
                  const accessToken = user.generateAccessToken()
                  const refreshToken = user.generateRefreshToken()

                  user.refreshToken = refreshToken
                  await user.save({ validateBeforeSave: false })

                  return { accessToken, refreshToken }


            } catch (error) {
                  throw new ApiError(500, "Something went wrong while generating referesh and access token")
            }
      }
      try {
            // Initialize the superadmin
            await initializeSuperAdmin();

            const { email, username, password } = req.body;

            if (!username && !email) {
                  throw new ApiError(400, "username or email is required");
            }

            // Find the user by username or email
            const user = await SuperAdmin.findOne({ $or: [{ username }, { email }] });
            if (!user) {
                  throw new ApiError(404, "User does not exist");
            }

            // Validate password
            const isPasswordValid = await user.isPasswordCorrect(password);
            if (!isPasswordValid) {
                  throw new ApiError(401, "Invalid user credentials");
            }

            // Generate access and refresh tokens
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

            // Fetch logged-in user data (excluding password and refreshToken)
            const loggedInUser = await SuperAdmin.findById(user._id).select("-password -refreshToken");

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
                  .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"));
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


export { loginUser }