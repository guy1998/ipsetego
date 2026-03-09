import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, User } from 'lucide-react';
import projectImage1 from '@/assets/project-1.jpg';
import projectImage2 from '@/assets/project-2.jpg';
import projectImage3 from '@/assets/project-3.jpg';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'fullstack';
  year: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 h-full flex flex-col"
      onClick={() => onClick(project)}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {project.category || 'Project'}
          </Badge>
          {project.year && (
            <span className="text-xs text-muted-foreground">
              {project.year}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p>
      </div>
    </Card>
  );
};

interface ProjectCanvasProps {
  onProjectSelect: (project: Project) => void;
}

const ProjectCanvas: React.FC<ProjectCanvasProps> = ({ onProjectSelect }) => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'Real-time Collaboration Platform',
      description: 'A modern workspace platform with live editing, video calls, and team management.',
      longDescription: 'Built a comprehensive collaboration platform that supports real-time document editing, video conferencing, and team management. The platform handles 10,000+ concurrent users with WebSocket connections and implements conflict resolution for simultaneous edits. Features include document versioning, role-based permissions, and integration with popular productivity tools.',
      image: projectImage1,
      technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Redis', 'PostgreSQL', 'AWS'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/collab-platform',
      featured: true,
      category: 'fullstack',
      year: '2024'
    },
    {
      id: '2',
      title: 'E-commerce Analytics Dashboard',
      description: 'Advanced analytics dashboard for e-commerce businesses with real-time insights.',
      longDescription: 'Developed a comprehensive analytics dashboard for e-commerce businesses featuring real-time sales tracking, customer behavior analysis, and predictive analytics. The dashboard processes millions of transactions daily and provides actionable insights through interactive charts and automated reports.',
      image: projectImage2,
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'Chart.js', 'Stripe API', 'Vercel'],
      demoUrl: 'https://analytics.example.com',
      githubUrl: 'https://github.com/example/ecommerce-analytics',
      featured: true,
      category: 'web',
      year: '2023'
    },
    {
      id: '3',
      title: 'Social Media Mobile App',
      description: 'Cross-platform mobile app for content creators with AI-powered features.',
      longDescription: 'Created a cross-platform mobile application for content creators featuring AI-powered content suggestions, advanced photo/video editing tools, and monetization features. The app includes real-time messaging, live streaming capabilities, and analytics for creators to track their audience engagement.',
      image: projectImage3,
      technologies: ['React Native', 'TypeScript', 'Firebase', 'OpenAI API', 'Stripe'],
      demoUrl: 'https://app.example.com',
      githubUrl: 'https://github.com/example/social-app',
      featured: false,
      category: 'mobile',
      year: '2023'
    },
    {
      id: '4',
      title: 'AI Code Review Tool',
      description: 'Intelligent code review assistant powered by machine learning.',
      longDescription: 'Developed an AI-powered code review tool that analyzes pull requests and provides intelligent feedback on code quality, security vulnerabilities, and best practices. The tool integrates with popular version control systems and learns from team preferences to provide personalized recommendations.',
      image: projectImage1,
      technologies: ['Python', 'FastAPI', 'OpenAI API', 'GitHub API', 'Docker', 'PostgreSQL'],
      githubUrl: 'https://github.com/example/ai-code-review',
      featured: false,
      category: 'fullstack',
      year: '2024'
    },
    {
      id: '5',
      title: 'Fintech Investment Platform',
      description: 'Modern investment platform with automated portfolio management.',
      longDescription: 'Built a sophisticated fintech platform offering automated portfolio management, real-time market data, and social trading features. The platform includes risk assessment algorithms, regulatory compliance tools, and integration with multiple financial data providers.',
      image: projectImage2,
      technologies: ['React', 'TypeScript', 'Python', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
      demoUrl: 'https://invest.example.com',
      featured: false,
      category: 'web',
      year: '2022'
    },
    {
      id: '6',
      title: 'IoT Home Automation',
      description: 'Smart home ecosystem with mobile and web interfaces.',
      longDescription: 'Created a complete IoT home automation system with mobile and web interfaces for controlling smart devices, monitoring energy usage, and setting up automated routines. The system supports various protocols and includes machine learning for predictive automation.',
      image: projectImage3,
      technologies: ['React', 'React Native', 'Node.js', 'MQTT', 'InfluxDB', 'Raspberry Pi'],
      githubUrl: 'https://github.com/example/smart-home',
      featured: false,
      category: 'fullstack',
      year: '2022'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3">My Projects</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Click on any project to view full details, technologies, and links
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={onProjectSelect} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCanvas;