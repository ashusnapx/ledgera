import graphene

from api.types import ProjectType
from core.organization import get_organization_or_error
from core.querysets import projects_for_org

from api.types import TaskType
from projects.models import Project
from core.querysets import (
    tasks_for_org,
    validate_project_belongs_to_org,
)


class ProjectQuery(graphene.ObjectType):
    projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(required=True),
    )

    def resolve_projects(self, info, organization_slug):
        org = get_organization_or_error(organization_slug)
        return projects_for_org(org)

class TaskQuery(graphene.ObjectType):
    tasks = graphene.List(
        TaskType,
        organization_slug=graphene.String(required=True),
        project_id=graphene.ID(required=True),
    )

    def resolve_tasks(self, info, organization_slug, project_id):
        org = get_organization_or_error(organization_slug)

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise Exception("Project not found")

        validate_project_belongs_to_org(project, org)

        return tasks_for_org(org).filter(project=project)

