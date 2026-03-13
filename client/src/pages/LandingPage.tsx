import React, { useRef, useState, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
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
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';

// ─── 3D Scene Components ─────────────────────────────────────────────────────

function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.12;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[2, 0.55, 180, 36]} />
      <MeshDistortMaterial
        color="#9c29fb"
        wireframe={false}
        transparent
        opacity={0.25}
        distort={0.3}
        speed={2}
      />
    </mesh>
  );
}

function WireTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.12;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[2, 0.55, 180, 36]} />
      <meshStandardMaterial
        color="#b06bff"
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function FloatingOrbs() {
  const configs: Array<{ pos: [number, number, number]; color: string; speed: number; size: number }> = [
    { pos: [-5, 2.5, -3], color: '#9c29fb', speed: 1.8, size: 0.38 },
    { pos: [5, -1.5, -4], color: '#6a11cb', speed: 2.4, size: 0.28 },
    { pos: [-3.5, -3, -1], color: '#b06bff', speed: 1.4, size: 0.22 },
    { pos: [4, 3.5, -5], color: '#9c29fb', speed: 2.0, size: 0.44 },
    { pos: [0, -4, -2], color: '#6a11cb', speed: 1.6, size: 0.3 },
    { pos: [-6, -1, -4], color: '#b06bff', speed: 2.2, size: 0.2 },
  ];

  return (
    <>
      {configs.map((c, i) => (
        <Float key={i} speed={c.speed} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={c.pos}>
            <icosahedronGeometry args={[c.size, 1]} />
            <meshStandardMaterial color={c.color} wireframe transparent opacity={0.8} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      style={{ pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <pointLight color="#9c29fb" position={[6, 6, 6]} intensity={4} />
        <pointLight color="#6a11cb" position={[-6, -6, -4]} intensity={3} />
        <pointLight color="#ffffff" position={[0, 0, 8]} intensity={0.5} />
        <Stars radius={120} depth={60} count={6000} factor={3.5} saturation={0.3} fade speed={0.8} />
        <TorusKnot />
        <WireTorusKnot />
        <FloatingOrbs />
      </Suspense>
    </Canvas>
  );
}

// ─── Tilt Card ────────────────────────────────────────────────────────────────

function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.03,1.03,1.03)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease-out', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

// ─── Grid Background ──────────────────────────────────────────────────────────

function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(156,41,251,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(156,41,251,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
  );
}

// ─── Scanline Overlay ─────────────────────────────────────────────────────────

function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 opacity-[0.015]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.12) 2px, rgba(255,255,255,0.12) 4px)',
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
    { number: '01', title: 'Sign Up', description: 'Create your account in minutes. No credit card required.' },
    { number: '02', title: 'Build Your Portfolio', description: 'Add your projects, experience, and CV. Customize everything.' },
    { number: '03', title: 'Train Your AI', description: 'Our AI learns from your portfolio to answer any question about you.' },
    { number: '04', title: 'Share Your Link', description: 'Send your portfolio link to employers and start conversations.' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Developer at TechCorp',
      content: 'ipsetego helped me stand out from thousands of applicants. The AI-powered chat was a game-changer during my job search.',
      avatar: '👩‍💻',
    },
    {
      name: 'Marcus Johnson',
      role: 'Full-Stack Engineer',
      content: 'Employers were impressed with how I could showcase my projects interactively. Got 3 offers in a month!',
      avatar: '👨‍💼',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Designer',
      content: 'Finally, a portfolio that truly represents my skills. The modern design and interactive experience impressed everyone I spoke with.',
      avatar: '👩‍🎨',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20"
        style={{ background: 'rgba(10,7,20,0.75)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                  boxShadow: '0 0 16px rgba(156,41,251,0.5)',
                }}
              >
                <span className="text-white text-sm font-bold">ip</span>
              </div>
              <span className="font-bold text-lg tracking-wide" style={{ color: '#e8d4ff' }}>
                ipsetego
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'How It Works', 'Testimonials'].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: 'rgba(220,200,255,0.7)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#b06bff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(220,200,255,0.7)')}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground hover:text-primary">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="border-primary/40 text-primary hover:bg-primary/10"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/sign-up')}
                style={{
                  background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                  boxShadow: '0 0 20px rgba(156,41,251,0.4)',
                }}
                className="hover:opacity-90 transition-opacity"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(156,41,251,0.15) 0%, transparent 70%), #0a0714' }}>

        {/* 3D Canvas Background */}
        <div className="absolute inset-0">
          <HeroScene />
        </div>

        {/* Scanlines */}
        <ScanlineOverlay />

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(156,41,251,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center pt-32 pb-20">
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="flex justify-center">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border"
                style={{
                  background: 'rgba(156,41,251,0.12)',
                  borderColor: 'rgba(156,41,251,0.4)',
                  color: '#d0a0ff',
                  boxShadow: '0 0 20px rgba(156,41,251,0.2)',
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                The Future of Professional Portfolios
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #9c29fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(156,41,251,0.4))',
                  }}
                >
                  Build Your Intelligent
                </span>
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.4))',
                  }}
                >
                  Interactive Portfolio
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(200,180,230,0.7)' }}>
                Let employers chat with your AI-powered portfolio. Showcase your projects, experience, and skills in real-time conversations that actually impress.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="text-base h-12 px-8 font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                  boxShadow: '0 0 30px rgba(156,41,251,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
                onClick={() => navigate('/sign-up')}
              >
                Start Building Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base h-12 px-8"
                style={{
                  borderColor: 'rgba(156,41,251,0.5)',
                  color: '#d0a0ff',
                  background: 'rgba(156,41,251,0.06)',
                  backdropFilter: 'blur(8px)',
                }}
                onClick={() => navigate('/preview')}
              >
                View Demo Portfolio
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm" style={{ color: 'rgba(180,160,210,0.6)' }}>
              {['No credit card required', 'Takes 5 minutes to set up', 'Join 1000+ developers'].map((text) => (
                <div key={text} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#9c29fb' }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0a0714)' }} />
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section
        id="features"
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: '#080612' }}
      >
        <GridBackground />

        {/* Glow accents */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #9c29fb, transparent)', filter: 'blur(60px)' }} />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6a11cb, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span
              className="inline-block text-xs font-semibold tracking-[0.3em] uppercase px-3 py-1 rounded-full"
              style={{ color: '#9c29fb', border: '1px solid rgba(156,41,251,0.3)', background: 'rgba(156,41,251,0.08)' }}
            >
              Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#e8d4ff' }}>
              Powerful Features
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(180,160,210,0.6)' }}>
              Everything you need to create an impressive, interactive portfolio that stands out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <TiltCard key={index}>
                <div
                  className="p-6 rounded-2xl h-full group cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(156,41,251,0.2)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(156,41,251,0.6)';
                    e.currentTarget.style.boxShadow = '0 4px 40px rgba(156,41,251,0.2), 0 0 0 1px rgba(156,41,251,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(156,41,251,0.2)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: 'rgba(156,41,251,0.12)',
                      border: '1px solid rgba(156,41,251,0.25)',
                      color: '#b06bff',
                      boxShadow: '0 0 16px rgba(156,41,251,0.15)',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#e8d4ff' }}>{feature.title}</h3>
                  <p style={{ color: 'rgba(180,160,210,0.6)', lineHeight: '1.6' }}>{feature.description}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #080612 0%, #0d0a1f 100%)' }}
      >
        {/* Horizontal glow line */}
        <div className="pointer-events-none absolute top-1/2 left-0 right-0 h-px opacity-30"
          style={{ background: 'linear-gradient(90deg, transparent, #9c29fb, transparent)' }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span
              className="inline-block text-xs font-semibold tracking-[0.3em] uppercase px-3 py-1 rounded-full"
              style={{ color: '#9c29fb', border: '1px solid rgba(156,41,251,0.3)', background: 'rgba(156,41,251,0.08)' }}
            >
              Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#e8d4ff' }}>How It Works</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(180,160,210,0.6)' }}>
              Get started in just 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <TiltCard>
                  <div
                    className="p-6 rounded-2xl h-full relative overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(156,41,251,0.2)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* Step number with glow */}
                    <div
                      className="text-5xl font-bold mb-4 leading-none"
                      style={{
                        background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 12px rgba(156,41,251,0.6))',
                      }}
                    >
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#e8d4ff' }}>{step.title}</h3>
                    <p style={{ color: 'rgba(180,160,210,0.6)', lineHeight: '1.6' }}>{step.description}</p>
                    {/* Corner accent */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 opacity-20"
                      style={{
                        background: 'radial-gradient(circle at top right, #9c29fb, transparent)',
                      }}
                    />
                  </div>
                </TiltCard>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-8 -right-3 z-20 items-center">
                    <div className="w-6 h-px" style={{ background: 'linear-gradient(90deg, #9c29fb, rgba(156,41,251,0.2))' }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#9c29fb', boxShadow: '0 0 6px #9c29fb' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: '#080612' }}
      >
        <GridBackground />

        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 rounded-full"
          style={{ background: 'radial-gradient(ellipse, #9c29fb, transparent)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span
              className="inline-block text-xs font-semibold tracking-[0.3em] uppercase px-3 py-1 rounded-full"
              style={{ color: '#9c29fb', border: '1px solid rgba(156,41,251,0.3)', background: 'rgba(156,41,251,0.08)' }}
            >
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#e8d4ff' }}>What Users Say</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(180,160,210,0.6)' }}>
              Join hundreds of developers who've already landed their dream jobs using ipsetego.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TiltCard key={index}>
                <div
                  className="p-6 rounded-2xl h-full"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(156,41,251,0.2)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Quote mark */}
                  <div className="text-4xl font-serif mb-3 leading-none" style={{ color: 'rgba(156,41,251,0.4)' }}>"</div>
                  <p className="mb-6 italic leading-relaxed" style={{ color: 'rgba(200,180,230,0.7)' }}>
                    {testimonial.content}
                  </p>
                  <div className="flex items-center space-x-3 pt-4" style={{ borderTop: '1px solid rgba(156,41,251,0.15)' }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: 'rgba(156,41,251,0.15)', border: '1px solid rgba(156,41,251,0.3)' }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#e8d4ff' }}>{testimonial.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(180,160,210,0.5)' }}>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #080612 0%, #0a0714 100%)' }}
      >
        {/* Glowing ring */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-15"
          style={{
            border: '1px solid rgba(156,41,251,0.5)',
            boxShadow: '0 0 80px rgba(156,41,251,0.3), inset 0 0 80px rgba(156,41,251,0.1)',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#e8d4ff' }}>Stay Updated</h2>
            <p className="text-lg" style={{ color: 'rgba(180,160,210,0.6)' }}>
              Get the latest tips on building an impressive portfolio and new ipsetego features.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(156,41,251,0.3)',
                color: '#e8d4ff',
                backdropFilter: 'blur(8px)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(156,41,251,0.7)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(156,41,251,0.3)')}
            />
            <Button
              type="submit"
              className="px-6 font-semibold"
              style={{
                background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                boxShadow: '0 0 20px rgba(156,41,251,0.4)',
              }}
            >
              Subscribe
            </Button>
          </form>

          {subscribed && (
            <p className="text-sm animate-fade-in" style={{ color: '#b06bff' }}>
              Thanks for subscribing! Check your email.
            </p>
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="relative py-12 px-4"
        style={{
          background: '#06040f',
          borderTop: '1px solid rgba(156,41,251,0.15)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                    boxShadow: '0 0 12px rgba(156,41,251,0.4)',
                  }}
                >
                  <span className="text-white text-sm font-bold">ip</span>
                </div>
                <span className="font-bold" style={{ color: '#e8d4ff' }}>ipsetego</span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(180,160,210,0.5)' }}>
                Build your intelligent portfolio and impress employers.
              </p>
              <div className="flex space-x-3">
                {[
                  { icon: <Github className="w-4 h-4" />, href: 'https://github.com' },
                  { icon: <Linkedin className="w-4 h-4" />, href: 'https://linkedin.com' },
                  { icon: <Twitter className="w-4 h-4" />, href: 'https://twitter.com' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(156,41,251,0.1)',
                      border: '1px solid rgba(156,41,251,0.2)',
                      color: 'rgba(180,160,210,0.6)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(156,41,251,0.2)';
                      e.currentTarget.style.color = '#b06bff';
                      e.currentTarget.style.borderColor = 'rgba(156,41,251,0.5)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(156,41,251,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(156,41,251,0.1)';
                      e.currentTarget.style.color = 'rgba(180,160,210,0.6)';
                      e.currentTarget.style.borderColor = 'rgba(156,41,251,0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase" style={{ color: 'rgba(156,41,251,0.8)' }}>Product</h3>
              <ul className="space-y-2 text-sm" style={{ color: 'rgba(180,160,210,0.5)' }}>
                {[['Features', '#features'], ['Roadmap', '#']].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="hover:text-primary transition-colors duration-200" style={{ color: 'inherit' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#b06bff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(180,160,210,0.5)')}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase" style={{ color: 'rgba(156,41,251,0.8)' }}>Company</h3>
              <ul className="space-y-2 text-sm">
                {[['About', '#'], ['Blog', '#'], ['Careers', '#']].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ color: 'rgba(180,160,210,0.5)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#b06bff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(180,160,210,0.5)')}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase" style={{ color: 'rgba(156,41,251,0.8)' }}>Legal</h3>
              <ul className="space-y-2 text-sm">
                {[['Privacy Policy', '#'], ['Terms of Service', '#'], ['Contact Us', '#']].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ color: 'rgba(180,160,210,0.5)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#b06bff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(180,160,210,0.5)')}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between text-sm"
            style={{ borderTop: '1px solid rgba(156,41,251,0.1)', color: 'rgba(180,160,210,0.35)' }}
          >
            <p>&copy; 2024 ipsetego. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy', 'Terms', 'Status'].map((label) => (
                <a key={label} href="#"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#b06bff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(180,160,210,0.35)')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
