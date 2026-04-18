// Types for the landing page featured representatives API

export interface TrendingIssue {
  id: string;
  issue_label: string;
  source_url?: string;
  mapped_at: string;
}

export interface FeaturedRepresentative {
  politician_id: string;
  name: string;
  photo_url: string | null;
  party: string | null;
  constituency: string | null;
  designation: string | null;
  years_in_office: number;
  trending_issues: TrendingIssue[];
}

export interface FeaturedRepresentativesResponse {
  data: FeaturedRepresentative[];
  count: number;
}
