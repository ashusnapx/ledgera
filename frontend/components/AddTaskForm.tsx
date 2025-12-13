"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_TASK } from "@/graphql/queries";

export function AddTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("");
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: ["GetTasks", "GetProjects"],
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;

        createTask({
          variables: {
            organizationSlug: "acme",
            projectId,
            title,
          },
          optimisticResponse: {
            createTask: {
              __typename: "CreateTask",
              task: {
                __typename: "TaskType",
                id: "temp-id",
                title,
                status: "TODO",
                assigneeEmail: "",
              },
            },
          },
        });

        setTitle("");
      }}
      className='flex gap-2 mt-2'
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='New task title'
        className='flex-1 border rounded px-2 py-1 text-sm'
      />
      <button className='bg-green-600 text-white px-3 rounded text-sm'>
        + Add
      </button>
    </form>
  );
}
