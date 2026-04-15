import { Request, Response } from 'express';
import * as TaskService from './task.service';

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const task = await TaskService.createTask(userId, req.body);

    res.status(201).json({
      message: 'Task created successfully',
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const tasks = await TaskService.getTasks(userId);

    res.json({
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const taskId = Number(req.params.id);

    const task = await TaskService.getTaskById(userId, taskId);

    res.json({
      message: 'Task fetched successfully',
      data: task,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const taskId = Number(req.params.id);

    const updated = await TaskService.updateTask(userId, taskId, req.body);

    res.json({
      message: 'Task updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const taskId = Number(req.params.id);

    await TaskService.deleteTask(userId, taskId);

    res.json({
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
