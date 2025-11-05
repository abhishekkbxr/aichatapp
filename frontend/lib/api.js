const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const conversationApi = {
  async createConversation(title) {
    const response = await fetch(`${API_BASE_URL}/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error('Failed to create conversation');
    return response.json();
  },

  async listConversations() {
    const response = await fetch(`${API_BASE_URL}/conversations/`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  },

  async getConversation(id) {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch conversation');
    return response.json();
  },

  async sendMessage(conversationId, content) {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  async endConversation(id) {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}/end/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to end conversation');
    return response.json();
  },

  async queryConversations(query) {
    const response = await fetch(`${API_BASE_URL}/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) throw new Error('Failed to query conversations');
    return response.json();
  },
};
