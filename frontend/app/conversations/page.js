"use client";

import { useState, useEffect } from "react";
import { conversationApi } from "@/lib/api";
import {
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  MessageCircle,
  X,
  Sparkles,
} from "lucide-react";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await conversationApi.listConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          💬 Conversations Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Explore all your conversations.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading conversations...
          </p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 bg-white/70 dark:bg-gray-900/70 rounded-2xl border border-gray-200/40 dark:border-gray-800/40 backdrop-blur-md">
          <div className="text-7xl mb-4">📭</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No conversations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start chatting to see your conversation logs here.
          </p>
        </div>
      ) : (
        // Grid layout
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className="group cursor-pointer bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200/40 dark:border-gray-800/40 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Title & Status */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {conversation.title}
                  </h3>
                  <span
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      conversation.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    }`}
                  >
                    {conversation.status === "active" ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Ended
                      </>
                    )}
                  </span>
                </div>

                {/* Summary */}
                {conversation.summary && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {conversation.summary}
                  </p>
                )}

                {/* Message Preview */}
                {conversation.messages && conversation.messages.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {conversation.messages.slice(0, 2).map((msg) => (
                      <div
                        key={msg.id}
                        className={`text-sm p-2 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-blue-50 dark:bg-blue-900/40"
                            : "bg-gray-100 dark:bg-gray-800/60"
                        }`}
                      >
                        <span className="font-semibold text-xs text-gray-600 dark:text-gray-400 mr-1">
                          {msg.sender === "user" ? "You:" : "AI:"}
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 line-clamp-1">
                          {msg.content}
                        </span>
                      </div>
                    ))}
                    {conversation.messages.length > 2 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        +{conversation.messages.length - 2} more messages
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {conversation.messages?.length || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(conversation.start_time).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full view */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 p-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedConversation.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedConversation.status === "active"
                    ? "🟢 Active"
                    : "🔴 Inactive"}
                </p>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* 🔮 Enhanced Summary Section */}
              {selectedConversation.summary && (
                <div className="relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-blue-950 shadow-md">
                  {/* Gradient strip */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

                  <div className="p-5 space-y-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        AI Summary
                      </h4>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {selectedConversation.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                        {selectedConversation.messages?.length || 0} Messages
                      </span>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                        {selectedConversation.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {selectedConversation.messages && (
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Messages ({selectedConversation.messages.length})
                  </h4>
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-xl ${
                          message.sender === "user"
                            ? "bg-blue-50 dark:bg-blue-900/40 ml-auto max-w-[85%]"
                            : "bg-gray-100 dark:bg-gray-800/60 mr-auto max-w-[85%]"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-xs text-gray-600 dark:text-gray-400">
                            {message.sender === "user" ? "You" : "AI"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
