import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const { Schema } = mongoose

const SuperAdminScheama = new Schema(
      {
            username: { type: String, required: true },
            password: { type: String, required: true },
            email: { type: String, required: true },
            isAdmin: { type: Boolean, default: false },
            avatar: {
                  type: String,

            },
            refreshToken: {
                  type: String
            }
      },
      {
            timestamps: true
      }
)
SuperAdminScheama.pre("save", async function (next) {
      if (!this.isModified("password")) return next();

      this.password = await bcrypt.hash(this.password, 10)
      next()
})
SuperAdminScheama.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password, this.password)
}
SuperAdminScheama.methods.generateAccessToken = function () {
      return jwt.sign(
            {
                  _id: this._id,
                  email: this.email,
                  username: this.username,
                  fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
      )
}
SuperAdminScheama.methods.generateRefreshToken = function () {
      return jwt.sign(
            {
                  _id: this._id,

            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                  expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
      )
}


export const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminScheama)