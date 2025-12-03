export enum UserRole {
  STUDENT = 'student',
  COMPANY = 'company',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryRange: string;
  postedAt: string;
  description: string;
  skills: string[];
  logo: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'Applied' | 'Viewed' | 'Shortlisted' | 'Rejected' | 'Interview';
  appliedAt: string;
  matchScore: number;
}

export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  email: string;
  phone: string;
  skills: string[];
  experience: { role: string; company: string; duration: string }[];
  education: { degree: string; school: string; year: string }[];
  resumeUrl: string;
  completeness: number;
}

export const FUTURE_JOB_CATEGORIES = [
  "AI Ethics Specialist",
  "Quantum Software Engineer",
  "Climate Resilience Manager",
  "Human-AI Interaction Designer",
  "Synthetic Biology Engineer",
  "DeFi Risk Analyst"
];