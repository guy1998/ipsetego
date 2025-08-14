import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Download, Award, Calendar, MapPin, Mail, Phone, Globe } from 'lucide-react';

interface CVViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CVViewer: React.FC<CVViewerProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const skills = [
    { name: 'React/Next.js', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'AWS/Cloud', level: 75 },
    { name: 'UI/UX Design', level: 70 },
  ];

  const certifications = [
    { name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2024' },
    { name: 'Google Cloud Professional', issuer: 'Google', year: '2023' },
    { name: 'React Advanced Certification', issuer: 'Meta', year: '2023' },
  ];

  const handleDownloadCV = () => {
    // In a real app, this would trigger a PDF download
    alert('CV download started! (This is a demo)');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Interactive CV</span>
            <Button onClick={handleDownloadCV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            {['overview', 'experience', 'skills', 'certifications'].map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'default' : 'ghost'}
                className="w-full justify-start capitalize"
                onClick={() => setActiveSection(section)}
              >
                {section}
              </Button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      AJ
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">Alex Johnson</h2>
                      <p className="text-lg text-muted-foreground">Senior Full-Stack Developer</p>
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>alex.johnson@email.com</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>San Francisco, CA</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>alexjohnson.dev</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Passionate full-stack developer with 5+ years of experience building scalable web applications 
                    and leading development teams. Specialized in React, TypeScript, and cloud architecture. 
                    Strong advocate for clean code, user experience, and continuous learning.
                  </p>
                </Card>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Work Experience</h3>
                
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">Senior Frontend Developer</h4>
                      <p className="text-primary">TechCorp Inc.</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>2022 - Present</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Lead a team of 4 developers in building next-generation SaaS products</li>
                    <li>• Architected and implemented scalable frontend solutions serving 100k+ users</li>
                    <li>• Reduced application load time by 40% through performance optimization</li>
                    <li>• Mentored junior developers and established coding standards</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">Full-Stack Developer</h4>
                      <p className="text-primary">StartupXYZ</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>2020 - 2022</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>Remote</span>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Built full-stack web applications using React, Node.js, and PostgreSQL</li>
                    <li>• Implemented real-time features using WebSocket and Redis</li>
                    <li>• Collaborated with designers to create pixel-perfect user interfaces</li>
                    <li>• Deployed applications to AWS with CI/CD pipelines</li>
                  </ul>
                </Card>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Technical Skills</h3>
                
                <div className="space-y-4">
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

                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Git'].map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeSection === 'certifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Certifications & Achievements</h3>
                
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center space-x-3">
                        <Award className="w-8 h-8 text-primary" />
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

                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Achievements</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Won "Best Developer Tool" at TechCorp Innovation Awards 2024</li>
                    <li>• Published 10+ technical articles with 100k+ total views</li>
                    <li>• Speaker at React Conference 2023</li>
                    <li>• Open source contributor with 500+ GitHub stars</li>
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVViewer;