import strawberry
from strawberry_django import type
from .models import Project

@type(Project)
class ProjectType:
    id: strawberry.ID
    name: str
    description: str