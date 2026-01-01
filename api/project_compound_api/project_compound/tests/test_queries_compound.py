from django.test import TestCase
from project_compound.models import Project, Compound
from project_compound.schema_compound import compound_schema as schema


class CompoundQueryTest(TestCase):
    def setUp(self):
        self.project1 = Project.objects.create(
            name="ALZ-2024",
            description="Beta-amyloid inhibitor for Alzheimer's disease"
        )
        self.project2 = Project.objects.create(
            name="ONC-789",
            description="EGFR kinase inhibitor for lung cancer"
        )
        
        self.compound1 = Compound.objects.create(
            project=self.project1,
            smiles="CCO",
            mw=46.07,
            logD=0.31,
            logP=-0.31
        )
        self.compound2 = Compound.objects.create(
            project=self.project1,
            smiles="CCN",
            mw=45.08,
            logD=0.15,
            logP=-0.15
        )
        self.compound3 = Compound.objects.create(
            project=self.project2,
            smiles="CC(=O)O",
            mw=60.05
        )

    def test_query_all_compounds_for_project(self):
        query = f"""
        query {{
            compounds(projectId: "{self.project1.id}") {{
                id
                smiles
            }}
        }}
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.errors)
        self.assertEqual(len(result.data['compounds']), 2)
        compound_ids = [c['id'] for c in result.data['compounds']]
        self.assertIn(str(self.compound1.id), compound_ids)
        self.assertIn(str(self.compound2.id), compound_ids)

    def test_query_compound_with_id(self):
        query = f"""
        query {{
            compounds(projectId: "{self.project1.id}", compoundId: "{self.compound1.id}") {{
                id
                smiles
                mw
                logD
                logP
            }}
        }}
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.errors)
        self.assertEqual(len(result.data['compounds']), 1)
        compound = result.data['compounds'][0]
        self.assertEqual(compound['id'], str(self.compound1.id))
        self.assertEqual(compound['smiles'], self.compound1.smiles)
        self.assertEqual(compound['mw'], self.compound1.mw)
        self.assertEqual(compound['logD'], self.compound1.logD)
        self.assertEqual(compound['logP'], self.compound1.logP)

    def test_query_compound_with_nullable_fields(self):
        query = f"""
        query {{
            compounds(projectId: "{self.project2.id}", compoundId: "{self.compound3.id}") {{
                id
                smiles
                mw
                logD
                logP
            }}
        }}
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.errors)
        self.assertEqual(len(result.data['compounds']), 1)
        compound = result.data['compounds'][0]
        self.assertEqual(compound['id'], str(self.compound3.id))
        self.assertEqual(compound['smiles'], self.compound3.smiles)
        self.assertEqual(compound['mw'], self.compound3.mw)
        self.assertIsNone(compound['logD'])
        self.assertIsNone(compound['logP'])

    def test_query_compounds_with_invalid_project_id(self):
        query = """
        query {
            compounds(projectId: "99999") {
                id
            }
        }
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.data)
        self.assertIsNotNone(result.errors)
        self.assertEqual(result.errors[0].message, "Project matching query does not exist.")

    def test_query_compounds_with_invalid_compound_id(self):
        query = f"""
        query {{
            compounds(projectId: "{self.project1.id}", compoundId: "99999") {{
                id
            }}
        }}
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.data)
        self.assertIsNotNone(result.errors)
        self.assertEqual(result.errors[0].message, "Compound matching query does not exist.")

    def test_query_compounds_returns_only_compounds_for_specified_project(self):
        """Test that compounds query only returns compounds for the specified project."""
        query = f"""
        query {{
            compounds(projectId: "{self.project2.id}") {{
                id
                smiles
            }}
        }}
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.errors)
        self.assertEqual(len(result.data['compounds']), 1)
        self.assertEqual(result.data['compounds'][0]['id'], str(self.compound3.id))
        self.assertEqual(result.data['compounds'][0]['smiles'], self.compound3.smiles)

