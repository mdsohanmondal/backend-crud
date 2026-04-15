import prisma from '../../utils/prisma';

// CREATE
export const createTask = async (userId: string, data: any) => {
  if (!data.title) {
    throw new Error('Title is required');
  }

  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status || 'pending',
      userId,
    },
  });
};

// GET ALL (user specific)
export const getTasks = async (userId: string) => {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

// GET BY ID (with ownership check)
export const getTaskById = async (userId: string, taskId: number) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};

// UPDATE (ownership protected)
export const updateTask = async (userId: string, taskId: number, data: any) => {
  const existing = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existing) {
    throw new Error('Task not found');
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      status: data.status ?? existing.status,
    },
  });
};

// DELETE (ownership protected)
export const deleteTask = async (userId: string, taskId: number) => {
  const existing = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existing) {
    throw new Error('Task not found');
  }

  return await prisma.task.delete({
    where: { id: taskId },
  });
};
