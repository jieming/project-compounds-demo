from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=20, blank=False, null=False)
    description = models.CharField(max_length=200, blank=False, null=False)


class Compound(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='compounds', blank=False, null=False
    )
    smiles = models.CharField(max_length=150, blank=False, null=False)
    mw = models.FloatField(null=True, blank=True)
    logD = models.FloatField(null=True, blank=True)
    logP = models.FloatField(null=True, blank=True)
