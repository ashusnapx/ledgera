from graphql import GraphQLError
from core.exceptions import OrganizationNotFound, CrossOrganizationAccess


def graphql_error_from_exception(exc: Exception):
    if isinstance(exc, OrganizationNotFound):
        return GraphQLError(str(exc))
    if isinstance(exc, CrossOrganizationAccess):
        return GraphQLError("Access denied for this organization")
    return GraphQLError("Unexpected server error")
