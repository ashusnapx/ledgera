import graphene

from api.queries import ProjectQuery, TaskQuery
from api.mutations import (
    CreateProject,
    UpdateProject,
    CreateTask,
    UpdateTaskStatus,
)



class Query(ProjectQuery, TaskQuery, graphene.ObjectType):
    health = graphene.String()

    def resolve_health(self, info):
        return "ok"
    
class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()



schema = graphene.Schema(query=Query, mutation=Mutation)
