from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from .ai_module import AIIntegration

ai_integration = AIIntegration()

class ConversationList(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def get(self, request, *args, **kwargs):

        conversations = self.get_queryset()

        return super().get(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        try:
            # Ensure we have a title in the request
            if 'title' not in request.data:
                return Response(
                    {"error": "title field is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                # Create the conversation
                conversation = serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(
                    serializer.data, 
                    status=status.HTTP_201_CREATED, 
                    headers=headers
                )
            else:
                return Response(
                    serializer.errors, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ConversationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

class MessageList(APIView):
    def post(self, request, pk):
        try:
            conversation = Conversation.objects.get(pk=pk)
        except Conversation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user_message_content = request.data.get('content')
        if not user_message_content:
            return Response({"error": "Content is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Save user message
        user_message = Message.objects.create(
            conversation=conversation,
            content=user_message_content,
            sender='user'
        )

        # Get conversation history formatted for OpenAI
        messages = conversation.messages.order_by('timestamp')
        messages_for_ai = [
            {
                'role': 'user' if msg.sender == 'user' else 'assistant',
                'content': msg.content
            }
            for msg in messages
        ]

        # Get AI response
        ai_response_content = ai_integration.get_ai_response(messages_for_ai)

        # Save AI message
        Message.objects.create(
            conversation=conversation,
            content=ai_response_content,
            sender='ai'
        )

        return Response(ConversationSerializer(conversation).data)

class EndConversation(APIView):
    def post(self, request, pk):
        try:
            conversation = Conversation.objects.get(pk=pk)
        except Conversation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Get conversation history formatted for OpenAI
        messages = conversation.messages.order_by('timestamp')
        messages_for_ai = [
            {
                'role': 'user' if msg.sender == 'user' else 'assistant',
                'content': msg.content
            }
            for msg in messages
        ]

        # Generate summary
        summary = ai_integration.summarize_conversation(messages_for_ai)

        # Update conversation
        conversation.summary = summary
        conversation.status = 'ended'
        conversation.save()

        return Response(ConversationSerializer(conversation).data)


class QueryPastConversations(APIView):
    def post(self, request):
        query = request.data.get('query')
        if not query:
            return Response({"error": "Query is required"}, status=status.HTTP_400_BAD_REQUEST)

        conversations = Conversation.objects.filter(status='ended')
        # In a real app, you'd pass more structured data to the AI
        response = ai_integration.query_past_conversations(query, conversations)
        return Response({"response": response})