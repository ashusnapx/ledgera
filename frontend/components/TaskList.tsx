"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { motion } from "framer-motion";

import { GET_TASKS } from "@/graphql/queries";
import { UPDATE_TASK_STATUS } from "@/graphql/mutations";
import { CommentsPanel } from "./CommentsPanel";
import { useOrg } from "@/context/OrgContext";

import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeEmail?: string;
}

interface GetTasksData {
  tasks: Task[];
}

interface GetTasksVars {
  organizationSlug: string;
  projectId: string;
}

/* ================= STATUS STYLES ================= */

const taskStyles: Record<TaskStatus, string> = {
  TODO: "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40",
  IN_PROGRESS:
    "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",
  DONE: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40",
};

/* ================= COMPONENT ================= */

export function TaskList({ projectId }: { projectId: string }) {
  const { orgSlug } = useOrg();

  const { data, loading, error } = useQuery<GetTasksData, GetTasksVars>(
    GET_TASKS,
    {
      variables: {
        organizationSlug: orgSlug,
        projectId,
      },
    }
  );

  const [updateStatus] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: ["GetProjects"],
  });

  if (loading)
    return <p className='text-sm text-muted-foreground'>Loading tasks…</p>;

  if (error)
    return <p className='text-sm text-destructive'>Error loading tasks</p>;

  return (
    <div className='mt-4 space-y-2'>
      {data?.tasks.map((task) => (
        <motion.div
          key={task.id}
          layout
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "rounded-lg border p-3 flex justify-between items-start",
            taskStyles[task.status]
          )}
        >
          {/* Left */}
          <div className='space-y-1'>
            <p className='text-sm font-medium leading-tight'>{task.title}</p>

            {task.assigneeEmail && (
              <p className='text-xs text-muted-foreground'>
                {task.assigneeEmail}
              </p>
            )}

            <CommentsPanel taskId={task.id} status={task.status} />
          </div>

          {/* Right */}
          <select
            className='rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring'
            value={task.status}
            onChange={(e) => {
              const newStatus = e.target.value as TaskStatus;

              updateStatus({
                variables: {
                  organizationSlug: orgSlug,
                  taskId: task.id,
                  status: newStatus,
                },
                optimisticResponse: {
                  updateTaskStatus: {
                    __typename: "UpdateTaskStatus",
                    task: {
                      __typename: "TaskType",
                      id: task.id,
                      status: newStatus,
                    },
                  },
                },
              });
            }}
          >
            <option value='TODO'>TODO</option>
            <option value='IN_PROGRESS'>IN PROGRESS</option>
            <option value='DONE'>DONE</option>
          </select>
        </motion.div>
      ))}
    </div>
  );
}
