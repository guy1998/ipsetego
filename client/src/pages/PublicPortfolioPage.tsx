import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/hooks/use-theme';
import { Github, Linkedin, FileText, Moon, Sun, Mail, Briefcase, ArrowUp, ExternalLink, Download, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '@/api/api';
import { BACKEND_URL } from '@/lib/constants';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserPublicInfo {
  name: string;
  lastname: string;
  email: string;
  personalSlug: string;
  publicId: string;
  pictureId?: string;
  resumeId?: string;
  linkedin?: string;
  github?: string;
  xing?: string;
  skills?: { name: string; category?: string; level?: number }[];
}

const extractPublicId = (slug: string): string | null => {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slug.match(uuidRegex);
  return match ? match[0] : null;
};

const PublicPortfolioPage = () => {
  const { personalSlug } = useParams<{ personalSlug: string }>();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const api = Api.getInstance();

  const [user, setUser] = useState<UserPublicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isCvPreviewOpen, setIsCvPreviewOpen] = useState(false);
  const [cvBlobUrl, setCvBlobUrl] = useState<string | null>(null);

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', surname: '', email: '', subject: '', content: '' });
  const [contactSending, setContactSending] = useState(false);

  useEffect(() => {
    if (!personalSlug) return;
    const publicId = extractPublicId(personalSlug);
    if (!publicId) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/public/${publicId}`);
        setUser(res.data.data);
      } catch (error: any) {
        if (error?.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [personalSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Thanks for your question! Feel free to explore my projects and experience using the navigation links above, or reach out to me directly via email.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadCvPreview = async () => {
    if (!user?.resumeId) return;
    if (cvBlobUrl) {
      setIsCvPreviewOpen(true);
      return;
    }
    try {
      const response = await api.get(`/uploads/cv/${user.resumeId}`, undefined, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
      setCvBlobUrl(URL.createObjectURL(blob));
      setIsCvPreviewOpen(true);
    } catch {
      // cv unavailable
    }
  };

  const handleCvDownload = async () => {
    if (!user?.resumeId) return;
    try {
      const response = await api.get(`/uploads/cv/${user.resumeId}`, undefined, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = user.resumeId;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // download failed
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.publicId) return;
    setContactSending(true);
    try {
      await api.post(`/user/contact/${user.publicId}`, contactForm);
      toast.success('Message sent!', { description: 'Your message has been delivered.' });
      setIsContactOpen(false);
      setContactForm({ name: '', surname: '', email: '', subject: '', content: '' });
    } catch {
      toast.error('Failed to send message', { description: 'Please try again later.' });
    } finally {
      setContactSending(false);
    }
  };

  const isCvPdf = user?.resumeId ? user.resumeId.toLowerCase().endsWith('.pdf') : true;
  const initials = user ? `${(user.name || '').charAt(0)}${(user.lastname || '').charAt(0)}`.toUpperCase() : '';
  const fullName = user ? `${user.name} ${user.lastname}` : '';
  const profilePicSrc = user?.pictureId ? `${BACKEND_URL}/uploads/image/${user.pictureId}` : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading portfolio...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Portfolio not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">ip</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline">ipsetego</span>
            </button>

            {/* Center Profile Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                {profilePicSrc ? (
                  <img src={profilePicSrc} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">{initials}</span>
                )}
              </div>
              <span className="font-semibold">{fullName}</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/portfolio/${personalSlug}/projects`)}>
                  Projects
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/portfolio/${personalSlug}/experience`)}>
                  Experience
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-16 overflow-hidden">
        {/* Messages & Hero Container */}
        <div className="flex-1 flex overflow-hidden gap-4 px-4 md:px-6">
          {/* Hero Section */}
          <div
            className={`transition-all duration-500 ease-out ${
              messages.length === 0
                ? 'w-full flex items-center justify-center'
                : 'w-64 flex-shrink-0 pt-8 overflow-y-auto'
            }`}
          >
            <div
              className={`text-center space-y-4 transition-transform duration-500 ease-out ${
                messages.length === 0 ? 'scale-100' : 'scale-75 origin-top'
              }`}
            >
              {/* Profile */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center overflow-hidden">
                    {profilePicSrc ? (
                      <img src={profilePicSrc} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-4xl font-bold">{initials}</span>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Hi, I'm {fullName}</h1>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3 flex-wrap">
                {user?.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {user?.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {user?.xing && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.xing} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {user?.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${user.email}`}>
                      <Mail className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-2 justify-center ${messages.length === 0 ? 'flex-col sm:flex-row' : 'flex-row flex-wrap'}`}>
                {user?.resumeId && (
                  <Button
                    onClick={loadCvPreview}
                    className="bg-primary hover:bg-primary/90"
                    size={messages.length === 0 ? 'default' : 'sm'}
                  >
                    <FileText className="w-4 h-4" />
                    {messages.length === 0 && <span className="ml-2">View CV</span>}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsContactOpen(true)}
                  size={messages.length === 0 ? 'default' : 'sm'}
                >
                  <Send className="w-4 h-4" />
                  {messages.length === 0 && <span className="ml-2">Contact</span>}
                </Button>
                {messages.length === 0 && (
                  <Button variant="outline" onClick={() => navigate(`/portfolio/${personalSlug}/projects`)}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Projects
                  </Button>
                )}
              </div>

              {/* Subtitle */}
              <p className="text-sm text-muted-foreground">
                Ask me anything about my experience, projects, or skills
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div />
              ) : (
                <div className="py-8 space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'user' ? (
                        <div className="flex gap-3 max-w-xl flex-row-reverse">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-primary-foreground text-xs font-bold">You</span>
                            </div>
                          </div>
                          <div className="px-4 py-3 rounded-lg bg-primary text-primary-foreground rounded-br-none">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-2xl">
                          <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border/20 bg-background/95 backdrop-blur-sm py-4 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex gap-3"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about my experience, projects, or anything else..."
                className="bg-muted/50 border-border/30 rounded-full px-4 focus:border-primary transition-colors flex-1"
                disabled={isTyping}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90 flex-shrink-0"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact {fullName}</DialogTitle>
            <DialogDescription>Send a message directly to {user?.name}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">First Name</label>
                <Input
                  placeholder="Your first name"
                  value={contactForm.name}
                  onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <Input
                  placeholder="Your last name"
                  value={contactForm.surname}
                  onChange={e => setContactForm(f => ({ ...f, surname: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={contactForm.email}
                onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input
                placeholder="What is this about?"
                value={contactForm.subject}
                onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea
                placeholder="Write your message here..."
                value={contactForm.content}
                onChange={e => setContactForm(f => ({ ...f, content: e.target.value }))}
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={contactSending}>
              {contactSending ? 'Sending...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* CV Preview Modal */}
      <Dialog open={isCvPreviewOpen} onOpenChange={setIsCvPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>CV Preview</span>
              <Button variant="outline" size="sm" onClick={handleCvDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </DialogTitle>
            <DialogDescription>Resume</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {cvBlobUrl && (
              isCvPdf ? (
                <iframe src={cvBlobUrl} className="w-full h-full border-0 rounded-lg" title="CV Preview" />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                  <img src={cvBlobUrl} alt="CV Preview" className="max-w-full max-h-full object-contain" />
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicPortfolioPage;
