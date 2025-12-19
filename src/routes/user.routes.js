import Router from "express"
import { registerUSer , loginUser , logOutUser ,refreshAccessToken} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1,
        },
        {
            name:"coverImg",
            maxCount: 1,
        }
    ]),
    registerUSer
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-the-token").post(refreshAccessToken)
router.route("/").get((req , res , next) => {
    res.json({message:"please use postman mister"})
})

export default router