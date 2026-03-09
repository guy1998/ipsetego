import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'fullstack';
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  image?: string; // Base64 or URL
}

const DashboardProjects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      category: 'fullstack',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      featured: true,
      image: undefined,
    },
    {
      id: '2',
      title: 'Social Media App',
      description: 'Real-time social networking application',
      category: 'web',
      technologies: ['React', 'Firebase', 'Tailwind CSS'],
      demoUrl: 'https://example.com',
      featured: false,
      image: undefined,
    },
    {
      id: '3',
      title: 'Mobile Task Manager',
      description: 'Productivity app for managing daily tasks',
      category: 'mobile',
      technologies: ['React Native', 'Firebase'],
      featured: false,
      image: undefined,
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const handleCreateOpen = () => {
    setFormData({});
    setIsCreateOpen(true);
  };

  const handleEditOpen = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsEditOpen(true);
  };

  const handleSaveProject = () => {
    if (editingProject) {
      setProjects(
        projects.map(p =>
          p.id === editingProject.id ? { ...editingProject, ...formData } : p
        )
      );
      setIsEditOpen(false);
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled Project',
        description: formData.description || '',
        category: formData.category || 'web',
        technologies: formData.technologies || [],
        demoUrl: formData.demoUrl,
        githubUrl: formData.githubUrl,
        featured: formData.featured || false,
        image: formData.image,
      };
      setProjects([...projects, newProject]);
      setIsCreateOpen(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'web':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'mobile':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'fullstack':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Showcase your best work and highlight your technical skills.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateOpen} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., E-commerce Platform"
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of your project"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.category || 'web'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as 'web' | 'mobile' | 'fullstack',
                    })
                  }
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="fullstack">Fullstack</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma separated)</Label>
                <Input
                  id="technologies"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.technologies?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technologies: e.target.value
                        .split(',')
                        .map(t => t.trim()),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  placeholder="https://example.com"
                  value={formData.demoUrl || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, demoUrl: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <div className="border-2 border-dashed border-border/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById('image-input')?.click()}
                >
                  {formData.image ? (
                    <div className="space-y-2">
                      <img src={formData.image} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded" />
                      <p className="text-sm text-muted-foreground">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drag and drop your image here</p>
                      <p className="text-xs text-muted-foreground">or click to browse</p>
                    </div>
                  )}
                </div>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject}>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="p-6 border-border/20 hover:border-primary/50 transition-colors flex flex-col"
          >
            {/* Project Image */}
            {project.image && (
              <div className="mb-4 -mx-6 -mt-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              {project.featured && (
                <Badge className="ml-2 flex-shrink-0 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                  Featured
                </Badge>
              )}
            </div>

            {/* Category Badge */}
            <div className="mb-3">
              <Badge className={getCategoryColor(project.category)}>
                {project.category.charAt(0).toUpperCase() +
                  project.category.slice(1)}
              </Badge>
            </div>

            {/* Technologies */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-2 mb-4">
              {project.demoUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className={project.demoUrl ? '' : 'flex-1'}
                  asChild
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleEditOpen(project)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <Card className="p-12 border-border/20 text-center">
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Button onClick={handleCreateOpen}>Create Your First Project</Button>
        </Card>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Project Title</Label>
              <Input
                id="edit-title"
                placeholder="e.g., E-commerce Platform"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Brief description of your project"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={formData.category || 'web'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as 'web' | 'mobile' | 'fullstack',
                  })
                }
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="fullstack">Fullstack</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-technologies">Technologies (comma separated)</Label>
              <Input
                id="edit-technologies"
                placeholder="React, Node.js, MongoDB"
                value={formData.technologies?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technologies: e.target.value
                      .split(',')
                      .map(t => t.trim()),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-demoUrl">Demo URL</Label>
              <Input
                id="edit-demoUrl"
                placeholder="https://example.com"
                value={formData.demoUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, demoUrl: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-githubUrl">GitHub URL</Label>
              <Input
                id="edit-githubUrl"
                placeholder="https://github.com/..."
                value={formData.githubUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="edit-featured"
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
              />
              <Label htmlFor="edit-featured">Featured Project</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Project Image</Label>
              <div className="border-2 border-dashed border-border/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('edit-image-input')?.click()}
              >
                {formData.image ? (
                  <div className="space-y-2">
                    <img src={formData.image} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded" />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Drag and drop your image here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                )}
              </div>
              <input
                id="edit-image-input"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, image: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardProjects;
