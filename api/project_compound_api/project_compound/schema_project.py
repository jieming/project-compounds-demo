import strawberry
from typing import List
from .models import Project
from .types import ProjectType


@strawberry.type
class ProjectQuery:
    @strawberry.field
    def projects(self, id: strawberry.ID = None) -> List[ProjectType]:
        if id:
            return [Project.objects.get(id=id)]
        
        return Project.objects.all()


@strawberry.type
class ProjectMutation:
    @strawberry.field
    def create_project(self, name: str, description: str) -> ProjectType:
        project = Project.objects.create(name=name, description=description)
        return project
    
    @strawberry.field
    def update_project(self, id: strawberry.ID, name: str, description: str) -> ProjectType:
        project = Project.objects.get(id=id)
        project.name = name
        project.description = description
        project.save()
        return project

    @strawberry.field
    def delete_project(self, id: strawberry.ID) -> ProjectType:
        project = Project.objects.get(id=id)
        deleted_project = ProjectType(
            id=project.id,
            name=project.name,
            description=project.description
        )
        project.delete()
        return deleted_project


project_schema = strawberry.Schema(query=ProjectQuery, mutation=ProjectMutation)

