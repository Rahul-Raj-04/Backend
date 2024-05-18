import mongoose from "mongoose";

const { Schema } = mongoose

const customerSchema = new Schema(
      {
            customername: { type: String, required: true },
            customerMobile: { type: Number, required: true, uniqe: true },
            customeremail: { type: String, },
            customertype: { type: String, default: "Customer", enum: ["Customer", "Supplier"] },


      },
      { timestamps: String })



const customer = mongoose.model("customer", customerSchema)


export default customer