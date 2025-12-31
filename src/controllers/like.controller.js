import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Dislike } from "../models/dislike.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId, action } = req.params
    // action is "like" || action is "dislike" always
    if (!videoId)
        throw new ApiError(408, "Did not get video id or such video with given id does not exist")

    if (!action || !["like", "dislike"].includes(action.trim()))
        throw new ApiError(408, "Did not get like or dislike action")
    //TODO: toggle like on video

    // first find existinglike and existingdislike doc of current vidId in Like and Dislike collection
    // if you find existinglike, delete that doc and create a new dislike doc 
    // else if you find existingDislike, delete that doc and create a new like doc 
    // MOST IMPORTANT CASE: what if you dont find both ----> User has neither liked nor disliked the video
    // WHAT IF: user has already disliked, and again clicks in it to remove his dislike, same with like

    // WHAT WILL HELP IS: get an action = like or dislike from front end, 
    // action = like --> we find a like doc --> delete like doc, end of operation
    // action = like --> we find a dislike doc --> delete dilike doc and create like doc, end of operation
    // action = like --> we find neither dislike nor like doc --> simply creatre like doc , end of operation

    // action = dislike --> we find a dislike doc --> delete dislike doc, end of operation
    // action = dislike --> we find a like doc --> delete like doc and create dislike doc, end of operation
    // action = dislike --> we find neither dislike nor like doc --> simply creatre dislike doc , end of operation



    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    const existingDislike = await Dislike.findOne({
        video: videoId,
        dislikedBy: req.user?._id
    })

    if (existingLike && !existingDislike) {
        const deleteLike = await Like.findByIdAndDelete(existingLike._id)
        if (!deleteLike)
            throw new ApiError(409, "Failed to remove like from video")
        if (action === "like") {
            // delete existingLike doc
            return res
                .status(200)
                .json(
                    new ApiResponse(200, deleteLike, "Removed like succesfully")
                )

        }
        else {
            // delete existingLike doc, create new dislike doc
            const newDislikeDoc = await Dislike.create({
                video: videoId,
                dislikedBy: req.user?._id
            })
            if (!newDislikeDoc)
                throw new ApiError(409, "Failed to dislike current video, but removed its like")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newDislikeDoc, "disliked video and removed like succesfully")
                )
        }
    }
    else if (!existingLike && existingDislike) {

        const deleteDislike = await Dislike.findByIdAndDelete(existingDislike._id)

        if (!deleteDislike)
            throw new ApiError(409, "Failed to remove dislike from video")

        if (action === "like") {
            // delete existingDislike, create like doc

            const newLikeDoc = await Like.create({
                video: videoId,
                likedBy: req.user?._id
            })
            if (!newLikeDoc)
                throw new ApiError(409, "Failed to like current video, but removed its dislike")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newLikeDoc, "liked video and removed dislike succesfully")
                )
        }
        else {
            //  just delete existing dislike
            return res
                .status(200)
                .json(
                    new ApiResponse(200, deleteDislike, "Removed dislike succesfully")
                )

        }
    }
    else {
        if (action === "like") {
            // just make new like
            const newLikeDoc = await Like.create({
                video: videoId,
                likedBy: req.user?._id
            })
            if (!newLikeDoc)
                throw new ApiError(409, "Failed to like current video")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newLikeDoc, "liked video succesfully")
                )
        }
        else {
            // just make new dislike

            const newDislikeDoc = await Dislike.create({
                video: videoId,
                dislikedBy: req.user?._id
            })
            if (!newDislikeDoc)
                throw new ApiError(409, "Failed to dislike current video")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newDislikeDoc, "disliked video succesfully")
                )
        }
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId, action } = req.params

    if (!commentId)
        throw new ApiError(408, "Did not get comment id")

    if (!action || !["like", "dislike"].includes(action.trim()))
        throw new ApiError(408, "Did not get like or dislike action")

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    const existingDislike = await Dislike.findOne({
        comment: commentId,
        dislikedBy: req.user?._id
    })

    if (existingLike && !existingDislike) {
        const deleteLike = await Like.findByIdAndDelete(existingLike._id)
        if (!deleteLike)
            throw new ApiError(409, "Failed to remove like from comment")

        if (action === "like") {
            return res
                .status(200)
                .json(
                    new ApiResponse(200, deleteLike, "Removed like successfully")
                )
        }
        else {
            const newDislikeDoc = await Dislike.create({
                comment: commentId,
                dislikedBy: req.user?._id
            })
            if (!newDislikeDoc)
                throw new ApiError(409, "Failed to dislike comment, but removed its like")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newDislikeDoc, "Disliked comment and removed like successfully")
                )
        }
    }
    else if (!existingLike && existingDislike) {
        const deleteDislike = await Dislike.findByIdAndDelete(existingDislike._id)
        if (!deleteDislike)
            throw new ApiError(409, "Failed to remove dislike from comment")

        if (action === "like") {
            const newLikeDoc = await Like.create({
                comment: commentId,
                likedBy: req.user?._id
            })
            if (!newLikeDoc)
                throw new ApiError(409, "Failed to like comment, but removed its dislike")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newLikeDoc, "Liked comment and removed dislike successfully")
                )
        }
        else {
            return res
                .status(200)
                .json(
                    new ApiResponse(200, deleteDislike, "Removed dislike successfully")
                )
        }
    }
    else {
        if (action === "like") {
            const newLikeDoc = await Like.create({
                comment: commentId,
                likedBy: req.user?._id
            })
            if (!newLikeDoc)
                throw new ApiError(409, "Failed to like comment")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newLikeDoc, "Liked comment successfully")
                )
        }
        else {
            const newDislikeDoc = await Dislike.create({
                comment: commentId,
                dislikedBy: req.user?._id
            })
            if (!newDislikeDoc)
                throw new ApiError(409, "Failed to dislike comment")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newDislikeDoc, "Disliked comment successfully")
                )
        }
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId, action } = req.params

    if (!tweetId)
        throw new ApiError(408, "Did not get tweet id")

    if (!action || !["like", "dislike"].includes(action.trim()))
        throw new ApiError(408, "Did not get like or dislike action")

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    const existingDislike = await Dislike.findOne({
        tweet: tweetId,
        dislikedBy: req.user?._id
    })

    if (existingLike && !existingDislike) {
        const deleteLike = await Like.findByIdAndDelete(existingLike._id)
        if (!deleteLike)
            throw new ApiError(409, "Failed to remove like from tweet")

        if (action === "like") {
            return res
                .status(200)
                .json(
                    new ApiResponse(200, deleteLike, "Removed like successfully")
                )
        }
        else {
            const newDislikeDoc = await Dislike.create({
                tweet: tweetId,
                dislikedBy: req.user?._id
            })
            if (!newDislikeDoc)
                throw new ApiError(409, "Failed to dislike tweet, but removed its like")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newDislikeDoc, "Disliked tweet and removed like successfully")
                )
        }
    }
    else if (!existingLike && existingDislike) {
        const deleteDislike = await Dislike.findByIdAndDelete(existingDislike._id)
        if (!deleteDislike)
            throw new ApiError(409, "Failed to remove dislike from tweet")

        if (action === "like") {
            const newLikeDoc = await Like.create({
                tweet: tweetId,
                likedBy: req.user?._id
            })
            if (!newLikeDoc)
                throw new ApiError(409, "Failed to like tweet, but removed its dislike")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newLikeDoc, "Liked tweet and removed dislike successfully")
                )
        }
        else {
            return res
                .status(200)
                .json(
                    new ApiResponse(200, deleteDislike, "Removed dislike successfully")
                )
        }
    }
    else {
        if (action === "like") {
            const newLikeDoc = await Like.create({
                tweet: tweetId,
                likedBy: req.user?._id
            })
            if (!newLikeDoc)
                throw new ApiError(409, "Failed to like tweet")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newLikeDoc, "Liked tweet successfully")
                )
        }
        else {
            const newDislikeDoc = await Dislike.create({
                tweet: tweetId,
                dislikedBy: req.user?._id
            })
            if (!newDislikeDoc)
                throw new ApiError(409, "Failed to dislike tweet")

            return res
                .status(200)
                .json(
                    new ApiResponse(200, newDislikeDoc, "Disliked tweet successfully")
                )
        }
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    // We will have the userId of logged in user (this will be a protected route)
    // get all those like docs having likedBy = userId
    // un sab docs me, har ek doc ke liye, uss doc ke andar ke video id ko `Video` me find karke uske pure details include karke dena hai
    // we have to send back the following data for every video:
    // Thumbnail , videUrl , Title , views , time of upload , channel name 

    // IT'S AGGREGATIN' TIME BABY!!!

    const pipeline = [
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "channel"
                        }
                    },
                    {
                        $unwind: "$channel"
                    },
                    {
                        $project: {
                            thumbnail: 1,
                            title: 1,
                            videoFile: 1,
                            duration: 1,
                            views: 1,
                            "channel.username": 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$likedVideos"
        },
        {
            $replaceRoot: { newRoot: "$likedVideos" }
        }
    ]

    if (!pipeline.length)
        throw new ApiError(409, "Failed to build aggregation pipeline")

    const likedVideos = await Like.aggregate(pipeline)

    if (!likedVideos)
        throw new ApiResponse(205, {}, "No like videos of the user")

    return res
        .status(200)
        .json(
            new ApiResponse(200, likedVideos, "Liked videos fetched succesfully")
        )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}