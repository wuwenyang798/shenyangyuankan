
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source: string;
  page_url?: string;
  type?: string;
  budget?: string;
  message?: string;
  status: LeadStatus;
  owner?: string;
  score: number;
  created_at: number;
  updated_at: number;
}
