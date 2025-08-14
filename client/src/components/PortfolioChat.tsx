import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Send, User, Bot, Github, Linkedin, Twitter, FileText, Briefcase, Moon, Sun, Mail, Code } from 'lucide-react';
import CVViewer from './CVViewer';
import ProjectCanvas from './ProjectCanvas';
import ProjectSidebar from './ProjectSidebar';
import ContactForm from './ContactForm';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QAItem {
  question: string;
  answer: string;
  category: 'about' | 'experience' | 'projects' | 'blog';
}

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

const PortfolioChat = () => {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'portfolio' | 'projects' | 'contact' | 'chat'>('portfolio');
  const [chatScrollPosition, setChatScrollPosition] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Static Q&A data for portfolio sections
  const qaData: QAItem[] = [
    {
      question: "Who are you?",
      answer: "I'm a passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating beautiful, user-friendly interfaces and robust backend systems.",
      category: 'about'
    },
    {
      question: "What technologies do you work with?",
      answer: "I specialize in React, TypeScript, Node.js, and Python. I'm also experienced with cloud platforms like AWS and have worked extensively with databases including PostgreSQL and MongoDB.",
      category: 'about'
    },
    {
      question: "What's your current role?",
      answer: "I'm currently a Senior Frontend Developer at TechCorp, where I lead a team of 4 developers building next-generation SaaS products. I focus on creating scalable architectures and mentoring junior developers.",
      category: 'experience'
    },
    {
      question: "What's your most challenging project?",
      answer: "I built a real-time collaboration platform from scratch, handling 10,000+ concurrent users. The biggest challenge was optimizing WebSocket connections and implementing conflict resolution for simultaneous edits.",
      category: 'projects'
    },
    {
      question: "What side projects are you working on?",
      answer: "I'm currently building an AI-powered code review tool that helps developers learn best practices. It's built with OpenAI's API, React, and FastAPI, and I'm planning to launch it next month.",
      category: 'projects'
    },
    {
      question: "Do you write technical articles?",
      answer: "Yes! I regularly write about web development, performance optimization, and developer productivity. My most popular article 'Mastering React Performance' has over 50k views on Medium.",
      category: 'blog'
    }
  ];

  const scrollToSection = (section: 'portfolio' | 'projects' | 'contact' | 'chat') => {
    if (section === 'portfolio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'projects') {
      projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'chat') {
      chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(section);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsProjectSidebarOpen(true);
  };

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
    setIsLoading(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Thanks for your question! This is a demo portfolio where I would typically integrate with an AI service to provide personalized responses about my experience and projects. Feel free to explore the Q&A sections above to learn more about my background!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const scrollTop = chatContainerRef.current.scrollTop;
        setChatScrollPosition(scrollTop);
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">AJ</span>
              </div>
              <span className="font-semibold ml-2">Alex Johnson</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('portfolio')}>
                Portfolio
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('projects')}>
                Projects
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('contact')}>
                Contact
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('chat')}>
                Chat
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <Card className="modern-card p-8 max-w-2xl mx-auto text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 mx-auto mb-6 flex items-center justify-center profile-glow float-animation">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Hi, I'm Alex Johnson
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Full-Stack Developer & Tech Enthusiast
          </p>
          <p className="text-muted-foreground mb-8">
            Welcome to my interactive portfolio! Explore my projects, check out my experience, 
            or jump to the chat section to ask me anything.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button variant="outline" size="sm" className="btn-glow stagger-child" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="sm" className="btn-glow stagger-child" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="sm" className="btn-glow stagger-child" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="sm" className="btn-glow stagger-child" asChild>
              <a href="mailto:alex.johnson@email.com">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsCVOpen(true)} className="btn-glow bg-primary hover:bg-primary/90 stagger-child">
              <FileText className="w-4 h-4 mr-2" />
              View Interactive CV
            </Button>
            <Button variant="outline" className="btn-glow stagger-child" onClick={() => scrollToSection('projects')}>
              <Briefcase className="w-4 h-4 mr-2" />
              Explore Projects
            </Button>
            <Button variant="outline" className="btn-glow stagger-child" onClick={() => scrollToSection('chat')}>
              <Bot className="w-4 h-4 mr-2" />
              Start Conversation
            </Button>
          </div>
        </Card>
      </div>

      {/* Q&A Portfolio Sections */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {qaData.map((qa, index) => (
          <div key={index} className="space-y-4 chat-message">
            {/* Question (User message style) */}
            <div className="flex justify-end">
              <div className="max-w-3xl">
                <Card className="modern-card bg-user-message p-4 rounded-2xl rounded-br-md user-message">
                  <p className="text-primary-foreground font-medium">{qa.question}</p>
                </Card>
                <div className="flex items-center justify-end mt-2 space-x-2">
                  <span className="text-xs text-muted-foreground">You</span>
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Answer (Assistant message style) */}
            <div className="flex justify-start">
              <div className="max-w-3xl">
                <Card className="modern-card bg-assistant-message p-4 rounded-2xl rounded-bl-md assistant-message parallax-float">
                  <p className="text-foreground leading-relaxed">{qa.answer}</p>
                </Card>
                <div className="flex items-center justify-start mt-2 space-x-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Alex</span>
                  <span className="text-xs text-primary capitalize px-2 py-1 rounded-full bg-primary/10">#{qa.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div ref={projectsSectionRef} className="max-w-6xl mx-auto px-4 py-16">
        <ProjectCanvas onProjectSelect={handleProjectSelect} />
      </div>

      {/* Contact Section */}
      <div ref={contactSectionRef} className="max-w-6xl mx-auto px-4 py-16">
        <ContactForm />
      </div>

      {/* Interactive Chat Section */}
      <div ref={chatSectionRef} className="max-w-4xl mx-auto px-4 py-16">
        <Card className="glass-card shadow-2xl overflow-hidden animate-scale-in">
          <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-600/5">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Ask me anything!
            </h2>
            <p className="text-center text-muted-foreground mt-2">
              Have a specific question? Start a conversation with me.
            </p>
          </div>

          {/* Chat Messages with 3D Stacking Effect */}
          <div 
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-6 relative"
            style={{
              perspective: '1000px',
              perspectiveOrigin: 'center center',
              background: `linear-gradient(135deg, 
                hsl(var(--chat-bg) / ${1 - chatScrollPosition * 0.001}), 
                hsl(var(--message-bg) / ${0.5 + chatScrollPosition * 0.0005}))`
            }}
          >
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground animate-fade-in-up">
                <Bot className="w-12 h-12 mx-auto mb-4 text-primary float-animation" />
                <p>👋 Hi! I'm ready to answer any questions about my experience, projects, or anything else you'd like to know!</p>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((message, index) => {
                const reverseIndex = messages.length - 1 - index;
                const stackOffset = reverseIndex * 8;
                const rotationX = reverseIndex * 2;
                const scale = 1 - (reverseIndex * 0.05);
                const zIndex = messages.length - reverseIndex;
                
                return (
                  <div 
                    key={message.id} 
                    className={`chat-message-3d flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{
                      transform: `
                        translateZ(${stackOffset}px) 
                        rotateX(${rotationX}deg) 
                        scale(${scale})
                        translateY(${chatScrollPosition * (index % 2 === 0 ? -0.2 : 0.2)}px)
                      `,
                      transformStyle: 'preserve-3d',
                      zIndex: zIndex,
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: `blur(${reverseIndex * 0.5}px)`,
                      opacity: 1 - (reverseIndex * 0.1)
                    }}
                  >
                    <div className="max-w-3xl">
                      <Card className={`modern-card p-4 rounded-2xl shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-user-message rounded-br-md user-message' 
                          : 'bg-assistant-message rounded-bl-md assistant-message parallax-float'
                      }`}
                      style={{
                        boxShadow: `
                          0 ${4 + stackOffset}px ${12 + stackOffset}px rgba(0, 0, 0, 0.2),
                          0 0 0 1px hsl(var(--border) / 0.3)
                        `
                      }}>
                        <p className={message.type === 'user' ? 'text-primary-foreground' : 'text-foreground'}>
                          {message.content}
                        </p>
                      </Card>
                      <div className={`flex items-center mt-2 space-x-2 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        {message.type === 'user' ? (
                          <>
                            <span className="text-xs text-muted-foreground">You</span>
                            <User className="w-4 h-4 text-muted-foreground" />
                          </>
                        ) : (
                          <>
                            <Bot className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Alex</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isLoading && (
              <div className="flex justify-start chat-message">
                <Card className="modern-card bg-assistant-message p-4 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Chat Input */}
          <div className="p-6 border-t border-border/50 bg-gradient-to-r from-background/90 to-card/90 backdrop-blur-sm">
            <div className="flex space-x-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about my experience, projects, or anything else..."
                className="flex-1 glass-card border-border/50 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading}
                className="btn-glow bg-primary hover:bg-primary/90 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modals and Sidebars */}
      <CVViewer isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
      <ProjectSidebar 
        project={selectedProject} 
        isOpen={isProjectSidebarOpen} 
        onClose={() => setIsProjectSidebarOpen(false)} 
      />
    </div>
  );
};

export default PortfolioChat;