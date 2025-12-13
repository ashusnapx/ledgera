"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROJECT } from "@/graphql/mutations";
import { useOrg } from "@/context/OrgContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateProjectDialog() {
  const { orgSlug } = useOrg();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
    refetchQueries: ["GetProjects"],
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'>+ New Project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <form
          className='space-y-3'
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;

            createProject({
              variables: {
                organizationSlug: orgSlug,
                name,
                description,
              },
            });

            setName("");
            setDescription("");
          }}
        >
          <Input
            placeholder='Project name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder='Description (optional)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className='flex justify-end'>
            <Button type='submit' disabled={loading}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
