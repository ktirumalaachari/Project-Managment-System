import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connect");
  } catch (error) {
    console.error("❌ MongoDB Contention error", error);
    process.exit(1);
  }
};

export default connectDB;
