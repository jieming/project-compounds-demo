from django.test import TestCase
from project_compound.models import Project
from project_compound.schema_project import project_schema as schema


class QueryTest(TestCase):
    def setUp(self):
        self.project1 = Project.objects.create(
            name="ALZ-2024",
            description="Beta-amyloid inhibitor for Alzheimer's disease"
        )
        self.project2 = Project.objects.create(
            name="ONC-789",
            description="EGFR kinase inhibitor for lung cancer"
        )
        self.project3 = Project.objects.create(
            name="DIA-456",
            description="GLP-1 agonist for Type 2 diabetes"
        )

    def test_query_all_projects(self):
        query = """
        query {
            projects {
                id
            }
        }
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.errors)
        self.assertEqual(len(result.data['projects']), 3)
        for project in result.data['projects']:
            self.assertIn('id', project)
            self.assertIsNotNone(project['id'])

    def test_query_projects_with_id(self):
        query = f"""
        query {{
            projects(id: "{self.project2.id}") {{
                id
                name
                description
            }}
        }}
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.errors)
        self.assertEqual(len(result.data['projects']), 1)
        self.assertEqual(result.data['projects'][0]['id'], str(self.project2.id))
        self.assertEqual(result.data['projects'][0]['name'], str(self.project2.name))
        self.assertEqual(result.data['projects'][0]['description'], str(self.project2.description))

    def test_query_projects_with_invalid_id(self):
        query = """
        query {
            projects(id: "99999") {
                id
            }
        }
        """
        result = schema.execute_sync(query)
        self.assertIsNone(result.data)
        self.assertIsNotNone(result.errors)
        self.assertEqual(result.errors[0].message, "Project matching query does not exist.")

