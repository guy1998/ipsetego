import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Home, Calendar, MapPin, Award, Briefcase } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { useNavigate } from 'react-router-dom';

const ExperiencePage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const skills = [
    { name: 'Project Management', level: 90 },
    { name: 'Team Leadership', level: 88 },
    { name: 'Strategic Planning', level: 85 },
    { name: 'Problem Solving', level: 95 },
    { name: 'Communication', level: 92 },
    { name: 'Collaboration', level: 90 },
  ];

  const certifications = [
    { name: 'Professional Certification', issuer: 'Industry Organization', year: '2024' },
    { name: 'Advanced Diploma', issuer: 'Training Institute', year: '2023' },
    { name: 'Specialized Training', issuer: 'Professional Body', year: '2023' },
  ];

  const workExperience = [
    {
      title: 'Senior Professional Position',
      company: 'Organization Name',
      period: 'Start Date - Present',
      location: 'City, Country',
      isRemote: false,
      description: [
        'Led initiatives and managed key responsibilities',
        'Delivered significant projects and results',
        'Collaborated with cross-functional teams',
        'Mentored and developed team members',
      ],
    },
    {
      title: 'Mid-Level Position',
      company: 'Previous Organization',
      period: 'Start Date - End Date',
      location: 'Remote',
      isRemote: true,
      description: [
        'Contributed to major projects',
        'Developed and improved processes',
        'Worked with diverse teams and stakeholders',
        'Built and strengthened professional skills',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">AJ</span>
              </div>
              <span className="font-semibold ml-2">Alex Johnson</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/projects')}>
                Projects
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Experience & Skills</h1>
          <p className="text-xl text-muted-foreground">
            Professional background and expertise
          </p>
        </div>

        {/* Work Experience Section */}
        <div className="grid grid-cols-1 gap-8 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">Work Experience</h2>
            
            {workExperience.map((job, index) => (
              <Card key={index} className="p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">{job.title}</h3>
                    <p className="text-primary font-medium text-lg">{job.company}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1 justify-end">
                      <Calendar className="w-4 h-4" />
                      <span>{job.period}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 justify-end">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.isRemote && (
                      <Badge variant="outline" className="mt-2">
                        Remote
                      </Badge>
                    )}
                  </div>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  {job.description.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Skills & Expertise</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Certifications & Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                  <Badge variant="outline">Verified</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
