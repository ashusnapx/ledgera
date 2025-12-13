from projects.models import Project
from tasks.models import Task
from comments.models import TaskComment
from core.exceptions import CrossOrganizationAccess


def projects_for_org(org):
    return Project.objects.filter(
        organization=org
    ).prefetch_related("tasks")



def tasks_for_org(org):
    return Task.objects.filter(project__organization=org)


def comments_for_org(org):
    return TaskComment.objects.filter(task__project__organization=org)


def validate_project_belongs_to_org(project, org):
    if project.organization_id != org.id:
        raise CrossOrganizationAccess("Project does not belong to organization")


def validate_task_belongs_to_org(task, org):
    if task.project.organization_id != org.id:
        raise CrossOrganizationAccess("Task does not belong to organization")
