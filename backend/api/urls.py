from django.urls import path
from .views import (
    ConversationList, 
    ConversationDetail, 
    MessageList, 
    EndConversation, 
    QueryPastConversations
)

urlpatterns = [
    path('conversations/', ConversationList.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', ConversationDetail.as_view(), name='conversation-detail'),
    path('conversations/<int:pk>/messages/', MessageList.as_view(), name='message-list'),
    path('conversations/<int:pk>/end/', EndConversation.as_view(), name='end-conversation'),
    path('query/', QueryPastConversations.as_view(), name='query-past-conversations')
]
