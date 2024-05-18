import mongoose from "mongoose";

const { Schema } = mongoose

const airbookschema = new Schema({

      bookname: { type: String, required: true, unique: true },
      NetBalance: { type: String, },
      TotalIn: { type: String, },
      TotalOut: { type: String, },
      Amount: { type: Number, default: 0 },
      paymentmode: { type: String, ref: 'Payment' },
      party: { type: String },
      day: { type: String },
      staff: { type: Schema.Types.ObjectId, ref: 'Staff' }
}, { timestamps: true })



const Airbook = mongoose.model("Airbook", airbookschema)

export default Airbook