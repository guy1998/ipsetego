import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Home, ExternalLink, Calendar, Code } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '@/api/api';
import { BACKEND_URL } from '@/lib/constants';

interface UserPublicInfo {
  name: string;
  lastname: string;
  pictureId?: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  category?: string;
  technologies?: string[];
  relatedLink?: string;
  imageId?: string;
  year?: string;
}

const extractPublicId = (slug: string): string | null => {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slug.match(uuidRegex);
  return match ? match[0] : null;
};

const PublicProjectsPage = () => {
  const { personalSlug } = useParams<{ personalSlug: string }>();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const api = Api.getInstance();

  const [user, setUser] = useState<UserPublicInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!personalSlug) return;
    const publicId = extractPublicId(personalSlug);
    if (!publicId) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const [userRes, projRes] = await Promise.all([
          api.get(`/user/public/${publicId}`),
          api.get(`/project/list-public/${publicId}`),
        ]);
        setUser(userRes.data.data);
        setProjects(projRes.data.data || []);
      } catch {
        // fetch failed
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [personalSlug]);

  const initials = user ? `${(user.name || '').charAt(0)}${(user.lastname || '').charAt(0)}`.toUpperCase() : '';
  const fullName = user ? `${user.name} ${user.lastname}` : '';
  const profilePicSrc = user?.pictureId ? `${BACKEND_URL}/uploads/image/${user.pictureId}` : null;

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsSidebarOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center overflow-hidden">
                {profilePicSrc ? (
                  <img src={profilePicSrc} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">{initials}</span>
                )}
              </div>
              <span className="font-semibold ml-2">{fullName}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/portfolio/${personalSlug}`)}>
                <Home className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">My Projects</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Click on any project to view full details, technologies, and links
            </p>
          </div>

          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">No projects have been added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 h-full flex flex-col"
                  onClick={() => handleProjectSelect(project)}
                >
                  <div className="aspect-video overflow-hidden bg-muted">
                    {project.imageId && (
                      <img
                        src={`${BACKEND_URL}/uploads/image/${project.imageId}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {project.category || 'Project'}
                      </Badge>
                      {project.year && (
                        <span className="text-xs text-muted-foreground">{project.year}</span>
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Sidebar */}
      {selectedProject && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left">{selectedProject.title}</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Project Image */}
              {selectedProject.imageId && (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={`${BACKEND_URL}/uploads/image/${selectedProject.imageId}`}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center space-x-2">
                {selectedProject.category && (
                  <Badge variant="secondary">{selectedProject.category}</Badge>
                )}
                {selectedProject.year && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {selectedProject.year}
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProject.description && (
                <div>
                  <h3 className="font-semibold mb-2">About this project</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedProject.description}</p>
                </div>
              )}

              {/* Technologies */}
              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Link */}
              {selectedProject.relatedLink && (
                <Button className="w-full" asChild>
                  <a href={selectedProject.relatedLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Demo
                  </a>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default PublicProjectsPage;
