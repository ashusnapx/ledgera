"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_TASK } from "@/graphql/queries";
import { useOrg } from "@/context/OrgContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("");
  const { orgSlug } = useOrg();

  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: ["GetTasks", "GetProjects"],
  });

  return (
    <form
      className='flex gap-2'
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;

        createTask({
          variables: {
            organizationSlug: orgSlug,
            projectId,
            title,
          },
        });

        setTitle("");
      }}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Add a task…'
        className='h-8'
      />

      <Button size='sm' variant={"outline"} className="cursor-pointer">Add</Button>
    </form>
  );
}
