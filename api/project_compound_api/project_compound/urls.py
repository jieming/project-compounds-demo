from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from strawberry.django.views import GraphQLView
from .schema import schema

urlpatterns = [
    path('projects/', csrf_exempt(GraphQLView.as_view(schema=schema)), name='projects graphql api'),
]
