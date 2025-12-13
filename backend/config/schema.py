import graphene

from api.queries import ProjectQuery, TaskQuery


class Query(ProjectQuery, TaskQuery, graphene.ObjectType):
    health = graphene.String()

    def resolve_health(self, info):
        return "ok"


schema = graphene.Schema(query=Query)
