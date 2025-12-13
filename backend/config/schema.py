import graphene
from api.types import OrganizationType
from organizations.models import Organization

class Query(graphene.ObjectType):
    health = graphene.String()
    organizations = graphene.List(OrganizationType)

    def resolve_health(root, info):
        return "ok"

    def resolve_organizations(root, info):
        return Organization.objects.all()


schema = graphene.Schema(query=Query)
