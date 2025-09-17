import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import doctorModel from '../models/doctorModel.js';

const run = async () => {
  try {
    await connectDB();
    const res = await doctorModel.deleteMany({});
    console.log(`Deleted ${res.deletedCount} doctors.`);
  } catch (e) {
    console.error('Clear failed:', e.message);
  } finally {
    process.exit(0);
  }
};

run();