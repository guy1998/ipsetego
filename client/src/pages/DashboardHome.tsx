import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Award, Eye, Plus, Settings } from 'lucide-react';
import CVUploader from '@/components/CVUploader';
import { Api } from '@/api/api';
import { BACKEND_URL } from '@/lib/constants';

const DashboardHome = () => {
  const navigate = useNavigate();
  const api = Api.getInstance();

  const [userName, setUserName] = useState('');
  const [pictureId, setPictureId] = useState<string | undefined>(undefined);
  const [projectsCount, setProjectsCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, experienceRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/project/list'),
          api.get('/experience/list'),
        ]);

        const user = profileRes.data.data;
        const projects: any[] = projectsRes.data.data || [];
        const experiences: any[] = experienceRes.data.data || [];

        const name = `${user.name || ''} ${user.lastname || ''}`.trim();
        setUserName(name);
        if (user.pictureId) setPictureId(user.pictureId);
        setProjectsCount(projects.length);
        setExperienceCount(experiences.length);

        const skills: any[] = Array.isArray(user.skills) ? user.skills : [];
        setSkillsCount(skills.length);

        if (user.resumeId) {
          setResumeId(user.resumeId);
        }

        // Profile completion: 4 criteria × 25% each
        const hasExperiences = experiences.length > 0;
        const hasProjects = projects.length > 0;
        const hasSocialLinks = !!(user.linkedin || user.github || user.xing);
        const hasSkills = skills.length > 0;
        const completion = [hasExperiences, hasProjects, hasSocialLinks, hasSkills].filter(Boolean).length * 25;
        setProfileCompletion(completion);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center gap-4">
        {pictureId ? (
          <img
            src={`${BACKEND_URL}/uploads/image/${pictureId}`}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-primary">
              {userName ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
            </span>
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}</h1>
          <p className="text-muted-foreground text-lg">
            Manage your portfolio, projects, and experience in one place.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-border/20 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Projects</p>
              <p className="text-3xl font-bold">{projectsCount}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/20 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Experience</p>
              <p className="text-3xl font-bold">{experienceCount}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Award className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/20 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Skills</p>
              <p className="text-3xl font-bold">{skillsCount}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Settings className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/20 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Profile Complete</p>
              <p className="text-3xl font-bold">{profileCompletion}%</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Section */}
        <Card className="p-6 border-border/20 hover:border-primary/50 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Projects
              </h3>
              <Badge variant="secondary">{projectsCount}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Showcase your best work and highlight your technical skills.
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => navigate('/app/dashboard/projects')}
              >
                View Projects
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/app/dashboard/projects')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Experience Section */}
        <Card className="p-6 border-border/20 hover:border-primary/50 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Experience & Skills
              </h3>
              <Badge variant="secondary">{experienceCount}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Add your work experience, education, and skills to stand out.
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => navigate('/app/dashboard/experience')}
              >
                Manage Experience
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/app/dashboard/experience')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 border-border/20">
        <h3 className="text-lg font-bold mb-4">Getting Started</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Add your first project</p>
              <p className="text-sm text-muted-foreground">
                Showcase a project you're proud of with description and links.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Add your experience</p>
              <p className="text-sm text-muted-foreground">
                Include your work history, education, and certifications.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Add your skills</p>
              <p className="text-sm text-muted-foreground">
                List your technical and professional skills with proficiency levels.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Preview your portfolio</p>
              <p className="text-sm text-muted-foreground">
                See how your portfolio looks to visitors and make adjustments.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* CV Uploader */}
      <CVUploader
        resumeId={resumeId}
        onUploadSuccess={(newResumeId) => setResumeId(newResumeId)}
      />
    </div>
  );
};

export default DashboardHome;
