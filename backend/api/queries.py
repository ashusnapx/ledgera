import graphene

from api.types import ProjectType
from core.organization import get_organization_or_error
from core.querysets import projects_for_org


class ProjectQuery(graphene.ObjectType):
    projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(required=True),
    )

    def resolve_projects(root, info, organization_slug):
        org = get_organization_or_error(organization_slug)
        return projects_for_org(org)
