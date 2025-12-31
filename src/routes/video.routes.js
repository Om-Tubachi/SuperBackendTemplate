import {
    publishAVideo,
    getAllVideos,
    deleteVideo,
    updateVideo,
    getVideoById
} from "../controllers/video.controller.js"

import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/").get(getAllVideos)
router.route("/:videoId").get(getVideoById)

router.use(verifyJWT)
router.route("/update/:videoId")
.patch(
    
    upload.single("thumbnail"),
    updateVideo
)
router.route("/delete/:videoId").delete(deleteVideo)
router.route("/publish").post(
    
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

export default router