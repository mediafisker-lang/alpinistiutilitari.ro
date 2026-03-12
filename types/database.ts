export type ResidentType = "proprietar" | "chirias";
export type ResidentStatus = "nou" | "contactat" | "validat";
export type IssueStatus = "noua" | "in_analiza" | "rezolvata";
export type CommunityType = "whatsapp" | "facebook_page" | "facebook_group";
export type UpdateVisibility = "public" | "admin";
export type VoteProposalStatus = "open" | "closed";
export type VoteChoice = "yes" | "no";

export interface Resident {
  id: string;
  full_name: string;
  building: string;
  phone: string;
  email: string;
  password_hash?: string | null;
  resident_type: ResidentType;
  consent: boolean;
  created_at: string;
  status: ResidentStatus;
}

export interface Issue {
  id: string;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  category: string;
  title: string;
  description: string;
  attachment_urls: string[];
  status: IssueStatus;
  created_at: string;
}

export interface CommunityLink {
  id: string;
  label: string;
  url: string;
  type: CommunityType;
}

export interface AssociationProgress {
  id: string;
  step_title: string;
  description: string;
  step_order: number;
  completed: boolean;
}

export interface UpdateItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  visibility: UpdateVisibility;
}

export interface VoteProposalComment {
  id: string;
  resident_name: string;
  vote_choice: VoteChoice;
  reason: string | null;
}

export interface VoteProposal {
  id: string;
  title: string;
  description: string;
  status: VoteProposalStatus;
  created_at: string;
}

export interface VoteProposalWithStats extends VoteProposal {
  yes_votes: number;
  no_votes: number;
  comments: VoteProposalComment[];
}
