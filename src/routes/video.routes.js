import {
    publishAVideo
} from "../controllers/video.controller.js"

import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const videoRouter = Router()

videoRouter.route("/publish").post(
    verifyJWT,
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        },
        {
            name:"videoFile",
            maxCount:1,
            limits: { fileSize: 1024 * 1024 * 300 } 
        },
    ]),
    publishAVideo
)

export default videoRouter