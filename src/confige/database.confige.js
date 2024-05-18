import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async () => {
      try {
            const connectioninstant = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`);
            console.log(`\n Mongose connected !! DB HOST :${connectioninstant.Connection.host}`);
      } catch (error) {
            console.log("Database connection  error", error);
            throw err
      }

}


export default connectDB