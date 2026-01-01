from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from project_compound.models import Project, Compound


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


class CompoundModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            name="Test Project",
            description="Test Description"
        )
        self.valid_smiles = "CCO"

    def test_create_compound_with_all_fields(self):
        compound = Compound.objects.create(
            project=self.project,
            smiles=self.valid_smiles,
            mw=180.16,
            logD=2.5,
            logP=1.8
        )
        
        self.assertEqual(compound.smiles, self.valid_smiles)
        self.assertEqual(compound.mw, 180.16)
        self.assertEqual(compound.logD, 2.5)
        self.assertEqual(compound.logP, 1.8)

    def test_compound_smiles_is_required(self):
        compound = Compound(project=self.project, smiles="")
        with self.assertRaises(ValidationError):
            compound.full_clean()

    def test_compound_smiles_cannot_be_null(self):
        compound = Compound(project=self.project, smiles=None)
        with self.assertRaises(ValidationError):
            compound.full_clean()

    def test_compound_project_is_required(self):
        compound = Compound(project=None, smiles=self.valid_smiles)
        with self.assertRaises((IntegrityError, ValueError)):
            compound.save()

    def test_compound_mw_can_be_null(self):
        compound = Compound.objects.create(
            project=self.project,
            smiles=self.valid_smiles,
            mw=None
        )
        self.assertIsNone(compound.mw)

    def test_compound_logD_can_be_null(self):
        compound = Compound.objects.create(
            project=self.project,
            smiles=self.valid_smiles,
            logD=None
        )
        self.assertIsNone(compound.logD)

    def test_compound_logP_can_be_null(self):
        compound = Compound.objects.create(
            project=self.project,
            smiles=self.valid_smiles,
            logP=None
        )
        self.assertIsNone(compound.logP)

    def test_compound_smiles_max_length(self):
        max_smiles = "C" * 150
        compound = Compound.objects.create(
            project=self.project,
            smiles=max_smiles
        )
        self.assertEqual(len(compound.smiles), 150)

    def test_compound_smiles_exceeds_max_length(self):
        """Test that smiles exceeding max_length raises ValidationError."""
        long_smiles = "C" * 151
        compound = Compound(project=self.project, smiles=long_smiles)
        with self.assertRaises(ValidationError):
            compound.full_clean()

    def test_compound_cascade_delete(self):
        compound = Compound.objects.create(
            project=self.project,
            smiles=self.valid_smiles
        )
        compound_id = compound.id
        
        # Delete the project
        self.project.delete()
        
        # Compound should be deleted as well
        self.assertFalse(Compound.objects.filter(id=compound_id).exists())

    def test_multiple_compounds_per_project(self):
        """Test that a project can have multiple compounds."""
        compound1 = Compound.objects.create(
            project=self.project,
            smiles="CCO"
        )
        compound2 = Compound.objects.create(
            project=self.project,
            smiles="CCN"
        )
        
        compounds = self.project.compounds.all()
        self.assertEqual(compounds.count(), 2)
        self.assertIn(compound1, compounds)
        self.assertIn(compound2, compounds)

