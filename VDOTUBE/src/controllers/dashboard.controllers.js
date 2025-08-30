import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc   Get channel statistics (videos, subscribers, views, likes)
 */
const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id; // assuming logged-in user is the channel owner

  // total videos uploaded
  const totalVideos = await Video.countDocuments({ owner: channelId });

  // total subscribers (people subscribed to this channel)
  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

  // total video views (sum of views across all channel videos)
  const videos = await Video.find({ owner: channelId }, "views");
  const totalViews = videos.reduce((acc, vid) => acc + (vid.views || 0), 0);

  // total likes on all channel videos
  const videoIds = videos.map(v => v._id);
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalVideos, totalSubscribers, totalViews, totalLikes },
      "Channel stats fetched successfully"
    )
  );
});

/**
 * @desc   Get all videos uploaded by the channel
 */
const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user._id; // assuming logged-in user is the channel owner

  const { page = 1, limit = 10 } = req.query;

  const videos = await Video.find({ owner: channelId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Video.countDocuments({ owner: channelId });

  return res.status(200).json(
    new ApiResponse(
      200,
      { videos, total, page: Number(page), limit: Number(limit) },
      "Channel videos fetched successfully"
    )
  );
});

export { getChannelStats, getChannelVideos };
