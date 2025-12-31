import {
    getVideoComments,
    addComment,
    deleteComment,
    updateComment,
} from "../controllers/comment.controller.js"

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/getComments/:videoId").get(getVideoComments)

router.use(verifyJWT)
router.route("/addComment/:videoId").post(addComment)
router.route("/updateComment/:commentId").patch(updateComment)
router.route("/deleteComment/:commentId").delete(deleteComment)

export default router