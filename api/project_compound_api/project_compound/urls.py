from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from strawberry.django.views import GraphQLView
from .schema_project import project_schema
from .schema_compound import compound_schema

urlpatterns = [
    path('projects/', csrf_exempt(GraphQLView.as_view(schema=project_schema)), name='projects graphql api'),
    path('compounds/', csrf_exempt(GraphQLView.as_view(schema=compound_schema)), name='compounds graphql api'),
]
