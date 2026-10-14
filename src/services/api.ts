import { ChatApiRequest, ChatApiResponse } from '../types/chat';

/**
 * Retrieves the base URL for the backend API from environment variables.
 * Falls back to http://localhost:8000 for standard local FastAPI development.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://127.0.0.1:8001';
};

export class ApiError extends Error {
  public status?: number;
  public isConnectionRefused: boolean;

  constructor(message: string, status?: number, isConnectionRefused: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isConnectionRefused = isConnectionRefused;
  }
}

/**
 * Sends a question to the backend FastAPI RAG endpoint.
 * POST /chat
 * Body: { "question": string }
 * Expected Response: { "answer": string, "sources": (string | { title?: string, url: string })[] }
 */
export async function sendChatQuestion(question: string): Promise<ChatApiResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/chat`;

  const payload: ChatApiRequest = {
    question: question.trim(),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
      } catch {
        errorDetail = await response.text().catch(() => '');
      }

      const statusText = response.statusText ? ` (${response.statusText})` : '';
      throw new ApiError(
        errorDetail
          ? `Backend responded with error ${response.status}${statusText}: ${errorDetail}`
          : `Server error ${response.status}${statusText} when reaching ${endpoint}`,
        response.status
      );
    }

    const data: ChatApiResponse = await response.json();

    if (!data || typeof data.answer !== 'string') {
      throw new ApiError(
        `Unexpected response format from backend. Expected JSON with "answer" and "sources", received: ${JSON.stringify(
          data
        )}`
      );
    }

    return {
      answer: data.answer,
      sources: Array.isArray(data.sources) ? data.sources : [],
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network connection errors (e.g. Failed to fetch / connection refused)
    const err = error as Error;
    const isNetworkIssue =
      err.message.includes('Failed to fetch') ||
      err.message.includes('NetworkError') ||
      err.message.includes('Network request failed') ||
      err.name === 'TypeError';

    if (isNetworkIssue) {
      throw new ApiError(
        `Could not connect to the EduGuide AI backend at "${endpoint}". Please make sure your Python FastAPI server is running and CORS is enabled.`,
        undefined,
        true
      );
    }

    throw new ApiError(err.message || 'An unexpected error occurred while communicating with the backend.');
  }
}
