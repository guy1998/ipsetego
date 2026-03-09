import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import {
  Moon,
  Sun,
  ArrowRight,
  Zap,
  Users,
  Code,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Shield,
  Briefcase,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Mail,
} from 'lucide-react';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Chat',
      description: 'Let prospects interact with an intelligent AI that knows everything about your projects and experience.',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Showcase Your Work',
      description: 'Display your projects, code samples, and technical achievements in an interactive format.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Impress Employers',
      description: 'Stand out with a unique, modern portfolio that engages rather than just informs.',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Real-time Interaction',
      description: 'Answer questions, discuss your experience, and build connections instantly.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Track Engagement',
      description: 'See who visited your portfolio and what they were most interested in.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Privacy First',
      description: 'Control what information is shared and maintain complete privacy over your data.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account in minutes. No credit card required.',
    },
    {
      number: '02',
      title: 'Build Your Portfolio',
      description: 'Add your projects, experience, and CV. Customize everything.',
    },
    {
      number: '03',
      title: 'Train Your AI',
      description: 'Our AI learns from your portfolio to answer any question about you.',
    },
    {
      number: '04',
      title: 'Share Your Link',
      description: 'Send your portfolio link to employers and start conversations.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Developer at TechCorp',
      content:
        'ipsetego helped me stand out from thousands of applicants. The AI-powered chat was a game-changer during my job search.',
      avatar: '👩‍💻',
    },
    {
      name: 'Marcus Johnson',
      role: 'Full-Stack Engineer',
      content:
        'Employers were impressed with how I could showcase my projects interactively. Got 3 offers in a month!',
      avatar: '👨‍💼',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Designer',
      content:
        'Finally, a portfolio that truly represents my skills. The modern design and interactive experience impressed everyone I spoke with.',
      avatar: '👩‍🎨',
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">ip</span>
              </div>
              <span className="font-bold text-lg">ipsetego</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/sign-up')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Badge */}
            <Badge variant="outline" className="mx-auto">
              <Zap className="w-3 h-3 mr-1" />
              The Future of Professional Portfolios
            </Badge>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Build Your Intelligent
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Interactive Portfolio
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Let employers chat with your AI-powered portfolio. Showcase your projects, experience, and skills in real-time conversations that actually impress.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base h-12 px-8" onClick={() => navigate('/sign-up')}>
                Start Building Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-base h-12 px-8" onClick={() => navigate('/preview')}>
                View Demo Portfolio
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Takes 5 minutes to set up</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Join 1000+ developers</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="mt-20 relative">
            <Card className="modern-card p-6 md:p-8 overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-600/5">
              <div className="bg-gradient-to-b from-background/50 to-background rounded-lg p-8 min-h-96 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MessageSquare className="w-16 h-16 mx-auto text-primary/50" />
                  <p className="text-muted-foreground text-lg">Interactive portfolio preview</p>
                  <Button variant="outline">See in Action</Button>
                </div>
              </div>
            </Card>

            {/* Floating Cards */}
            <Card className="modern-card absolute top-10 -left-4 p-4 max-w-xs hidden lg:block shadow-xl border-primary/20 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">5+ Years Experience</p>
                  <p className="text-xs text-muted-foreground">Full-Stack Developer</p>
                </div>
              </div>
            </Card>

            <Card className="modern-card absolute bottom-10 -right-4 p-4 max-w-xs hidden lg:block shadow-xl border-primary/20 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">10+ Projects</p>
                  <p className="text-xs text-muted-foreground">React, TypeScript, Node.js</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create an impressive, interactive portfolio that stands out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="modern-card p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary/50 group">
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in just 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="modern-card p-6 h-full">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">What Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of developers who've already landed their dream jobs using ipsetego.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="modern-card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you're ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="modern-card p-8 relative group">
              <Badge variant="outline" className="mb-4">Starter</Badge>
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect for getting started</p>

              <ul className="space-y-3 mb-8">
                {['1 Portfolio', 'Basic AI Chat', 'up to 5 Projects', 'Standard Features', 'Community Support'].map(
                  (feature, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>

              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Card>

            {/* Pro Tier (Featured) */}
            <Card className="modern-card p-8 relative group border-primary/50 shadow-lg transform scale-105">
              <Badge className="mb-4 bg-primary">Most Popular</Badge>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6">
                <span className="text-3xl font-bold text-foreground">$9</span>/month
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited Portfolios',
                  'Advanced AI Chat',
                  'Unlimited Projects',
                  'Analytics & Insights',
                  'Custom Domain',
                  'Priority Support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
            </Card>

            {/* Enterprise Tier */}
            <Card className="modern-card p-8 relative group">
              <Badge variant="outline" className="mb-4">Enterprise</Badge>
              <h3 className="text-2xl font-bold mb-2">Custom</h3>
              <p className="text-muted-foreground mb-6">For teams and organizations</p>

              <ul className="space-y-3 mb-8">
                {['Everything in Pro', 'Team Management', 'Advanced Analytics', 'API Access', 'Dedicated Support', 'Custom Integrations'].map(
                  (feature, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>

              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-purple-600/10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
            <p className="text-lg text-muted-foreground">
              Get the latest tips on building an impressive portfolio and new ipsetego features.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border/50 bg-background focus:outline-none focus:border-primary transition-colors"
              required
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 px-6">
              Subscribe
            </Button>
          </form>

          {subscribed && (
            <p className="text-sm text-primary animate-fade-in">Thanks for subscribing! Check your email.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">ip</span>
                </div>
                <span className="font-bold">ipsetego</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build your intelligent portfolio and impress employers.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 ipsetego. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
