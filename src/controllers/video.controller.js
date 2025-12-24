import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    // get the title , desc from the req body
    // video, thumbnail upload file local url available in req.files via multer
    // if we dont get any of these , return an error message
    // upload the video and thumbnail onto cloudinary, retrieve: duration
    // if cloudinary urls or duration are not ibtained, return an error message
    // now we have everything, instatiate a new video document and save to db

    const id = req.user?._id
    if (!id)
        throw new ApiError(409, "Login to upload a video")

    console.log(typeof req.body.title);
    const { title, description } = req.body
    
    if ([title, description].some((field) => field?.trim() === ""))
        throw new ApiError(409, "Title or description cannot be empty")
    
    const localVideoPath = req.files?.videoFile[0]?.path
    const localThumbnailPath = req.files?.thumbnail[0]?.path

    if ([localVideoPath, localThumbnailPath].some((field) => field?.trim() === ""))
        throw new ApiError(409, "Video and thumbnail are compulsory inputs")

    const vidCloudinaryUrl = await uploadOnCloudinary(localVideoPath)
    const thumbnailCloudinaryUrl = await uploadOnCloudinary(localThumbnailPath)

    if (!vidCloudinaryUrl)
        throw new ApiError(500, "Failed to upload video")
    if (!thumbnailCloudinaryUrl)
        throw new ApiError(500, "Failed to upload thumbnail")    
    
    const duration = vidCloudinaryUrl.duration
    const video = await Video.create({
        videoFile: vidCloudinaryUrl.url,
        thumbnail: thumbnailCloudinaryUrl.url,
        duration: duration,
        title: title,
        description: description,
        views: 0,
        idPublished: true,
        owner: id,
    })

    if (!video)
        throw new ApiError(400, "Failed to upload video in database")

    return res
    .status(200)
    .json(
        new ApiResponse(200 , video , "Video uploaded succesfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    // views are increemented here
    // handled views increment by adding a pre hook in the Video model

    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}