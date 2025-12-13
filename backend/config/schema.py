import graphene
from api.queries import ProjectQuery


class Query(ProjectQuery, graphene.ObjectType):
    health = graphene.String()

    def resolve_health(root, info):
        return "ok"


schema = graphene.Schema(query=Query)
