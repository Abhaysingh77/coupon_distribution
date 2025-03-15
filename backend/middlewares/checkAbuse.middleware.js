import { v4 as uuidv4 } from 'uuid';
import Claim from '../models/claims.model.js'

const COOLDOWN_TIME = 60 * 60 * 1000; // 1 hour cooldown

// Middleware: Check abuse prevention
const checkAbuse = async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;  // Get real IP
    const clientId = req.cookies.clientId || `client_${Date.now()}_${uuidv4().slice(0, 8)}`;

    // Store clientId in cookies if not set
    if (!req.cookies.clientId) {
        res.cookie('clientId', clientId, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    }

    // Check last claim from the same IP or clientId
    const lastClaim = await Claim.findOne({ 
        $or: [{ ip }, { clientId }] 
    }).sort({ claimedAt: -1 });

    if (lastClaim && (Date.now() - lastClaim.claimedAt.getTime()) < COOLDOWN_TIME) {
        return res.status(429).json({ 
            message: `Try again after ${Math.ceil((COOLDOWN_TIME - (Date.now() - lastClaim.claimedAt.getTime())) / 60000)} minutes.` 
        });
    }

    req.clientData = { ip, clientId };
    next();
};

export default checkAbuse

