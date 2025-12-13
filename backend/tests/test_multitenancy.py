import pytest
from organizations.models import Organization
from projects.models import Project
from core.querysets import validate_project_belongs_to_org
from core.exceptions import CrossOrganizationAccess


@pytest.mark.django_db
def test_project_cannot_cross_organization():
    org1 = Organization.objects.create(
        name="Org One", slug="org1", contact_email="a@a.com"
    )
    org2 = Organization.objects.create(
        name="Org Two", slug="org2", contact_email="b@b.com"
    )

    project = Project.objects.create(
        organization=org1,
        name="Secret Project",
    )

    try:
        validate_project_belongs_to_org(project, org2)
        assert False, "Cross-org access should fail"
    except CrossOrganizationAccess:
        assert True
