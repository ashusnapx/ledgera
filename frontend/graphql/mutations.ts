import { gql } from "@apollo/client";

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus(
    $organizationSlug: String!
    $taskId: ID!
    $status: String!
  ) {
    updateTaskStatus(
      organizationSlug: $organizationSlug
      taskId: $taskId
      status: $status
    ) {
      task {
        id
        status
      }
    }
  }
`;
