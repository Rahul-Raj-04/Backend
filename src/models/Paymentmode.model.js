import mongoose from "mongoose";

const { Schema } = mongoose

const PaymentSchema = new Schema(
      {
            name: { type: String, required: true },
            thumbnail: { type: String, required: true },
            isActive: { type: Boolean, default: true }
      },
      {
            timestamps: true
      })





export const Payment = mongoose.model("Payment", PaymentSchema)