import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const { Schema } = mongoose

const AdminSchema = new Schema(
      {
            mobile: { type: Number, required: true },
            password: { type: String, required: true },
            email: { type: String, required: true },
            username: { type: String, required: true },
            avatar: { type: String, },
            status: { type: Boolean, default: true },
            Admindatatype: { type: String, default: "A", enum: ['A', 'B'] },
            refreshToken: { type: String },
            loginstatus: { type: Boolean, default: false }


      },
      {
            timestamps: true
      })

AdminSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next();

      this.password = await bcrypt.hash(this.password, 10)
      next()
})
AdminSchema.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password, this.password)
}
AdminSchema.methods.generateAccessToken = function () {
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
AdminSchema.methods.generateRefreshToken = function () {
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





export const Admin = mongoose.model("Admin", AdminSchema)