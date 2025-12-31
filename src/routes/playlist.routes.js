import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

router.use(verifyJWT)
router.route("/add-video-playlist/:playlistId/:videoId").post(addVideoToPlaylist)
router.route("/create-playlist").post(createPlaylist)
router.route("/delete-playlist/:playlistId").post(deletePlaylist)
router.route("/:playlistId").get(getPlaylistById)
router.route("/:userId").get(getUserPlaylists)
router.route("/remove-from-playlist/:playlistId/:videoId").get(removeVideoFromPlaylist)
router.route("/update-playlist/:playlistId").patch(updatePlaylist)

export default router
