import graphene

from api.queries import ProjectQuery, TaskQuery, TaskCommentQuery, OrganizationQuery

from api.mutations import (
    CreateProject,
    UpdateProject,
    CreateTask,
    UpdateTaskStatus,
    AddTaskComment,
    CreateOrganization
)



class Query(OrganizationQuery, ProjectQuery, TaskQuery, TaskCommentQuery, graphene.ObjectType):
    health = graphene.String()

    def resolve_health(self, info):
        return "ok"
    
class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
    add_task_comment = AddTaskComment.Field()



schema = graphene.Schema(query=Query, mutation=Mutation)
