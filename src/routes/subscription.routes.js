
import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controllers.js";

const router = Router()

router.use(jwtVerify)
router.route('/c/:channelId')
    .get(getSubscribedChannels)
    .post(toggleSubscription)
router.route('/u/:subscriberId')
    .get(getUserChannelSubscribers)

export default router;