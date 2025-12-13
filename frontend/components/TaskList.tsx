"use client";

import { GET_TASKS } from "@/graphql/queries";
import { UPDATE_TASK_STATUS } from "@/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client/react";
import { CommentsPanel } from "./CommentsPanel";


export function TaskList({ projectId }: { projectId: string }) {
  const { data, loading, error } = useQuery(GET_TASKS, {
    variables: { organizationSlug: "acme", projectId },
  });

  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className='text-red-500'>Error loading tasks</p>;

  return (
    <div className='mt-4 space-y-2'>
      {data.tasks.map((task: any) => (
        <div
          key={task.id}
          className='p-3 bg-gray-50 rounded flex justify-between items-center'
        >
          <div>
            <p className='font-medium'>{task.title}</p>
            <p className='text-xs text-gray-500'>{task.assigneeEmail}</p>
          </div>
          <div>
            <CommentsPanel taskId={task.id} />
          </div>
          <select
            className='border rounded px-2 py-1 text-sm'
            value={task.status}
            onChange={(e) => {
              updateStatus({
                variables: {
                  organizationSlug: "acme",
                  taskId: task.id,
                  status: e.target.value,
                },
                optimisticResponse: {
                  updateTaskStatus: {
                    __typename: "UpdateTaskStatus",
                    task: {
                      __typename: "TaskType",
                      id: task.id,
                      status: e.target.value,
                    },
                  },
                },
                refetchQueries: ["GetProjects"], // 👈 THIS LINE
              });
            }}
          >
            <option value='TODO'>TODO</option>
            <option value='IN_PROGRESS'>IN PROGRESS</option>
            <option value='DONE'>DONE</option>
          </select>
        </div>
      ))}
    </div>
  );
}
