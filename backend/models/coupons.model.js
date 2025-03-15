import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    claimed: { type: Boolean, default: false },
    distributionIndex: { type: Number, required: true }, // Ensures round-robin assignment
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Coupon', CouponSchema);
