'use client';

import { useState, useRef, useEffect } from 'react';
import { conversationApi } from '@/lib/api';

export default function IntelligencePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('intelligenceSearchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const data = await conversationApi.queryConversations(query);
      setResults(data);

      const newHistory = [query, ...searchHistory.filter((q) => q !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('intelligenceSearchHistory', JSON.stringify(newHistory));

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error querying conversations:', error);
      alert('Failed to query conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Conversation Intelligence
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Ask questions about your past conversations and get AI-powered insights
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ask about your conversations
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="E.g., 'What did we discuss about machine learning?' or 'Summarize conversations from last week'"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {loading ? 'Searching...' : 'Query Conversations'}
          </button>
        </form>

        {searchHistory.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((historyQuery, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors duration-200"
                  title={historyQuery}
                >
                  {historyQuery.length > 30 ? `${historyQuery.slice(0, 30)}...` : historyQuery}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Analyzing your conversations...</p>
          </div>
        </div>
      )}

      {results && !loading && (
        <div ref={resultsRef} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Query Results
            </h2>
            {results.response ? (
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {results.response}
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No response from the API.
              </p>
            )}
          </div>
        </div>
      )}

      {!loading && !results && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to explore your conversations
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Use the search box above to find and analyze specific topics from your chat history
          </p>
        </div>
      )}
    </div>
  );
}
