import { Job, Application, CandidateProfile, UserRole } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'AI Ethics & Alignment Specialist',
    company: 'NeuralFrontier',
    location: 'San Francisco, CA (Remote)',
    type: 'Full-time',
    salaryRange: '$140k - $180k',
    postedAt: '2 days ago',
    description: 'Ensure our large language models adhere to safety guidelines and ethical standards.',
    skills: ['Python', 'Ethics', 'NLP', 'Policy'],
    logo: 'https://picsum.photos/id/20/48/48'
  },
  {
    id: '2',
    title: 'Quantum Algorithm Developer',
    company: 'Q-Systems',
    location: 'Boston, MA',
    type: 'Hybrid',
    salaryRange: '$160k - $220k',
    postedAt: '5 hours ago',
    description: 'Develop algorithms for our next-gen 50-qubit processor.',
    skills: ['Quantum Computing', 'Linear Algebra', 'C++', 'Python'],
    logo: 'https://picsum.photos/id/30/48/48'
  },
  {
    id: '3',
    title: 'Climate Data Scientist',
    company: 'GreenEarth Analytics',
    location: 'Berlin, Germany',
    type: 'Full-time',
    salaryRange: '€70k - €95k',
    postedAt: '1 week ago',
    description: 'Analyze satellite data to predict climate resilience patterns.',
    skills: ['Data Science', 'GIS', 'R', 'Machine Learning'],
    logo: 'https://picsum.photos/id/40/48/48'
  },
  {
    id: '4',
    title: 'Frontend Engineer',
    company: 'Doltec Internal',
    location: 'Remote',
    type: 'Contract',
    salaryRange: '$60 - $80 / hr',
    postedAt: 'Just now',
    description: 'Help build the future of hiring.',
    skills: ['React', 'Tailwind', 'TypeScript'],
    logo: 'https://picsum.photos/id/50/48/48'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: '101',
    jobId: '1',
    jobTitle: 'AI Ethics Specialist',
    company: 'NeuralFrontier',
    status: 'Interview',
    appliedAt: '2023-10-15',
    matchScore: 92
  },
  {
    id: '102',
    jobId: '2',
    jobTitle: 'Quantum Dev',
    company: 'Q-Systems',
    status: 'Rejected',
    appliedAt: '2023-10-01',
    matchScore: 65
  },
  {
    id: '103',
    jobId: '4',
    jobTitle: 'Frontend Engineer',
    company: 'Doltec Internal',
    status: 'Applied',
    appliedAt: '2023-10-25',
    matchScore: 88
  }
];

export const MOCK_CANDIDATES: CandidateProfile[] = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    headline: 'Full Stack Developer | AI Enthusiast',
    email: 'alex.r@example.com',
    phone: '+1 (555) 012-3456',
    skills: ['React', 'Node.js', 'Python', 'TensorFlow'],
    experience: [
      { role: 'Junior Developer', company: 'TechStart', duration: '2021 - Present' },
      { role: 'Intern', company: 'BigCorp', duration: '2020 - 2021' }
    ],
    education: [
      { degree: 'B.S. Computer Science', school: 'State University', year: '2021' }
    ],
    resumeUrl: '#',
    completeness: 85
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    headline: 'Data Scientist specializing in Climate Models',
    email: 's.chen@example.com',
    phone: '+1 (555) 987-6543',
    skills: ['Python', 'R', 'GIS', 'Statistics'],
    experience: [
      { role: 'Data Analyst', company: 'EcoFocus', duration: '2022 - Present' }
    ],
    education: [
      { degree: 'M.S. Data Science', school: 'Tech Institute', year: '2022' }
    ],
    resumeUrl: '#',
    completeness: 95
  }
];

export const USER_ROLES = [
  { id: UserRole.STUDENT, label: 'Student / Candidate' },
  { id: UserRole.COMPANY, label: 'Company / Employer' }
];