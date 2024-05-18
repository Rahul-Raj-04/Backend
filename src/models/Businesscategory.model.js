import mongoose from "mongoose"

const { Schema } = mongoose

const businessctegorySchema = new Schema(
      {
            name: { type: String, required: true },
            thumbnail: { type: String, }
      },
      { timestamps: true })




const businesscategory = mongoose.model("businessctegory", businessctegorySchema)

export default businesscategory
