"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS } from "@/graphql/queries";
import { useOrg } from "@/context/OrgContext";
import { TaskList } from "@/components/TaskList";
import { AddTaskForm } from "@/components/AddTaskForm";
import { TopBar } from "@/components/TopBar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  status: string;
  taskCount: number;
  completionRate: number;
}

export default function ProjectDashboard() {
  const { orgSlug } = useOrg();

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: { organizationSlug: orgSlug },
  });

  if (loading) return <div className='p-6 text-sm'>Loading…</div>;
  if (error)
    return (
      <div className='p-6 text-sm text-destructive'>
        Failed to load projects
      </div>
    );

  return (
    <>
      <TopBar />

      <main className='mx-auto max-w-6xl space-y-6 p-6'>
        {data.projects.map((project: Project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <div>
                  <h2 className='text-sm font-medium'>{project.name}</h2>
                  <p className='text-xs text-muted-foreground'>
                    {project.status}
                  </p>
                </div>

                <div className='text-right text-xs text-muted-foreground'>
                  <p>{project.taskCount} tasks</p>
                  <p>{project.completionRate}% complete</p>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <AddTaskForm projectId={project.id} />
                <TaskList projectId={project.id} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </main>
    </>
  );
}
