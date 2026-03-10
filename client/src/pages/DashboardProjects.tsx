import React, { useState, useEffect } from 'react';
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
import { Plus, Edit2, Trash2, ExternalLink, Github, Loader2 } from 'lucide-react';
import { Api } from '@/api/api';
import { BACKEND_URL } from '@/lib/constants';
import { toast } from 'sonner';

const api = Api.getInstance();

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  relatedLink?: string;
  githubUrl?: string;
  imageId?: string;
  year?: string;
}

const DashboardProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [newTechnology, setNewTechnology] = useState<string>('');
  const [editNewTechnology, setEditNewTechnology] = useState<string>('');

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const response = await api.get('/project/list');
      if (response.data.data) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateOpen = () => {
    setFormData({});
    setImageFile(null);
    setImagePreview('');
    setNewTechnology('');
    setIsCreateOpen(true);
  };

  const handleEditOpen = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setImageFile(null);
    setImagePreview('');
    setEditNewTechnology('');
    setIsEditOpen(true);
  };

  const addTechnology = (tech: string) => {
    const trimmedTech = tech.trim();
    if (trimmedTech && !formData.technologies?.includes(trimmedTech)) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), trimmedTech],
      });
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index) || [],
    });
  };

  const addEditTechnology = (tech: string) => {
    const trimmedTech = tech.trim();
    if (trimmedTech && !formData.technologies?.includes(trimmedTech)) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), trimmedTech],
      });
      setEditNewTechnology('');
    }
  };

  const removeEditTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index) || [],
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (projectId: string, file: File, isUpdate: boolean = false) => {
    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append('projectImage', file);

      const endpoint = isUpdate ? `/project/update-image/${projectId}` : `/project/upload-image/${projectId}`;
      const response = await api.post(endpoint, formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSaveProject = async () => {
    try {
      setLoading(true);

      if (!formData.title) {
        toast.error('Please enter a project title');
        return;
      }

      if (editingProject) {
        // Update existing project
        const updateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          technologies: formData.technologies,
          relatedLink: formData.relatedLink,
          year: formData.year,
        };

        await api.put(`/project/update/${editingProject.id}`, updateData);

        // Upload new image if selected
        if (imageFile) {
          await uploadImage(editingProject.id, imageFile, true);
        }

        toast.success('Project updated successfully');
        setIsEditOpen(false);
      } else {
        // Create new project
        const projectData = {
          title: formData.title,
          description: formData.description,
          category: formData.category || '',
          technologies: formData.technologies || [],
          relatedLink: formData.relatedLink,
          year: formData.year,
        };

        const createResponse = await api.post('/project/new-project', projectData);
        const newProject = createResponse.data.data;

        // Upload image if selected
        if (imageFile) {
          await uploadImage(newProject.id, imageFile, false);
        }

        toast.success('Project created successfully');
        setIsCreateOpen(false);
      }

      // Refresh projects list
      await fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save project';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this project?')) {
        return;
      }

      await api.delete(`/project/${id}`);
      toast.success('Project deleted successfully');
      await fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete project';
      toast.error(errorMessage);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      'bg-green-500/10 text-green-700 dark:text-green-400',
      'bg-amber-500/10 text-amber-700 dark:text-amber-400',
      'bg-pink-500/10 text-pink-700 dark:text-pink-400',
      'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
    ];
    // Use hash of category string to pick a consistent color
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = ((hash << 5) - hash) + category.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getPublicImageUrl = (pictureId: string) => {
    return `${BACKEND_URL}/uploads/image/${pictureId}`;
  };

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Label htmlFor="title">Project Title *</Label>
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
                <Input
                  id="category"
                  placeholder="e.g., Web Development, Graphic Design, Writing"
                  value={formData.category || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies - For IT users</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter technology (e.g., React)"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology(newTechnology);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addTechnology(newTechnology)}
                    className="flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.technologies && formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="gap-1 px-3 py-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedLink">Demo/Live URL</Label>
                <Input
                  id="relatedLink"
                  placeholder="https://example.com"
                  value={formData.relatedLink || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, relatedLink: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  placeholder="2024"
                  value={formData.year || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <div className="border-2 border-dashed border-border/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById('image-input')?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded" />
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
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
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
            {project.imageId && (
              <div className="mb-4 -mx-6 -mt-6">
                <img
                  src={getPublicImageUrl(project.imageId)}
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
            </div>

            {/* Category Badge */}
            <div className="mb-3">
              <Badge className={getCategoryColor(project.category)}>
                {project.category.charAt(0).toUpperCase() +
                  project.category.slice(1)}
              </Badge>
            </div>

            {/* Year */}
            {project.year && (
              <div className="mb-3 text-xs text-muted-foreground">
                Year: {project.year}
              </div>
            )}

            {/* Technologies */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {project.technologies?.map((tech) => (
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
            {project.relatedLink && (
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <a href={project.relatedLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </Button>
              </div>
            )}

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
              <Input
                id="edit-category"
                placeholder="e.g., Web Development, Graphic Design, Writing"
                value={formData.category || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies - For IT users</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter technology (e.g., React)"
                  value={editNewTechnology}
                  onChange={(e) => setEditNewTechnology(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addEditTechnology(editNewTechnology);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addEditTechnology(editNewTechnology)}
                  className="flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.technologies && formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 px-3 py-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeEditTechnology(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-relatedLink">Demo/Live URL</Label>
              <Input
                id="edit-relatedLink"
                placeholder="https://example.com"
                value={formData.relatedLink || ''}
                onChange={(e) =>
                  setFormData({ ...formData, relatedLink: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-year">Year</Label>
              <Input
                id="edit-year"
                placeholder="2024"
                value={formData.year || ''}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Project Image</Label>
              <div className="border-2 border-dashed border-border/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('edit-image-input')?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded" />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : editingProject?.imageId ? (
                  <div className="space-y-2">
                    <img src={getPublicImageUrl(editingProject.imageId)} alt="Current" className="w-32 h-32 mx-auto object-cover rounded" />
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
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardProjects;
