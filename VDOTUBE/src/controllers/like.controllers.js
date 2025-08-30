import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js"; // assuming you have a Tweet model
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Toggle like on a video
 */
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    user: req.user._id,
    video: videoId,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
  }

  const newLike = await Like.create({
    user: req.user._id,
    video: videoId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newLike, "Video liked successfully"));
});

/**
 * @desc Toggle like on a comment
 */
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existingLike = await Like.findOne({
    user: req.user._id,
    comment: commentId,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully"));
  }

  const newLike = await Like.create({
    user: req.user._id,
    comment: commentId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newLike, "Comment liked successfully"));
});

/**
 * @desc Toggle like on a tweet
 */
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existingLike = await Like.findOne({
    user: req.user._id,
    tweet: tweetId,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
  }

  const newLike = await Like.create({
    user: req.user._id,
    tweet: tweetId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newLike, "Tweet liked successfully"));
});

/**
 * @desc Get all liked videos by logged-in user
 */
const getLikedVideos = asyncHandler(async (req, res) => {
  const likes = await Like.find({ user: req.user._id, video: { $exists: true } })
    .populate("video")
    .sort({ createdAt: -1 });

  const likedVideos = likes.map(like => like.video);

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
};
