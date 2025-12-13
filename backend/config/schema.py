import graphene


class Query(graphene.ObjectType):
    health = graphene.String()

    def resolve_health(root, info):
        return "ok"


schema = graphene.Schema(query=Query)
