import mongoose from "mongoose";
const { Schema } = mongoose

const paymententrySchema = new Schema(
      {
            paymentmode: {
                  type: String,
                  enum: ["Cash", "Online"],
                  default: "Cash"
            },
            datatype: { type: String, enum: ["A", "B"], default: "A" },
            amount: {
                  type: Number,
                  required: true
            },
            customername: {
                  type: String,
                  required: true
            },
            remark: {
                  type: String
            },
            attachbill: {
                  type: String  // Assuming you'll store a path or URL to the attachment
            },
            paymenttype: {
                  type: String,
                  enum: ["Cashin", "Cashout"]  // Assuming payment type options
            },
            status: { type: Boolean, default: false },
            staffname: { type: String, ref: 'Staff', required: true },
            adminstaff: { type: String, ref: 'Staff', required: true }

      },
      { timestamps: true }
)



const entry = mongoose.model("entry", paymententrySchema)

export default entry