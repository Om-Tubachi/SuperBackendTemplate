import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js"
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)
router.route("/video/:videoId/:action").post(toggleVideoLike)
router.route("/comment/:commentId/:action").post(toggleCommentLike)
router.route("/tweet/:tweetId/:action").post(toggleTweetLike)
router.route("/my-liked-videos").get(getLikedVideos)

export default router