import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * @desc   Get all videos with pagination, search and sorting
 */
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" }; // case-insensitive search by title
  }
  if (userId && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

  const videos = await Video.find(filter)
    .populate("owner", "username email avatar")
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Video.countDocuments(filter);

  return res
    .status(200)
    .json(new ApiResponse(200, { videos, total, page, limit }, "Videos fetched successfully"));
});

/**
 * @desc   Upload and publish a video
 */
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  if (!req.files || !req.files.videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  // Upload video file to cloudinary
  const videoUpload = await uploadOnCloudinary(req.files.videoFile[0].path, "video");

  if (!videoUpload?.url) {
    throw new ApiError(500, "Error uploading video");
  }

  // Upload thumbnail if provided
  let thumbnailUpload = null;
  if (req.files.thumbnail && req.files.thumbnail[0]) {
    thumbnailUpload = await uploadOnCloudinary(req.files.thumbnail[0].path, "image");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoUpload.url,
    videoPublicId: videoUpload.public_id,
    thumbnail: thumbnailUpload?.url || "",
    thumbnailPublicId: thumbnailUpload?.public_id || "",
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

/**
 * @desc   Get single video by ID
 */
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "username email avatar");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

/**
 * @desc   Update video details
 */
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  // Update thumbnail if provided
  if (req.files && req.files.thumbnail) {
    // delete old thumbnail
    if (video.thumbnailPublicId) {
      await deleteFromCloudinary(video.thumbnailPublicId);
    }
    const thumbnailUpload = await uploadOnCloudinary(req.files.thumbnail[0].path, "image");
    video.thumbnail = thumbnailUpload.url;
    video.thumbnailPublicId = thumbnailUpload.public_id;
  }

  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

/**
 * @desc   Delete video
 */
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  // delete from cloudinary
  if (video.videoPublicId) {
    await deleteFromCloudinary(video.videoPublicId);
  }
  if (video.thumbnailPublicId) {
    await deleteFromCloudinary(video.thumbnailPublicId);
  }

  await video.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

/**
 * @desc   Toggle video publish status
 */
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Video publish status updated"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
};
