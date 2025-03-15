import express from 'express';
import Coupon from '../models/coupons.model.js';
import Claim from '../models/claims.model.js';
import cookieParser from 'cookie-parser';

import checkAbuse from '../middlewares/checkAbuse.middleware.js';
const router = express.Router();
router.use(cookieParser());


// Claim Coupon Route
router.post('/', checkAbuse, async (req, res) => {
    const { ip, clientId } = req.clientData;

    // Find the next available coupon
    const coupon = await Coupon.findOneAndUpdate(
        { claimed: false },
        { claimed: true },
        { new: true, sort: { distributionIndex: 1 } }
    );

    if (!coupon) return res.status(400).json({ message: "No coupons available." });

    // Store claim record
    await Claim.create({
        couponId: coupon._id,
        couponCode: coupon.code,
        clientId,
        ip,
        claimedAt: new Date()
    });

    res.json({ message: `Coupon claimed: ${coupon.code}`, coupon });
});

export default router;
