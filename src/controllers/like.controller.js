import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId)
        throw new ApiError(408, "Did not get video id or such video with given id does not exist")
    //TODO: toggle like on video

    // When video is liked , doc with vidid and userId is created
    // When video is disliked, we find the doc having vidId and delete it

    const existingLike = await Like.findOne({ 
        video: videoId,
        likedBy: req.user?._id 
    })

    if (!existingLike) {
        // video is not liked, like it
        const likeDoc = await Like.create({
            likedBy: req.user?._id,
            video: videoId
        })
        
        if (!likeDoc)
            throw new ApiError(500, "Failed to like this video")
            
        return res
            .status(200)
            .json(
                new ApiResponse(200, likeDoc, `Video with id: ${videoId} liked succesfully`)
            )
    } else {
        // video is liked, delete it (dis-like)
        const deleted = await Like.findByIdAndDelete(existingLike._id)

        if (!deleted)
            throw new ApiError(500, "Failed to delete this video")
            
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, `Dislike operation for video id ${videoId} executed successfully`)
            )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

    const existingLike = await Like.findOne({ 
        comment: commentId,
        likedBy: req.user?._id 
    })

    if (!existingLike) {
        // video is not liked, like it
        const commentDoc = await Like.create({
            likedBy: req.user?._id,
            comment: commentId
        })
        
        if (!commentDoc)
            throw new ApiError(409, "Failed to like this comment")
            
        return res
            .status(200)
            .json(
                new ApiResponse(200, commentDoc, `Comment with id: ${commentId} liked succesfully`)
            )
    } else {
        // video is liked, delete it (dis-like)
        const deleted = await Like.findByIdAndDelete(existingLike._id)

        if (!deleted)
            throw new ApiError(409, "Failed to delete this comment")
            
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, `Dislike operation for comment id ${commentId} executed successfully`)
            )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
    const existingLike = await Like.findOne({ 
        tweet: tweetId,
        likedBy: req.user?._id 
    })

    if (!existingLike) {
        // video is not liked, like it
        const tweetDoc = await Like.create({
            likedBy: req.user?._id,
            tweet: tweetId
        })
        
        if (!tweetDoc)
            throw new ApiError(409, "Failed to like this tweet")
            
        return res
            .status(200)
            .json(
                new ApiResponse(200, tweetDoc, `Tweet with id: ${tweetId} liked succesfully`)
            )
        }
    else {
        // video is liked, delete it (dis-like)
        const deleted = await Like.findByIdAndDelete(existingLike._id)

        if (!deleted)
            throw new ApiError(409, "Failed to delete this tweet")
            
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, `Dislike operation for tweet id ${tweetId} executed successfully`)
            )
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