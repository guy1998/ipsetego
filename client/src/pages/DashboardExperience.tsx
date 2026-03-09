import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  category: string;
}

const DashboardExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: '2024-03',
      isCurrentlyWorking: true,
      description: 'Lead frontend development for SaaS products, mentoring junior developers.',
    },
    {
      id: '2',
      title: 'Full-Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      startDate: '2020-06',
      endDate: '2021-12',
      isCurrentlyWorking: false,
      description: 'Built full-stack applications using React, Node.js, and PostgreSQL.',
    },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 5, category: 'Frontend' },
    { id: '2', name: 'TypeScript', level: 5, category: 'Languages' },
    { id: '3', name: 'Node.js', level: 4, category: 'Backend' },
    { id: '4', name: 'MongoDB', level: 4, category: 'Databases' },
    { id: '5', name: 'Python', level: 3, category: 'Languages' },
  ]);

  // Experience Modal State
  const [isExpCreateOpen, setIsExpCreateOpen] = useState(false);
  const [isExpEditOpen, setIsExpEditOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expFormData, setExpFormData] = useState<Partial<Experience>>({});

  // Skill Modal State
  const [isSkillCreateOpen, setIsSkillCreateOpen] = useState(false);
  const [isSkillEditOpen, setIsSkillEditOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillFormData, setSkillFormData] = useState<Partial<Skill>>({});

  // Experience Handlers
  const handleCreateExpOpen = () => {
    setExpFormData({ isCurrentlyWorking: false });
    setIsExpCreateOpen(true);
  };

  const handleEditExpOpen = (exp: Experience) => {
    setEditingExp(exp);
    setExpFormData(exp);
    setIsExpEditOpen(true);
  };

  const handleSaveExp = () => {
    if (editingExp) {
      setExperiences(
        experiences.map(e =>
          e.id === editingExp.id ? { ...editingExp, ...expFormData } : e
        ) as Experience[]
      );
      setIsExpEditOpen(false);
    } else {
      const newExp: Experience = {
        id: Date.now().toString(),
        title: expFormData.title || 'Job Title',
        company: expFormData.company || 'Company',
        location: expFormData.location || '',
        startDate: expFormData.startDate || '',
        endDate: expFormData.endDate || '',
        isCurrentlyWorking: expFormData.isCurrentlyWorking || false,
        description: expFormData.description || '',
      };
      setExperiences([...experiences, newExp]);
      setIsExpCreateOpen(false);
    }
  };

  const handleDeleteExp = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  // Skill Handlers
  const handleCreateSkillOpen = () => {
    setSkillFormData({ level: 3, category: '' });
    setIsSkillCreateOpen(true);
  };

  const handleEditSkillOpen = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormData(skill);
    setIsSkillEditOpen(true);
  };

  const handleSaveSkill = () => {
    if (editingSkill) {
      setSkills(
        skills.map(s =>
          s.id === editingSkill.id ? { ...editingSkill, ...skillFormData } : s
        ) as Skill[]
      );
      setIsSkillEditOpen(false);
    } else {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: skillFormData.name || 'Skill',
        level: skillFormData.level || 3,
        category: skillFormData.category || 'Others',
      };
      setSkills([...skills, newSkill]);
      setIsSkillCreateOpen(false);
    }
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const getLevelLabel = (level: number) => {
    const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
    return levels[level - 1] || 'Intermediate';
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 5:
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 4:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 3:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 2:
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 1:
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Experience & Skills</h1>
        <p className="text-muted-foreground mt-2">
          Showcase your professional background and expertise.
        </p>
      </div>

      <Tabs defaultValue="experience" className="space-y-6">
        <TabsList>
          <TabsTrigger value="experience">Work Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Work Experience</h2>
            <Dialog open={isExpCreateOpen} onOpenChange={setIsExpCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateExpOpen} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Work Experience</DialogTitle>
                  <DialogDescription>
                    Add a new position to your work history
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exp-title">Job Title</Label>
                      <Input
                        id="exp-title"
                        placeholder="Senior Developer"
                        value={expFormData.title || ''}
                        onChange={(e) =>
                          setExpFormData({
                            ...expFormData,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exp-company">Company</Label>
                      <Input
                        id="exp-company"
                        placeholder="Company Name"
                        value={expFormData.company || ''}
                        onChange={(e) =>
                          setExpFormData({
                            ...expFormData,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exp-location">Location</Label>
                    <Input
                      id="exp-location"
                      placeholder="City, Country"
                      value={expFormData.location || ''}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exp-start">Start Date</Label>
                      <Input
                        id="exp-start"
                        type="month"
                        value={expFormData.startDate || ''}
                        onChange={(e) =>
                          setExpFormData({
                            ...expFormData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exp-end">End Date</Label>
                      <Input
                        id="exp-end"
                        type="month"
                        disabled={expFormData.isCurrentlyWorking}
                        value={expFormData.endDate || ''}
                        onChange={(e) =>
                          setExpFormData({
                            ...expFormData,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="exp-current"
                      type="checkbox"
                      checked={expFormData.isCurrentlyWorking || false}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          isCurrentlyWorking: e.target.checked,
                          endDate: e.target.checked ? '' : expFormData.endDate,
                        })
                      }
                    />
                    <Label htmlFor="exp-current">Currently Working Here</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exp-description">Description</Label>
                    <textarea
                      id="exp-description"
                      placeholder="Describe your responsibilities and achievements"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      rows={4}
                      value={expFormData.description || ''}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsExpCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveExp}>Add Experience</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Experience List */}
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <Card className="p-12 border-border/20 text-center">
                <p className="text-muted-foreground mb-4">
                  No work experience yet
                </p>
                <Button onClick={handleCreateExpOpen}>
                  Add Your First Experience
                </Button>
              </Card>
            ) : (
              experiences.map((exp) => (
                <Card key={exp.id} className="p-6 border-border/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    {exp.isCurrentlyWorking && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.startDate} -{' '}
                      {exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                    </div>
                  </div>

                  <p className="text-sm mb-4">{exp.description}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditExpOpen(exp)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteExp(exp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Edit Experience Modal */}
          <Dialog open={isExpEditOpen} onOpenChange={setIsExpEditOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Work Experience</DialogTitle>
                <DialogDescription>
                  Update your work history details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-exp-title">Job Title</Label>
                    <Input
                      id="edit-exp-title"
                      placeholder="Senior Developer"
                      value={expFormData.title || ''}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-exp-company">Company</Label>
                    <Input
                      id="edit-exp-company"
                      placeholder="Company Name"
                      value={expFormData.company || ''}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-exp-location">Location</Label>
                  <Input
                    id="edit-exp-location"
                    placeholder="City, Country"
                    value={expFormData.location || ''}
                    onChange={(e) =>
                      setExpFormData({
                        ...expFormData,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-exp-start">Start Date</Label>
                    <Input
                      id="edit-exp-start"
                      type="month"
                      value={expFormData.startDate || ''}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-exp-end">End Date</Label>
                    <Input
                      id="edit-exp-end"
                      type="month"
                      disabled={expFormData.isCurrentlyWorking}
                      value={expFormData.endDate || ''}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="edit-exp-current"
                    type="checkbox"
                    checked={expFormData.isCurrentlyWorking || false}
                    onChange={(e) =>
                      setExpFormData({
                        ...expFormData,
                        isCurrentlyWorking: e.target.checked,
                        endDate: e.target.checked ? '' : expFormData.endDate,
                      })
                    }
                  />
                  <Label htmlFor="edit-exp-current">
                    Currently Working Here
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-exp-description">Description</Label>
                  <textarea
                    id="edit-exp-description"
                    placeholder="Describe your responsibilities and achievements"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    rows={4}
                    value={expFormData.description || ''}
                    onChange={(e) =>
                      setExpFormData({
                        ...expFormData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsExpEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveExp}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Skills</h2>
            <Dialog open={isSkillCreateOpen} onOpenChange={setIsSkillCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateSkillOpen} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                  <DialogDescription>
                    Add a skill to showcase your expertise
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-name">Skill Name</Label>
                    <Input
                      id="skill-name"
                      placeholder="e.g., React"
                      value={skillFormData.name || ''}
                      onChange={(e) =>
                        setSkillFormData({
                          ...skillFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skill-category">Category</Label>
                    <Input
                      id="skill-category"
                      placeholder="e.g., Frontend, Backend"
                      value={skillFormData.category || ''}
                      onChange={(e) =>
                        setSkillFormData({
                          ...skillFormData,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skill-level">Proficiency Level</Label>
                    <select
                      id="skill-level"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={skillFormData.level || 3}
                      onChange={(e) =>
                        setSkillFormData({
                          ...skillFormData,
                          level: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="1">Beginner</option>
                      <option value="2">Novice</option>
                      <option value="3">Intermediate</option>
                      <option value="4">Advanced</option>
                      <option value="5">Expert</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsSkillCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSkill}>Add Skill</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Skills List */}
          <div className="space-y-4">
            {skills.length === 0 ? (
              <Card className="p-12 border-border/20 text-center">
                <p className="text-muted-foreground mb-4">No skills yet</p>
                <Button onClick={handleCreateSkillOpen}>
                  Add Your First Skill
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <Card key={skill.id} className="p-4 border-border/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {skill.category}
                        </p>
                      </div>
                      <Badge className={getLevelColor(skill.level)}>
                        {getLevelLabel(skill.level)}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditSkillOpen(skill)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Edit Skill Modal */}
          <Dialog open={isSkillEditOpen} onOpenChange={setIsSkillEditOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Skill</DialogTitle>
                <DialogDescription>Update your skill details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-skill-name">Skill Name</Label>
                  <Input
                    id="edit-skill-name"
                    placeholder="e.g., React"
                    value={skillFormData.name || ''}
                    onChange={(e) =>
                      setSkillFormData({
                        ...skillFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-skill-category">Category</Label>
                  <Input
                    id="edit-skill-category"
                    placeholder="e.g., Frontend, Backend"
                    value={skillFormData.category || ''}
                    onChange={(e) =>
                      setSkillFormData({
                        ...skillFormData,
                        category: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-skill-level">Proficiency Level</Label>
                  <select
                    id="edit-skill-level"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    value={skillFormData.level || 3}
                    onChange={(e) =>
                      setSkillFormData({
                        ...skillFormData,
                        level: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">Beginner</option>
                    <option value="2">Novice</option>
                    <option value="3">Intermediate</option>
                    <option value="4">Advanced</option>
                    <option value="5">Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsSkillEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveSkill}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardExperience;
