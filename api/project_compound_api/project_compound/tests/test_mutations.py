from django.test import TestCase
from project_compound.models import Project
from project_compound.schema import schema


class MutationTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            name="ALZ-2024",
            description="Beta-amyloid inhibitor for Alzheimer's disease"
        )

    def test_create_project(self):
        mutation = """
        mutation {
            createProject(name: "ONC-789", description: "EGFR kinase inhibitor") {
                id
                name
                description
            }
        }
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.errors)
        self.assertEqual(result.data['createProject']['name'], "ONC-789")
        self.assertEqual(result.data['createProject']['description'], "EGFR kinase inhibitor")
        self.assertTrue(Project.objects.filter(name="ONC-789").exists())

    def test_update_project(self):
        mutation = f"""
        mutation {{
            updateProject(id: "{self.project.id}", name: "Updated Name", description: "Updated Description") {{
                id
                name
                description
            }}
        }}
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.errors)
        self.assertEqual(result.data['updateProject']['name'], "Updated Name")
        self.assertEqual(result.data['updateProject']['description'], "Updated Description")

    def test_update_project_with_invalid_id(self):
        mutation = """
        mutation {
            updateProject(id: "99999", name: "Updated Name", description: "Updated Description") {
                id
            }
        }
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.data)
        self.assertIsNotNone(result.errors)
        self.assertEqual(result.errors[0].message, "Project matching query does not exist.")

    def test_delete_project(self):
        project_id = self.project.id
        project_name = self.project.name
        project_description = self.project.description
        mutation = f"""
        mutation {{
            deleteProject(id: "{project_id}") {{
                id
                name
                description
            }}
        }}
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.errors)
        self.assertEqual(result.data['deleteProject']['id'], str(project_id))
        self.assertEqual(result.data['deleteProject']['name'], project_name)
        self.assertEqual(result.data['deleteProject']['description'], project_description)

    def test_delete_project_with_invalid_id(self):
        mutation = """
        mutation {
            deleteProject(id: "99999") {
                id
            }
        }
        """
        result = schema.execute_sync(mutation)
        self.assertIsNone(result.data)
        self.assertIsNotNone(result.errors)
        self.assertEqual(result.errors[0].message, "Project matching query does not exist.")

