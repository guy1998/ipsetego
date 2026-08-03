import React, { useRef, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Api } from '@/api/api';
import { GITHUB_REPO_URL } from '@/lib/constants';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  CheckCircle,
  Github,
  BookOpen,
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Api.getInstance().post('/newsletter/subscribe', { email });
      setEmail('');
      toast({ title: 'Subscribed!', description: 'Thanks for subscribing! Check your email.' });
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Something went wrong. Please try again.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

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

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/40 text-primary hover:bg-primary/10"
                >
                  <Github className="w-4 h-4 mr-2" /> GitHub
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="border-primary/40 text-primary hover:bg-primary/10 hidden sm:inline-flex"
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
                Sign Up
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
                <Boxes className="w-3.5 h-3.5" />
                Open Source · Self-Hosted
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
                  Your Portfolio.
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
                  Self-Hosted. AI-Powered.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(200,180,230,0.7)' }}>
                Express, React, and an LLM chat that knows your work. Clone it, run it, own it.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="text-base h-12 px-8 font-semibold w-full sm:w-auto"
                  style={{
                    background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                    boxShadow: '0 0 30px rgba(156,41,251,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                >
                  <Github className="w-4 h-4 mr-2" /> View on GitHub <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
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
              {['Docker-ready', 'Bring your own LLM', 'Your server, your data'].map((text) => (
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
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#e8d4ff' }}>Get Involved</h2>
            <p className="text-lg" style={{ color: 'rgba(180,160,210,0.6)' }}>
              Star the repo to keep up with releases, open an issue if something's broken, or send a PR.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="text-base h-12 px-8 font-semibold w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #9c29fb, #6a11cb)',
                  boxShadow: '0 0 20px rgba(156,41,251,0.4)',
                }}
              >
                <Github className="w-4 h-4 mr-2" /> Star on GitHub
              </Button>
            </a>
            <a href={`${GITHUB_REPO_URL}#readme`} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="text-base h-12 px-8 w-full sm:w-auto"
                style={{
                  borderColor: 'rgba(156,41,251,0.5)',
                  color: '#d0a0ff',
                  background: 'rgba(156,41,251,0.06)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" /> Read the Docs
              </Button>
            </a>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
            <input
              type="email"
              placeholder="Or get an email on new releases"
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
              variant="outline"
              className="px-6 font-semibold"
              style={{
                borderColor: 'rgba(156,41,251,0.4)',
                color: '#d0a0ff',
                background: 'rgba(156,41,251,0.04)',
              }}
            >
              Subscribe
            </Button>
          </form>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                Open-source, self-hosted portfolio platform with an AI-powered chat.
              </p>
              <div className="flex space-x-3">
                {[
                  { icon: <Github className="w-4 h-4" />, href: GITHUB_REPO_URL },
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

            {/* Community */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase" style={{ color: 'rgba(156,41,251,0.8)' }}>Community</h3>
              <ul className="space-y-2 text-sm">
                {[['Star on GitHub', GITHUB_REPO_URL], ['Issues', `${GITHUB_REPO_URL}/issues`], ['Discussions', `${GITHUB_REPO_URL}/discussions`]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(180,160,210,0.5)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#b06bff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(180,160,210,0.5)')}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Docs */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase" style={{ color: 'rgba(156,41,251,0.8)' }}>Docs</h3>
              <ul className="space-y-2 text-sm">
                {[['README', `${GITHUB_REPO_URL}#readme`], ['License', `${GITHUB_REPO_URL}/blob/main/LICENSE`]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(180,160,210,0.5)' }}
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
            <p>ipsetego — open source, self-hosted.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#b06bff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(180,160,210,0.35)')}>
                github.com/guy1998/ipsetego
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
