import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, User, Code, Star } from 'lucide-react';

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

interface ProjectSidebarProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{project.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Project Image */}
          <div className="aspect-video overflow-hidden rounded-lg">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Project Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant={project.featured ? 'default' : 'secondary'}>
                {project.featured ? (
                  <><Star className="w-3 h-3 mr-1" />Featured</>
                ) : (
                  project.category
                )}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {project.year}
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <h3 className="font-semibold mb-2">About this project</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {project.demoUrl && (
              <Button className="w-full" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" className="w-full" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View Source Code
                </a>
              </Button>
            )}
          </div>

          {/* Project Stats (Mock data) */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Project Highlights</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Development Time</span>
                <span className="font-medium">3 months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size</span>
                <span className="font-medium">4 developers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">My Role</span>
                <span className="font-medium">Lead Developer</span>
              </div>
              {project.featured && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">10,000+ active</span>
                </div>
              )}
            </div>
          </div>

          {/* Technical Challenges */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Key Challenges Solved</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Optimized performance for high concurrent users</li>
              <li>• Implemented real-time data synchronization</li>
              <li>• Built scalable architecture with microservices</li>
              <li>• Ensured cross-platform compatibility</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectSidebar;