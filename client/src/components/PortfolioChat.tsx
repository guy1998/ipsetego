import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Send, User, Bot, Github, Linkedin, Twitter, FileText, Moon, Sun, Mail, Briefcase, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CVViewer from './CVViewer';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PortfolioChat = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCVOpen, setIsCVOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
        content: "Thanks for your question! This is a demo portfolio where I would typically integrate with an AI service to provide personalized responses about my experience and projects. Feel free to ask me anything about my background!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">AJ</span>
              </div>
              <span className="font-semibold ml-2">Alex Johnson</span>
            </div>

            {/* Right Side - Navigation Links and Theme Toggle */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/preview/projects')}>
                  Projects
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/preview/experience')}>
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col pt-16 overflow-hidden">
        {/* Messages & Hero Container */}
        <div className="flex-1 flex overflow-hidden gap-4 px-4 md:px-6">
          {/* Hero Section - Sidebar */}
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
              {/* Profile Section */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center profile-glow float-animation">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                </div>

                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Hi, I'm Alex Johnson
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Full-Stack Developer & Tech Enthusiast
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:alex.johnson@email.com">
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
              </div>

              {/* Action Buttons */}
              {messages.length === 0 && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setIsCVOpen(true)} className="bg-primary hover:bg-primary/90">
                    <FileText className="w-4 h-4 mr-2" />
                    View CV
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/preview/projects')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Projects
                  </Button>
                </div>
              )}

              {/* Subtitle */}
              <p className="text-sm text-muted-foreground">
                Ask me anything about my experience, projects, or skills
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto"
            >
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
                        // User message with bubble
                        <div className="flex gap-3 max-w-xl flex-row-reverse">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                          </div>
                          <div className="px-4 py-3 rounded-lg bg-primary text-primary-foreground rounded-br-none">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ) : (
                        // Assistant message as free text
                        <div className="max-w-2xl">
                          <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
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
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-3"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about my experience, projects, or anything else..."
                className="bg-muted/50 border-border/30 rounded-full px-4 focus:border-primary transition-colors flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90 flex-shrink-0"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CVViewer isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
    </div>
  );
};

export default PortfolioChat;