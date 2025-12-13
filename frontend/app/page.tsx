"use client";
import { GET_PROJECTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client/react";
import { TaskList } from "@/components/TaskList";
import { AddTaskForm } from "@/components/AddTaskForm";
import { OrgSwitcher } from "@/components/OrgSwitcher";
import { useOrg } from "@/context/OrgContext";


export default function ProjectDashboard() {
  const { orgSlug } = useOrg();
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: { organizationSlug: orgSlug },
  });

  if (loading) return <div className='p-6'>Loading projects...</div>;
  if (error)
    return <div className='p-6 text-red-500'>Error loading projects</div>;

  return (
    <main className='p-6 grid gap-4'>
      <div className='p-4 flex justify-end'>
        <OrgSwitcher />
      </div>

      {data.projects.map((project: any) => (
        <div
          key={project.id}
          className='p-4 rounded-xl shadow bg-white flex justify-between'
        >
          <div>
            <h2 className='font-semibold'>{project.name}</h2>
            <AddTaskForm projectId={project.id} />
            <p className='text-sm text-gray-500'>{project.status}</p>
          </div>

          <div className='mt-2'>
            <TaskList projectId={project.id} />
          </div>

          <div className='text-sm text-right'>
            <p>{project.taskCount} tasks</p>
            <p>{project.completionRate}% complete</p>
          </div>
        </div>
      ))}
    </main>
  );
}
