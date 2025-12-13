from organizations.models import Organization
from core.exceptions import OrganizationNotFound


def get_organization_or_error(slug: str) -> Organization:
    try:
        return Organization.objects.get(slug=slug)
    except Organization.DoesNotExist:
        raise OrganizationNotFound(f"Organization '{slug}' does not exist")
