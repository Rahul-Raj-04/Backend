import mongoose from 'mongoose';

const { Schema } = mongoose;

const businessSchema = new Schema({
      businessName: {
            type: String,
            required: true
      },
      businessCategory: {
            type: String,
            required: true
      },
      businessType: {
            type: String,
            required: true
      },
      businessLogo: {
            type: String,

      },
      address: {
            type: String,

      },
      staffSize: {
            type: Number,

      },
      businessSubcategory: {
            type: String,

      },
      businessRegisterType: {
            type: String,

      },
      gstRegistered: {
            type: Boolean,

      },
      businessEmail: {
            type: String,

            unique: true // business email should be unique
      }
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

export default Business;
