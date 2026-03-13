import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Home, Calendar, MapPin, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '@/api/api';
import { BACKEND_URL } from '@/lib/constants';

interface UserPublicInfo {
  name: string;
  lastname: string;
  pictureId?: string;
  skills?: { name: string; category?: string; level?: number }[];
}

interface Experience {
  id: number;
  title: string;
  company?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  location?: string;
}

interface Certification {
  id: number;
  title: string;
  year: string;
}

const extractPublicId = (slug: string): string | null => {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slug.match(uuidRegex);
  return match ? match[0] : null;
};

const formatDateRange = (startDate: string, endDate?: string, isCurrentlyWorking?: boolean): string => {
  const start = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  const end = isCurrentlyWorking || !endDate
    ? 'Present'
    : new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  return `${start} - ${end}`;
};

const PublicExperiencePage = () => {
  const { personalSlug } = useParams<{ personalSlug: string }>();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const api = Api.getInstance();

  const [user, setUser] = useState<UserPublicInfo | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personalSlug) return;
    const publicId = extractPublicId(personalSlug);
    if (!publicId) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const [userRes, expRes, certRes] = await Promise.all([
          api.get(`/user/public/${publicId}`),
          api.get(`/experience/list-public/${publicId}`),
          api.get(`/certification/list-public/${publicId}`),
        ]);
        setUser(userRes.data.data);
        setExperiences(expRes.data.data || []);
        setCertifications(certRes.data.data || []);
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
  const skills = Array.isArray(user?.skills) ? user!.skills : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading experience...</p>
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
      <div className="max-w-6xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Experience & Skills</h1>
          {experiences.length > 0 && (
            <p className="text-xl text-muted-foreground">
              {experiences.length} position{experiences.length !== 1 ? 's' : ''} in professional experience
            </p>
          )}
        </div>

        {/* Work Experience Section */}
        {experiences.length > 0 && (
          <div className="grid grid-cols-1 gap-8 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-8">Work Experience</h2>

              {experiences.map((exp) => (
                <Card key={exp.id} className="p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{exp.title}</h3>
                      {exp.company && (
                        <p className="text-primary font-medium text-lg">{exp.company}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1 justify-end">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrentlyWorking)}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center space-x-1 mt-1 justify-end">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <Card key={cert.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{cert.title}</h3>
                      <p className="text-muted-foreground mt-1">{cert.year}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Skills</h2>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{(skill.level || 1) * 20}%</span>
                  </div>
                  <Progress value={(skill.level || 1) * 20} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {experiences.length === 0 && skills.length === 0 && certifications.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No experience or skills have been added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicExperiencePage;
