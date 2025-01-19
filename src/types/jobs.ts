export interface Job {
  id: string;
  company_name: string;
  company_logo_url: string;
  job_title: string;
  location: string;
  job_type: string;
  salary_range: string;
  description: string;
  requirements: string[];
  posted_at: string;
}