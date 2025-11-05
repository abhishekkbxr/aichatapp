"use client";

import { useState, useEffect } from "react";
import { conversationApi } from "@/lib/api";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { Loader2, Plus, Menu, X } from "lucide-react";

export default function ChatPage() {
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await conversationApi.listConversations();
      setConversations(data);
      if (data.length > 0 && !conversation) await loadConversation(data[0].id);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadConversation = async (id) => {
    try {
      setLoading(true);
      const data = await conversationApi.getConversation(id);
      setConversation(data);
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoading(false);
      setSidebarOpen(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const title = `Chat ${new Date().toLocaleString()}`;
      const newConversation = await conversationApi.createConversation(title);
      setConversations([newConversation, ...conversations]);
      await loadConversation(newConversation.id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || !conversation) return;

    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    try {
      setSending(true);
      const updatedConversation = await conversationApi.sendMessage(
        conversation.id,
        content
      );
      setConversation(updatedConversation);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
      setConversation((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m.id !== userMessage.id),
      }));
    } finally {
      setSending(false);
    }
  };

  const handleEndConversation = async () => {
    if (!conversation || conversation.status === "ended") return;
    if (!confirm("End this conversation?")) return;

    try {
      // Immediately reflect UI change
      setConversation((prev) => ({
        ...prev,
        status: "ended",
        summary: null, // summary will appear after AI generates
      }));

      setGeneratingSummary(true);

      // Call backend to end chat and generate summary
      const updatedConversation = await conversationApi.endConversation(
        conversation.id
      );
      setConversation(updatedConversation);
    } catch (error) {
      console.error("Error ending conversation:", error);
      alert("Failed to end conversation.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } w-72 flex flex-col shadow-lg`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Conversations
          </h2>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={handleNewConversation}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  conversation?.id === conv.id
                    ? "bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 shadow"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                    {conv.title}
                  </div>
                  {conv.status === "active" ? (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-[10px] rounded-full font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-[10px] rounded-full font-medium">
                      Ended
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(conv.start_time).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {conversation?.title || "Select a Chat"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {conversation?.status === "ended" ? (
                  <span className="text-red-500">● Ended</span>
                ) : conversation ? (
                  <span className="text-green-500">● Active</span>
                ) : null}
              </p>
            </div>
          </div>

          {conversation?.status === "active" && (
            <button
              onClick={handleEndConversation}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              End Chat
            </button>
          )}
        </header>

        {/* Chat Flow */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : conversation ? (
          <>
            <MessageList messages={conversation.messages} sending={sending} />

            {/* Summary Section */}
            {/* Summary Section */}
            {conversation.status === "ended" && (
              <div className="px-4 py-6 flex flex-col items-center w-full">
                <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-md animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-600 dark:text-blue-300 font-semibold">
                      🤖 AI Summary
                    </span>
                    {generatingSummary && (
                      <Loader2 className="animate-spin w-4 h-4 text-blue-600" />
                    )}
                  </div>

                  {/* When AI is still generating summary */}
                  {generatingSummary ? (
                    <p className="text-gray-600 dark:text-gray-300 text-sm italic flex items-center gap-2">
                      AI is generating your summary
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" />
                      </span>
                    </p>
                  ) : conversation.summary ? (
                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                      {conversation.summary}
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                      Summary not available yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            {conversation.status === "active" ? (
              <div className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={sending}
                />
              </div>
            ) : (
              <div className="p-4 text-center text-gray-600 dark:text-gray-400 bg-gray-100/60 dark:bg-gray-900/60">
                This conversation has ended. You can review the summary above or
                start a new chat anytime.
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome to AI Chat
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm md:text-base">
              Start a new conversation to begin chatting
            </p>
            <button
              onClick={handleNewConversation}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-xl"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
