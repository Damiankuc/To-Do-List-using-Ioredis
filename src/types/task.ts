export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskDTO {
  description: string;
}

export interface UpdateTaskDTO {
  completed?: boolean;
  description?: string;
}
