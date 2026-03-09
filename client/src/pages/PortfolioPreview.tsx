import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const PortfolioPreview = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">AJ</span>
              </div>
              <span className="font-semibold ml-2">Alex Johnson</span>
            </div>

            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-4 py-12">
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">AJ</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold">Hi, I'm Alex Johnson</h1>
            <p className="text-xl text-muted-foreground">
              Full-Stack Developer & Tech Enthusiast
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I build beautiful, functional web and mobile applications that solve real problems.
              Passionate about clean code, user experience, and continuous learning.
            </p>
          </section>

          {/* Projects Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border/20 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="h-48 bg-muted" />
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg">E-commerce Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Full-stack e-commerce solution with payment integration
                  </p>
                </div>
              </div>
              <div className="border border-border/20 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="h-48 bg-muted" />
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg">Social Media App</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time social networking application
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Python', 'AWS', 'UI/UX Design', 'GraphQL'].map(
                (skill) => (
                  <div
                    key={skill}
                    className="p-3 border border-border/20 rounded-lg text-center hover:border-primary/50 transition-colors"
                  >
                    <p className="font-medium text-sm">{skill}</p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Experience</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 space-y-1">
                <h3 className="font-bold">Senior Frontend Developer</h3>
                <p className="text-sm text-muted-foreground">TechCorp Inc. · 2022 - Present</p>
              </div>
              <div className="border-l-4 border-primary/60 pl-4 space-y-1">
                <h3 className="font-bold">Full-Stack Developer</h3>
                <p className="text-sm text-muted-foreground">StartupXYZ · 2020 - 2022</p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center space-y-4 py-8">
            <h2 className="text-3xl font-bold">Let's Work Together</h2>
            <p className="text-muted-foreground">
              Have a project in mind? Feel free to reach out!
            </p>
            <div className="flex justify-center gap-3">
              <Button>Get In Touch</Button>
              <Button variant="outline">View Full Portfolio</Button>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 text-center text-sm text-muted-foreground">
        <p>© 2024 Alex Johnson. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PortfolioPreview;
