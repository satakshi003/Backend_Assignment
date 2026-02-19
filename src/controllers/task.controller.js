import mongoose, { isValidObjectId } from "mongoose"
import {Task} from "../models/task.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTask = asyncHandler(async(req, res) => {
  const {title, description} = req.body;

  if (!title  || title.trim().length === 0){
    throw new ApiError(400, "Task  Title is Required");
  }
  const task = await Task.create({
    description,
    title,
    owner: req.user._id
  });

  return res
  .status(201)
  .json(new ApiResponse(201, task, "Task created successfully"))
});

const getUserTasks = asyncHandler(async (req, res) => {

  let tasks;

  if (req.user.role === "admin") {
    tasks = await Task.find().sort({ createdAt: -1 });
  } else {
    tasks = await Task.find({
      owner: req.user._id
    }).sort({ createdAt: -1 });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      tasks,
      "Tasks fetched successfully"
    )
  );
});

const updateTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params;
    const {title} = req.body;

    if(!isValidObjectId(taskId)){
      throw new ApiError(400, "Invalid")
    }
     if (!title || title.trim().length === 0) {
        throw new ApiError(400, "Task title cannot be empty");
    }
    const task = await Task.findById(taskId);
    if(!task){
      throw new ApiError(404, "Task not found");
    }
    if(task.owner.toString() !== req.user._id.toString()  &&
    req.user.role !== "admin"){
      throw new ApiError(403, "You are not allowed to update this task");
    }
    task.title = title.trim();

    await task.save();

    return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params;
    if(!isValidObjectId(taskId)){
      throw new ApiError(400, "Invalid Task ID")
    }
    const task = await Task.findById(taskId);
    if(!task){
      throw new ApiError(404, "Task not found")
    }
    if(task.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"){
      throw new ApiError(403, "You are not allowed to delete this task");
    }
    await Task.findByIdAndDelete(taskId);

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask
}
