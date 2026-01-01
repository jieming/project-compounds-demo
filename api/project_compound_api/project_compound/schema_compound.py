import strawberry
from typing import List
from .models import Project, Compound
from .types import CompoundType


@strawberry.type
class CompoundQuery:
    @strawberry.field
    def compounds(self, project_id: strawberry.ID, compound_id: strawberry.ID = None) -> List[CompoundType]:
        project = Project.objects.get(id=project_id)
        compounds = Compound.objects.filter(project=project)
        
        if compound_id:
            return [compounds.get(id=compound_id)]
        
        return list(compounds)


@strawberry.type
class CompoundMutation:
    @strawberry.field
    def create_compound(
        self,
        project_id: strawberry.ID,
        smiles: str,
        mw: float = None,
        logD: float = None,
        logP: float = None
    ) -> CompoundType:
        project = Project.objects.get(id=project_id)
        compound = Compound.objects.create(
            project=project,
            smiles=smiles,
            mw=mw,
            logD=logD,
            logP=logP
        )
        return compound
    
    @strawberry.field
    def delete_compound(self, id: strawberry.ID) -> CompoundType:
        compound = Compound.objects.get(id=id)
        deleted_compound = CompoundType(
            id=compound.id,
            project=compound.project,
            smiles=compound.smiles,
            mw=compound.mw,
            logD=compound.logD,
            logP=compound.logP
        )
        compound.delete()
        return deleted_compound


compound_schema = strawberry.Schema(query=CompoundQuery, mutation=CompoundMutation)

