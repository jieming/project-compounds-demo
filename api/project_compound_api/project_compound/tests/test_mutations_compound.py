from django.test import TestCase
from project_compound.models import Project, Compound
from project_compound.schema_compound import compound_schema as schema


class CompoundMutationTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            name="ALZ-2024",
            description="Beta-amyloid inhibitor for Alzheimer's disease"
        )
        self.compound = Compound.objects.create(
            project=self.project,
            smiles="CCO",
            mw=46.07,
            logD=0.31,
            logP=-0.31
        )

    def test_create_compound(self):
        mutation = f"""
        mutation {{
            createCompound(
                projectId: "{self.project.id}",
                smiles: "CCN",
                mw: 45.08,
                logD: 0.15,
                logP: -0.15
            ) {{
                id
                smiles
                mw
                logD
                logP
            }}
        }}
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.errors)
        self.assertEqual(result.data['createCompound']['smiles'], "CCN")
        self.assertEqual(result.data['createCompound']['mw'], 45.08)
        self.assertEqual(result.data['createCompound']['logD'], 0.15)
        self.assertEqual(result.data['createCompound']['logP'], -0.15)
        self.assertTrue(Compound.objects.filter(smiles="CCN").exists())

    def test_create_compound_with_nullable_fields(self):
        mutation = f"""
        mutation {{
            createCompound(
                projectId: "{self.project.id}",
                smiles: "CC(=O)O"
            ) {{
                id
                smiles
                mw
                logD
                logP
            }}
        }}
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.errors)
        self.assertEqual(result.data['createCompound']['smiles'], "CC(=O)O")
        self.assertIsNone(result.data['createCompound']['mw'])
        self.assertIsNone(result.data['createCompound']['logD'])
        self.assertIsNone(result.data['createCompound']['logP'])

    def test_create_compound_with_invalid_project_id(self):
        mutation = """
        mutation {
            createCompound(
                projectId: "99999",
                smiles: "CCO"
            ) {
                id
            }
        }
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.data)
        self.assertIsNotNone(result.errors)
        self.assertEqual(result.errors[0].message, "Project matching query does not exist.")

    def test_delete_compound(self):
        compound_id = self.compound.id
        compound_smiles = self.compound.smiles
        compound_mw = self.compound.mw
        compound_logD = self.compound.logD
        compound_logP = self.compound.logP
        
        mutation = f"""
        mutation {{
            deleteCompound(id: "{compound_id}") {{
                id
                smiles
                mw
                logD
                logP
            }}
        }}
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.errors)
        self.assertEqual(result.data['deleteCompound']['id'], str(compound_id))
        self.assertEqual(result.data['deleteCompound']['smiles'], compound_smiles)
        self.assertEqual(result.data['deleteCompound']['mw'], compound_mw)
        self.assertEqual(result.data['deleteCompound']['logD'], compound_logD)
        self.assertEqual(result.data['deleteCompound']['logP'], compound_logP)
        self.assertFalse(Compound.objects.filter(id=compound_id).exists())

    def test_delete_compound_with_invalid_id(self):
        mutation = """
        mutation {
            deleteCompound(id: "99999") {
                id
            }
        }
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.data)
        self.assertIsNotNone(result.errors)
        self.assertEqual(result.errors[0].message, "Compound matching query does not exist.")

