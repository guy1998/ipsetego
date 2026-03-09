import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Home } from 'lucide-react';
import ProjectCanvas from '@/components/ProjectCanvas';
import ProjectSidebar from '@/components/ProjectSidebar';
import { useNavigate } from 'react-router-dom';

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

const ProjectsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsProjectSidebarOpen(true);
  };

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
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/experience')}>
                Experience
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Projects Section */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <ProjectCanvas onProjectSelect={handleProjectSelect} />
      </div>

      {/* Project Sidebar */}
      <ProjectSidebar 
        project={selectedProject} 
        isOpen={isProjectSidebarOpen} 
        onClose={() => setIsProjectSidebarOpen(false)} 
      />
    </div>
  );
};

export default ProjectsPage;
