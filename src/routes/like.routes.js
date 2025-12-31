import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js"
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const likeRouter = Router()

likeRouter.use(verifyJWT)
likeRouter.route("/v/like/:videoId/:action").post(toggleVideoLike)
likeRouter.route("/c/like/:commentId/:action").post(toggleCommentLike)
likeRouter.route("/t/like/:tweetId/:action").post(toggleTweetLike)
likeRouter.route("/my-liked-videos").get(getLikedVideos)

export default likeRouter