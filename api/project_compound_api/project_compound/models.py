from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=20, blank=False, null=False)
    description = models.CharField(max_length=200, blank=False, null=False)
