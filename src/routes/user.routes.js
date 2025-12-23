import Router from "express"
import {
    registerUSer,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getUserSubscribersAndSubscribedTo,
    getWatchHistory,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateAccountDetails,
    updateUserCoverImage

} 
from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImg",
            maxCount: 1,
        }
    ]),
    registerUSer
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-the-token").post(refreshAccessToken)
router.route("/profile/:username").get(getUserSubscribersAndSubscribedTo)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/user").get(verifyJWT, getCurrentUser)
router.route("/change-avatar")
    .patch(
        verifyJWT,
        upload.single([
            {
                name: "avatar",
                maxCount: 1,
            }
        ]),
        updateUserAvatar
    )
router.route("/update-account-details").patch(
    verifyJWT,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImg",
            maxCount: 1
        }
    ]),
    updateAccountDetails
)
router.route("change-coverimage").patch(
    verifyJWT,
    upload.single([
        {
            name: "coverImg",
            maxCount: 1,
        }
    ]),
    updateUserCoverImage
)

router.route("/").get((req, res, next) => {
    res.json({ message: "please use postman mister" })
})

export default router