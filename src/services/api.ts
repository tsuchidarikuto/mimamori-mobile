const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ElderlyPerson {
  id: number;
  last_name: string;
  first_name: string;
  age: number;
}

export interface RawConversation {
  id: number;
  elderly_person_id: number;
  timestamp: string;
  speaker: string;
  content: string;
}

export interface EmotionalDataPoint {
  time: string;
  score: number;
  label: string;
}

export interface DailySummary {
  id: number;
  elderly_person_id: number;
  date: string;
  summary_text: string;
  emotional_state: string;
  health_summary: string;
  conversation_count: number;
  emotional_graph: EmotionalDataPoint[];
}

export interface DashboardData {
  elderlyPerson: ElderlyPerson | null;
  dailySummary: DailySummary | null;
  conversations: RawConversation[];
}

export interface ConversationListResponse {
  conversations: RawConversation[];
  total_count: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(url);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; message?: string }> {
    return this.request('/health');
  }

  async getElderlyPerson(personId: number): Promise<ElderlyPerson> {
    return this.request(`/api/v1/elderly/${personId}`);
  }

  async getConversations(
    personId: number,
    date: string
  ): Promise<ConversationListResponse> {
    return this.request(
      `/api/v1/elderly/${personId}/conversations?date=${date}`
    );
  }

  async getDailySummary(
    personId: number,
    date: string
  ): Promise<DailySummary> {
    return this.request(
      `/api/v1/elderly/${personId}/summaries?date=${date}`
    );
  }

  async generateDailySummary(
    personId: number,
    date?: string,
    overwrite: boolean = false
  ): Promise<DailySummary> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    params.append('overwrite', overwrite.toString());

    return this.request(
      `/api/v1/elderly/${personId}/summaries?${params.toString()}`,
      { method: 'POST' }
    );
  }

  async getDashboardData(
    personId: number,
    date: string
  ): Promise<DashboardData> {    
    return this.request(
      `/api/v1/elderly/${personId}/dashboard?date=${date}`
    );
  }

}

export const apiClient = new ApiClient();