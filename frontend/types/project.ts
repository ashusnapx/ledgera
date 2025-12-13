export interface Project {
  id: string;
  name: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  taskCount: number;
  completedTasks: number;
  completionRate: number;
}
