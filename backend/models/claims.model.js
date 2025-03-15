import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema({
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    couponCode: { type: String, required: true },
    clientId: { type: String, required: true }, // Used for cookie-based tracking
    ip: { type: String, required: true }, // Stores IP address for abuse prevention
    claimedAt: { type: Date, default: Date.now }
});

// Indexes for fast lookups
ClaimSchema.index({ ip: 1, claimedAt: -1 }); // Optimizes abuse prevention checks
ClaimSchema.index({ clientId: 1, claimedAt: -1 });

export default mongoose.model('Claim', ClaimSchema);
