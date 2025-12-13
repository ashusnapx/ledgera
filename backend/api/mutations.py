import graphene

from api.types import ProjectType, TaskType, OrganizationType
from projects.models import Project
from tasks.models import Task
from core.organization import get_organization_or_error
from core.querysets import validate_project_belongs_to_org
from comments.models import TaskComment
from core.querysets import validate_task_belongs_to_org
from organizations.models import Organization
from django.utils.text import slugify

class CreateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        due_date = graphene.Date()

    def mutate(
        self,
        info,
        organization_slug,
        name,
        description=None,
        due_date=None,
    ):
        org = get_organization_or_error(organization_slug)

        project = Project.objects.create(
            organization=org,
            name=name,
            description=description or "",
            status=Project._meta.get_field("status").default,
            due_date=due_date,
        )

        return CreateProject(project=project)

class UpdateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        organization_slug = graphene.String(required=True)
        project_id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    def mutate(self, info, organization_slug, project_id, **kwargs):
        org = get_organization_or_error(organization_slug)

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise Exception("Project not found")

        validate_project_belongs_to_org(project, org)

        for field, value in kwargs.items():
            if value is not None:
                setattr(project, field, value)

        project.save()
        return UpdateProject(project=project)

class CreateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        organization_slug = graphene.String(required=True)
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    def mutate(self, info, organization_slug, project_id, title, **kwargs):
        org = get_organization_or_error(organization_slug)

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise Exception("Project not found")

        validate_project_belongs_to_org(project, org)

        task = Task.objects.create(
            project=project,
            title=title,
            description=kwargs.get("description", ""),
            assignee_email=kwargs.get("assignee_email", ""),
            due_date=kwargs.get("due_date"),
        )

        return CreateTask(task=task)

class UpdateTaskStatus(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        organization_slug = graphene.String(required=True)
        task_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    def mutate(self, info, organization_slug, task_id, status):
        org = get_organization_or_error(organization_slug)

        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise Exception("Task not found")

        validate_project_belongs_to_org(task.project, org)

        task.status = status
        task.save()

        return UpdateTaskStatus(task=task)

class AddTaskComment(graphene.Mutation):
    comment = graphene.Field(lambda: graphene.NonNull(graphene.String))

    class Arguments:
        organization_slug = graphene.String(required=True)
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    def mutate(self, info, organization_slug, task_id, content, author_email):
        org = get_organization_or_error(organization_slug)

        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise Exception("Task not found")

        validate_task_belongs_to_org(task, org)

        comment = TaskComment.objects.create(
            task=task,
            content=content,
            author_email=author_email,
        )

        return AddTaskComment(comment=comment.content)

class CreateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)

    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    def mutate(self, info, name, contact_email):
        base_slug = slugify(name)
        slug = base_slug
        counter = 1

        while Organization.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        organization = Organization.objects.create(
            name=name,
            slug=slug,
            contact_email=contact_email,
        )

        return CreateOrganization(organization=organization)