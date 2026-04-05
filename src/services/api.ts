const PRODUCTION_API_BASE_URL = "https://dictionary-wtrh.onrender.com";
const isLocalDevelopmentHost = ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:";
const API_BASE_URL = (window as typeof window & { DICTIO_API_BASE_URL?: string }).DICTIO_API_BASE_URL?.trim() || (isLocalDevelopmentHost ? "http://127.0.0.1:8000" : PRODUCTION_API_BASE_URL);

export interface LexicalResponse {
  result: {
    term: string;
    lang: string;
    summary: {
      etymology: string | null;
      definitions: string[];
      synonyms: string[];
    };
  };
  debug: {
    sources_ok: number;
    sources_total: number;
    elapsed_ms: number;
    accent_retry_count: number;
    source_details: Array<{
      source: string;
      definition_count: number;
      accent_retry: boolean;
    }>;
  };
  pipeline: Array<{
    source: string;
    ok: boolean;
    elapsed_ms: number;
    error?: string;
    data: {
      definition_count: number;
      definitions: string[];
    };
    extra: {
      retry_without_accents: boolean;
      first_attempt?: boolean;
    };
  }>;
}

export interface AnalogicalResponse {
  input: {
    term: string;
    normalized_term: string;
    accentless_term: string;
  };
  source: {
    name: string;
    url: string;
    cache_hit: boolean;
  };
  entry: {
    found: boolean;
    label: string;
    term: string;
    pronunciation: string;
    grammar: string;
    sense_count: number;
    definitions: Array<{
      index: number;
      text: string;
    }>;
    etymology: string | null;
  };
  result: {
    term: string;
    found: boolean;
    sense_count: number;
    term_count: number;
    senses: Array<{
      title: string;
      term_count: number;
      classes: Array<{
        label: string;
        group_count: number;
        term_count: number;
        groups: string[][];
        terms: string[];
      }>;
    }>;
  };
  debug: {
    elapsed_ms: number;
    raw_keyword_count: number;
    empty_headings_dropped: number;
    message: string | null;
  };
}

export async function fetchLexical(term: string): Promise<LexicalResponse> {
  const response = await fetch(`${API_BASE_URL}/lexico?palavra=${encodeURIComponent(term)}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchAnalogical(term: string): Promise<AnalogicalResponse> {
  const response = await fetch(`${API_BASE_URL}/analogico?palavra=${encodeURIComponent(term)}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
