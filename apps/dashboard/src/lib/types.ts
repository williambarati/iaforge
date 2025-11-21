export type TopSpender = {
  developerId: string;
  totalTokens: number;
  projects: string[];
};

export type DailyTrendPoint = {
  date: string;
  tokensIn: number;
  tokensOut: number;
};

export type AlertItem = {
  severity: string;
  message: string;
  projectId: string;
  developerId: string;
  payload: Record<string, unknown>;
};

export type EventItem = {
  eventId: string;
  projectId: string;
  developerId: string;
  ide: string;
  eventType: string;
  promptTokens: number;
  completionTokens: number;
  timestamp: string;
};

export type EventsResponse = {
  projectId: string;
  items: EventItem[];
};

export type TopSpendersResponse = {
  items: TopSpender[];
};

export type DailyTrendResponse = {
  points: DailyTrendPoint[];
};

export type AlertsResponse = {
  alerts: AlertItem[];
};
