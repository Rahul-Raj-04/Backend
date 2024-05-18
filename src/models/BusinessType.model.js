import mongoose from "mongoose"

const { Schema } = mongoose

const bussinessTypeSchema = new Schema(
      {
            name: { type: String, required: true },
            thumbnail: { type: String }
      },
      { timestamps: true })




const businesstype = mongoose.model("businesstype", bussinessTypeSchema)

export default businesstype
