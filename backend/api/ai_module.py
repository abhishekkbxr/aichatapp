import os
from dotenv import load_dotenv
from typing import List, Dict, Optional

try:
    from openai import OpenAI
except Exception:
    OpenAI = None  # Handle import issues gracefully

load_dotenv()


class AIIntegration:

    def __init__(self):
        self.api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
        self.client = None
        if self.api_key and OpenAI is not None:
            try:
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize OpenAI client: {e}")
        else:
            if not self.api_key:
                print("Warning: OPENAI_API_KEY not set; using simulated responses.")
            if OpenAI is None:
                print("Warning: 'openai' package not available; using simulated responses.")

    def _simulate_reply(self, messages: List[Dict[str, str]]) -> str:
        last_user = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")
        return f"[Simulated] Response to: {last_user}"

    def _simulate_summary(self, messages: List[Dict[str, str]]) -> str:
        count_user = sum(1 for m in messages if m.get("role") == "user")
        count_ai = sum(1 for m in messages if m.get("role") == "assistant")
        return f"[Simulated] Summary: {count_user} user messages, {count_ai} AI messages."

    def get_ai_response(self, messages: List[Dict[str, str]]) -> str:
        if not self.client:
            return self._simulate_reply(messages)

        try:
            resp = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "system", "content": "You are a helpful assistant."}] + messages,
                temperature=0.7,
            )
            # SDK v2: choices[0].message.content
            return resp.choices[0].message.content
        except Exception as e:
            return f"[AI error] {e}"

    def summarize_conversation(self, messages: List[Dict[str, str]]) -> str:

        if not self.client:
            return self._simulate_summary(messages)

        try:
            resp = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Summarize the following conversation in 3-5 concise bullet points."}
                ] + messages,
                temperature=0.2,
            )
            return resp.choices[0].message.content
        except Exception as e:
            return f"[AI error during summarization] {e}"

    def query_past_conversations(self, query: str, all_conversations) -> str:

        summaries = [getattr(conv, "summary", "") for conv in all_conversations if getattr(conv, "summary", "")]
        if not summaries:
            return "No past conversation summaries available to query."

        context = "\n\n---\n\n".join(summaries)

        if not self.client:
            return f"[Simulated] With context of {len(summaries)} summaries, query was: {query}"

        try:
            resp = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI assistant answering questions strictly based on the provided summaries of past conversations. If the context doesn't contain the answer, say you don't have enough information."
                    },
                    {
                        "role": "user",
                        "content": f"Context:\n{context}\n\nQuestion: {query}"
                    }
                ],
                temperature=0.3
            )
            return resp.choices[0].message.content
        except Exception as e:
            return f"[AI error during query] {e}"
