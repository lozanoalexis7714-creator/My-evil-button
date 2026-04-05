export interface DatabaseNode {
  id: string;
  name: string;
  type: 'database' | 'table' | 'column';
  children?: DatabaseNode[];
  data?: any[];
}

export interface TargetURL {
  id: string;
  url: string;
  status: 'pending' | 'scanning' | 'safe' | 'vulnerable';
  type: 'page' | 'search' | 'login' | 'form' | 'api';
  method?: 'GET' | 'POST';
  params?: string[];
  isJSGenerated?: boolean;
}

export interface ScanStats {
  payloadsSent: number;
  totalPayloads: number;
  vulnerabilitiesFound: number;
  timeElapsed: number;
  status: 'idle' | 'crawling' | 'scanning' | 'dumping' | 'completed';
  targetsFound: number;
  targetsTested: number;
}

export interface Report {
  id: string;
  site: string;
  date: string;
  database?: string;
  table?: string;
  vulnerabilitySummary: string;
  data: any[];
  type: 'single' | 'consolidated';
}
