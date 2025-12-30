from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from project_compound.models import Project


class ProjectModelTest(TestCase):
    def setUp(self):
        self.valid_name = "Test Project"
        self.valid_description = "This is a test project description"

    def test_create_project_with_valid_data(self):
        project = Project.objects.create(
            name=self.valid_name,
            description=self.valid_description
        )
        
        self.assertIsNotNone(project.id)
        self.assertEqual(project.name, self.valid_name)
        self.assertEqual(project.description, self.valid_description)
        self.assertIsInstance(project.id, int)

    def test_project_name_is_required(self):
        project = Project(name="", description=self.valid_description)
        with self.assertRaises(ValidationError):
            project.full_clean()

    def test_project_description_is_required(self):
        project = Project(name=self.valid_name, description="")
        with self.assertRaises(ValidationError):
            project.full_clean()

    def test_project_name_cannot_be_null(self):      
        project = Project(name=None, description=self.valid_description)
        with self.assertRaises(ValidationError):
            project.full_clean()

    def test_project_description_cannot_be_null(self):
        project = Project(name=self.valid_name, description=None)
        with self.assertRaises(ValidationError):
            project.full_clean()

    def test_project_name_max_length(self):
        max_name = "a" * 20
        project = Project.objects.create(
            name=max_name,
            description=self.valid_description
        )
        self.assertEqual(len(project.name), 20)

    def test_project_description_max_length(self):
        max_description = "a" * 200
        project = Project.objects.create(
            name=self.valid_name,
            description=max_description
        )
        self.assertEqual(len(project.description), 200)

    def test_project_name_exceeds_max_length(self):
        """Test that name exceeding max_length raises ValidationError."""
        long_name = "a" * 21
        project = Project(name=long_name, description=self.valid_description)
        with self.assertRaises(ValidationError):
            project.full_clean()

    def test_project_description_exceeds_max_length(self):
        """Test that description exceeding max_length raises ValidationError."""
        long_description = "a" * 201
        project = Project(name=self.valid_name, description=long_description)
        with self.assertRaises(ValidationError):
            project.full_clean()

    def test_project_with_special_characters(self):
        """Test that project can handle special characters in name and description."""
        project = Project.objects.create(
            name="Project-123 (Test)",
            description="Description with special chars: @#$%^&*()"
        )
        
        self.assertEqual(project.name, "Project-123 (Test)")
        self.assertEqual(project.description, "Description with special chars: @#$%^&*()")

