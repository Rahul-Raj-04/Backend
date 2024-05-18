import mongoose from 'mongoose';

const { Schema } = mongoose;

const staffSchema = new Schema({
      name: {
            type: String,
            required: true,
            unique: true
      },
      mobile: {
            type: String,
            required: true,
            unique: true
      },
      password: {
            type: String,
            required: true
      },
      admin: {
            type: String,
            ref: 'Admin'
      },
      status: {
            type: Boolean,
            default: true
      }
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
