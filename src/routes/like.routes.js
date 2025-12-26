import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js"
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const likeRouter = Router()

likeRouter.route("/v/like/:videoId").post(verifyJWT , toggleVideoLike)
likeRouter.route("/c/like/:commentId").post(verifyJWT , toggleCommentLike)
likeRouter.route("/t/like/:tweetId").post(verifyJWT , toggleTweetLike)
likeRouter.route("/my-liked-videos").get(verifyJWT , getLikedVideos)

export default likeRouter