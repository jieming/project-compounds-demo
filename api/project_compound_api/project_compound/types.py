import strawberry
from strawberry_django import type
from .models import Project, Compound

@type(Project)
class ProjectType:
    id: strawberry.ID
    name: str
    description: str


@type(Compound)
class CompoundType:
    id: strawberry.ID
    project: ProjectType
    smiles: str
    mw: float | None
    logD: float | None
    logP: float | None