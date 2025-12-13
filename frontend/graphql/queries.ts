import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!) {
    projects(organizationSlug: $organizationSlug) {
      id
      name
      status
      taskCount
      completedTasks
      completionRate
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($organizationSlug: String!, $projectId: ID!) {
    tasks(organizationSlug: $organizationSlug, projectId: $projectId) {
      id
      title
      status
      assigneeEmail
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($organizationSlug: String!, $taskId: ID!) {
    taskComments(organizationSlug: $organizationSlug, taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;