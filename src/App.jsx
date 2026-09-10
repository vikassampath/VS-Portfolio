import { Canvas, useFrame } from '@react-three/fiber';
import {
  Award,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Cpu,
  DatabaseZap,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Component, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { portfolioData } from './portfolioData.js';

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'Skills', href: '#skills' },
  { label: 'Story', href: '#story' },
  { label: 'Contact', href: '#contact' }
];

const focusIcons = [BrainCircuit, Layers3, DatabaseZap];
const principleIcons = [Rocket, ShieldCheck, Cpu];

function useWebGLSupport() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setSupported(Boolean(context));
  }, []);

  return supported;
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <SceneFallback />;
    }

    return this.props.children;
  }
}

function SceneFallback() {
  return (
    <div className="scene-fallback" aria-hidden="true">
      <span />
      <span />
      <span />
      <i />
    </div>
  );
}

function StarField() {
  const positions = useMemo(() => {
    const values = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i += 1) {
      const radius = 8 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      values[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      values[i * 3 + 2] = radius * Math.cos(phi) - 3;
    }
    return values;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d8f6ff" size={0.045} sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

function Ribbon({ color, offset = 0 }) {
  const ref = useRef();
  const geometry = useMemo(() => {
    const points = Array.from({ length: 7 }, (_, index) => {
      const angle = index * 0.9 + offset;
      return new THREE.Vector3(
        Math.cos(angle) * (2.6 + index * 0.12),
        Math.sin(index * 0.82 + offset) * 0.8,
        -2.6 + index * 0.78
      );
    });
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 80, 0.018, 8, false);
  }, [offset]);

  useFrame(({ clock }) => {
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.28 + offset) * 0.18;
    ref.current.rotation.y = clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} roughness={0.35} />
    </mesh>
  );
}

function SkillSatellites() {
  const group = useRef();
  const labels = portfolioData.skills.slice(0, 8);

  useFrame(({ clock, pointer }) => {
    group.current.rotation.y = clock.elapsedTime * 0.18 + pointer.x * 0.15;
    group.current.rotation.x = pointer.y * 0.08;
  });

  return (
    <group ref={group}>
      {labels.map((skill, index) => {
        const angle = (index / labels.length) * Math.PI * 2;
        const radius = 2.65 + (index % 2) * 0.55;
        return (
          <mesh key={skill} position={[Math.cos(angle) * radius, Math.sin(angle * 1.6) * 0.65, Math.sin(angle) * radius]}>
            <boxGeometry args={[0.34, 0.34, 0.34]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? '#ff6b4a' : index % 3 === 1 ? '#2ebfa5' : '#f0b429'}
              roughness={0.28}
              metalness={0.18}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function PortfolioScene() {
  const core = useRef();
  const ring = useRef();

  useFrame(({ clock, pointer }) => {
    core.current.rotation.x = clock.elapsedTime * 0.28 + pointer.y * 0.2;
    core.current.rotation.y = clock.elapsedTime * 0.42 + pointer.x * 0.35;
    ring.current.rotation.z = clock.elapsedTime * 0.18;
    ring.current.rotation.x = Math.PI / 2 + Math.sin(clock.elapsedTime * 0.4) * 0.12;
  });

  return (
    <>
      <color attach="background" args={['#091012']} />
      <fog attach="fog" args={['#091012', 7, 19]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff2da" />
      <pointLight position={[-4, -1.5, 2]} intensity={5} color="#2ebfa5" />
      <pointLight position={[4, 1, -1]} intensity={3.5} color="#ff6b4a" />
      <StarField />
      <group position={[2.35, 0.42, -0.2]} scale={1.62}>
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[1.18, 1]} />
            <meshStandardMaterial
              color="#f7efe1"
              emissive="#2ebfa5"
              emissiveIntensity={0.16}
              roughness={0.32}
              metalness={0.08}
              transparent
              opacity={0.26}
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#f7efe1" emissive="#2ebfa5" emissiveIntensity={0.42} roughness={0.22} wireframe />
          </mesh>
        </group>
        <mesh ref={ring}>
          <torusGeometry args={[1.86, 0.024, 12, 160]} />
          <meshStandardMaterial color="#d8f6ff" emissive="#2ebfa5" emissiveIntensity={1.15} />
        </mesh>
        <Ribbon color="#ff6b4a" offset={0.1} />
        <Ribbon color="#2ebfa5" offset={1.7} />
        <Ribbon color="#f0b429" offset={3.2} />
        <SkillSatellites />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <planeGeometry args={[18, 18, 28, 28]} />
        <meshStandardMaterial color="#10191b" roughness={0.78} metalness={0.05} wireframe transparent opacity={0.28} />
      </mesh>
    </>
  );
}

function SocialIcon({ label }) {
  if (label === 'GitHub') return <Github size={18} />;
  if (label === 'LinkedIn') return <Linkedin size={18} />;
  return <ArrowUpRight size={18} />;
}

function App() {
  const { profile, stats, focusAreas, principles, skills, projects, timeline } = portfolioData;
  const githubUrl = profile.socials.find((social) => social.label === 'GitHub')?.url;
  const webGLSupported = useWebGLSupport();

  return (
    <div className="app">
      <div className="scene" aria-hidden="true">
        {webGLSupported ? (
          <SceneErrorBoundary>
            <Canvas
              camera={{ position: [0, 0.4, 7.4], fov: 45 }}
              dpr={[1, 1.25]}
              gl={{ antialias: false, powerPreference: 'high-performance' }}
            >
              <PortfolioScene />
            </Canvas>
          </SceneErrorBoundary>
        ) : (
          <SceneFallback />
        )}
        <div className="scene-signature" aria-hidden="true">
          <b>{profile.initials}</b>
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="orbit orbit-three" />
        </div>
      </div>

      <header className="topbar">
        <a className="brand" href="#home" aria-label={`${profile.name} home`}>
          <span className="brand-mark" aria-hidden="true">
            {profile.initials}
          </span>
          <strong>{profile.name}</strong>
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <Sparkles size={18} /> {profile.role} / {profile.location}
            </p>
            <h1>{profile.name}</h1>
            <h2>{profile.headline}</h2>
            <p>{profile.summary}</p>
            <p className="mantra">{profile.mantra}</p>
            <div className="hero-meta" aria-label="Current profile status">
              <span>
                <CheckCircle2 size={16} /> {profile.availability}
              </span>
              <span>
                <MapPin size={16} /> Building from {profile.location}
              </span>
            </div>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                <BriefcaseBusiness size={18} /> View Work
              </a>
              <a
                className="button ghost"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Vikas Sampath GitHub profile"
              >
                <Github size={18} /> GitHub
              </a>
            </div>
            <div className="hero-credentials" aria-label="Professional highlights">
              {profile.highlights.map((highlight) => (
                <span key={highlight}>
                  <Award size={15} /> {highlight}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-stats" aria-label="Portfolio stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="signal-strip" aria-label="Portfolio snapshot">
          {profile.snapshot.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="section" id="work">
          <div className="section-heading">
            <p className="eyebrow">Selected Work</p>
            <h2>Projects with story, stack, and outcome.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title} style={{ '--accent': project.accent }}>
                <span className="project-index">0{index + 1}</span>
                <p>{project.type}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-outcome">
                  <CheckCircle2 size={16} />
                  <span>{project.outcome}</span>
                </div>
                <ul className="project-signals" aria-label={`${project.title} strengths`}>
                  {project.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
                <div className="stack">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <a
                  className="project-link"
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.title} on GitHub`}
                >
                  View repository <ArrowUpRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="approach">
          <div className="section-heading">
            <p className="eyebrow">Approach</p>
            <h2>Built around product clarity, clean systems, and useful intelligence.</h2>
          </div>
          <div className="focus-grid">
            {focusAreas.map((area, index) => {
              const Icon = focusIcons[index % focusIcons.length];
              return (
                <article className="focus-card" key={area.title}>
                  <Icon size={22} />
                  <h3>{area.title}</h3>
                  <p>{area.text}</p>
                </article>
              );
            })}
          </div>
          <div className="principle-row" aria-label="Delivery principles">
            {principles.map((principle, index) => {
              const Icon = principleIcons[index % principleIcons.length];
              return (
                <article key={principle.title}>
                  <Icon size={20} />
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section split" id="skills">
          <div className="section-heading">
            <p className="eyebrow">Toolkit</p>
            <h2>A practical stack for turning ideas into durable products.</h2>
          </div>
          <div className="skill-board">
            {skills.map((skill, index) => (
              <div className="skill-tile" key={skill}>
                <Code2 size={18} />
                <span>{skill}</span>
                <small>{String(index + 1).padStart(2, '0')}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="story">
          <div className="section-heading">
            <p className="eyebrow">Story</p>
            <h2>A concise path from learning to shipping.</h2>
          </div>
          <div className="timeline">
            {timeline.map((item) => (
              <article key={item.year}>
                <time>{item.year}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Let's build something useful.</h2>
            <p>{profile.availability}. Send a brief project idea, role, or collaboration note.</p>
          </div>
          <div className="contact-actions">
            <a className="button primary" href={`mailto:${profile.email}`}>
              <Mail size={18} /> Email Me
            </a>
            {profile.socials.map((social) => (
              <a
                className="icon-link"
                href={social.url}
                key={social.label}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
              >
                <SocialIcon label={social.label} />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        <span>{profile.initials}</span>
        <p>{profile.name} / AI, ML, and full-stack product development</p>
      </footer>
    </div>
  );
}

export default App;
