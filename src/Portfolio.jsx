// ============================================================
//  Portfolio.jsx — Rachid El Mekkaouy
//  React code only — all styles live in portfolio.css
//  Bootstrap 5 is used for grid/layout/form utilities
// ============================================================

import { useState, useEffect, useRef } from "react";
import "./portfolio.css";

// ── Data ────────────────────────────────────────────────────

const SKILLS = [
  { name: "JavaScript", icon: "⚡", color: "#F7DF1E", category: "Frontend" },
  { name: "React",      icon: "⚛",  color: "#61DAFB", category: "Frontend" },
  { name: "HTML",       icon: "🔶", color: "#E34F26", category: "Frontend" },
  { name: "CSS",        icon: "🎨", color: "#1572B6", category: "Frontend" },
  { name: "Bootstrap",  icon: "🅱",  color: "#7952B3", category: "Frontend" },
  { name: "PHP",        icon: "🐘", color: "#777BB4", category: "Backend"  },
  { name: "Laravel",    icon: "🔴", color: "#FF2D20", category: "Backend"  },
  { name: "Python",     icon: "🐍", color: "#3776AB", category: "Backend"  },
  { name: "OOP",        icon: "📦", color: "#00BCD4", category: "Backend"  },
  { name: "SQL",        icon: "🗄",  color: "#336791", category: "Database" },
  { name: "NoSQL",      icon: "🍃", color: "#4DB33D", category: "Database" },
  { name: "Cloud",      icon: "☁",  color: "#4285F4", category: "DevOps"   },
  { name: "Git",        icon: "🌿", color: "#F05032", category: "Tools"    },
  { name: "GitHub",     icon: "🐙", color: "#FFFFFF", category: "Tools"    },
  { name: "Excel",      icon: "📊", color: "#217346", category: "Office"   },
  { name: "Word",       icon: "📝", color: "#2B579A", category: "Office"   },
  { name: "PowerPoint", icon: "📑", color: "#D24726", category: "Office"   },
];

const PROJECTS = [
  {
    icon: "🛒",
    title: "E-Commerce Platform",
    desc: "Full-stack Laravel + React web store with payments integration and real-time inventory management.",
    tech: ["Laravel", "React", "MySQL"],
  },
  {
    icon: "📈",
    title: "Data Dashboard",
    desc: "Real-time analytics dashboard with Python backend, chart visualisations, and NoSQL storage.",
    tech: ["Python", "MongoDB", "React"],
  },
  {
    icon: "☁️",
    title: "Cloud API Service",
    desc: "Scalable REST API deployed on cloud infrastructure with auto-scaling and CI/CD pipeline.",
    tech: ["PHP", "Cloud", "SQL"],
  },
];

const CATEGORIES = ["All", "Frontend", "Backend", "Database", "DevOps", "Tools", "Office"];

const CONTACT_LINKS = [
  { icon: "📧", label: "rachidmeccaoui@gmail.com",           href: "mailto:rachidmeccaoui@gmail.com" },
  { icon: "💼", label: "linkedin.com/in/rachid-el-mekkaouy", href: "https://www.linkedin.com/in/rachid-el-mekkaouy" },
  { icon: "🐙", label: "github.com/rachidelmekkaouy",        href: "https://github.com/rachidelmekkaouy" },
];

// ── Custom Hook: IntersectionObserver ───────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

// ── Sub-components ──────────────────────────────────────────

function Navbar({ active, onNav, menuOpen, setMenuOpen }) {
  return (
    <>
      <nav className="portfolio-nav">
        {/* Logo */}
        <span className="nav-logo">R<span>.</span>E</span>

        {/* Desktop links — Bootstrap d-none d-md-flex */}
        <div className="desktop-nav d-none d-md-flex gap-4">
          {["home", "about", "skills", "projects", "contact"].map((s) => (
            <button
              key={s}
              className={`nav-link text-capitalize ${active === s ? "active" : ""}`}
              onClick={() => onNav(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Hamburger — visible on mobile */}
        <button
          className="hamburger btn p-0 text-white fs-4"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          {["home", "about", "skills", "projects", "contact"].map((s) => (
            <button key={s} className="nav-link text-capitalize" onClick={() => onNav(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function HeroSection({ heroRef, heroIn }) {
  return (
    <section id="home" className="hero-section">
      {/* Background orbs */}
      <div className="glow-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(124,110,255,0.15) 0%, transparent 70%)", top: -100, right: -100 }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(192,132,252,0.10) 0%, transparent 70%)", bottom: 0, left: -100 }} />

      {/* Bootstrap container-fluid with row */}
      <div className="container-fluid px-0 w-100" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="row align-items-center g-5" ref={heroRef}>

          {/* Text column */}
          <div className="col-12 col-lg-7">
            <p className={`section-label fade-up ${heroIn ? "visible" : ""}`}>Full Stack Developer</p>

            <h1 className={`hero-name fade-up ${heroIn ? "visible" : ""}`}>
              Rachid<br />El Mekkaouy<span className="hero-cursor" />
            </h1>

            <p className={`hero-subtitle fade-up ${heroIn ? "visible" : ""}`}>
              Building elegant, high-performance web applications from front to back.
              Passionate about clean code and seamless user experiences.
            </p>

            {/* CTA buttons */}
            <div className={`d-flex gap-3 flex-wrap fade-up ${heroIn ? "visible" : ""}`}>
              <button className="btn-primary-custom" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                View Projects
              </button>
              <button className="btn-outline-custom" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Contact Me
              </button>
            </div>

            {/* Stats — Bootstrap d-flex */}
            <div className="d-flex gap-4 mt-5 flex-wrap">
              {[["5+", "Years Exp."], ["20+", "Projects"], ["15+", "Technologies"]].map(([n, l]) => (
                <div key={l}>
                  <div className="hero-stat-number">{n}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Avatar column */}
          <div className="col-12 col-lg-5 d-flex justify-content-center">
            <div className="avatar-wrapper">
              <div className="avatar-ring-2" />
              <div className="avatar-ring" />
              <div className="avatar-pulse" />
              <div className="avatar-circle">👨‍💻</div>

              {/* Floating tech badges */}
              <div className="avatar-badge" style={{ top: "-10px", right: "0px",  border: "1px solid #61DAFB44" }}>⚛</div>
              <div className="avatar-badge" style={{ bottom: "20px", right: "-20px", border: "1px solid #777BB444" }}>🐘</div>
              <div className="avatar-badge" style={{ bottom: "0px",  left: "10px",  border: "1px solid #3776AB44" }}>🐍</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="container-fluid px-0" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="row align-items-center g-5">

          {/* Visual */}
          <div className="col-12 col-md-5 d-flex justify-content-center">
            <div className="about-visual">
              <div className="about-visual-glow" />
              <span style={{ position: "relative", zIndex: 1 }}>🚀</span>
            </div>
          </div>

          {/* Text */}
          <div className="col-12 col-md-7">
            <p className="section-label">About Me</p>
            <h2 className="section-title mb-4">Crafting Digital<br />Experiences</h2>
            <p className="mb-3" style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
              Hi! I'm <strong style={{ color: "#fff" }}>Rachid El Mekkaouy</strong>, a passionate full-stack
              developer with a strong foundation in both front-end and back-end technologies.
              I love turning complex problems into clean, elegant solutions.
            </p>
            <p className="mb-4" style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
              Whether it's building reactive UIs with React, crafting robust APIs with Laravel,
              or architecting cloud-deployed services, I bring dedication and creativity to every project.
            </p>

            {/* Tags */}
            <div className="d-flex gap-2 flex-wrap">
              {["Problem Solver", "Team Player", "Fast Learner", "Clean Code"].map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function SkillsSection({ skillsRef, skillsIn, filter, setFilter }) {
  const filtered = filter === "All" ? SKILLS : SKILLS.filter((s) => s.category === filter);

  return (
    <section id="skills" className="py-5 position-relative" style={{ background: "rgba(255,255,255,0.01)", padding: "100px clamp(20px,5vw,120px)" }}>
      <div className="glow-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 70%)", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* Heading */}
        <div className="text-center mb-5" ref={skillsRef}>
          <p className="section-label">What I Know</p>
          <h2 className="section-title">My Skills</h2>
        </div>

        {/* Filter pills — Bootstrap d-flex */}
        <div className="d-flex gap-2 flex-wrap justify-content-center mb-5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-btn ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Skills grid — Bootstrap row */}
        <div className="row g-3">
          {filtered.map((skill, i) => (
            <div key={skill.name} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div
                className={`skill-card fade-up ${skillsIn ? "visible" : ""}`}
                style={{ "--skill-color": skill.color, transitionDelay: `${i * 0.04}s` }}
              >
                <div className="skill-icon">{skill.icon}</div>
                <div className="skill-name">{skill.name}</div>
                <div className="skill-cat">{skill.category}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectsSection({ projRef, projIn }) {
  return (
    <section id="projects" style={{ padding: "100px clamp(20px,5vw,120px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={projRef}>

        <div className="text-center mb-5">
          <p className="section-label">Portfolio</p>
          <h2 className="section-title">Featured Projects</h2>
        </div>

        {/* Bootstrap row — 3 columns on large screens */}
        <div className="row g-4">
          {PROJECTS.map((p, i) => (
            <div key={p.title} className="col-12 col-md-6 col-lg-4">
              <div
                className={`project-card fade-up ${projIn ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="project-icon">{p.icon}</div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="d-flex gap-2 flex-wrap">
                  {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="project-arrow">→</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function ContactSection({ contactRef, contactIn }) {
  return (
    <section id="contact" className="contact-section" style={{ background: "rgba(255,255,255,0.01)" }}>
      <div className="glow-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(124,110,255,0.10) 0%, transparent 70%)", right: -200, bottom: -200 }} />

      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }} ref={contactRef}>

        <div className="text-center mb-5">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="mt-3" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
            Have a project in mind? Let's build something amazing together.
          </p>
        </div>

        {/* Contact form card */}
        <div className={`contact-card fade-up ${contactIn ? "visible" : ""}`}>

          {/* Bootstrap grid for Name / Email */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" placeholder="Your name" />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="your@email.com" />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input type="text" className="form-control" placeholder="Project discussion..." />
          </div>

          <div className="mb-4">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows={5} placeholder="Tell me about your project..." />
          </div>

          <button className="btn-primary-custom w-100">Send Message ✦</button>
        </div>

        {/* Contact links */}
        <div className="d-flex justify-content-center gap-4 mt-5 flex-wrap">
          {CONTACT_LINKS.map(({ icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="contact-link">
              <span>{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="portfolio-footer">
      {/* Bootstrap d-flex row */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <span className="footer-name">Rachid El Mekkaouy</span>
        <span className="footer-copy">© 2025 — Built with React ⚛</span>
        <span className="footer-role">Full Stack Developer</span>
      </div>
    </footer>
  );
}

// ── Main Component ───────────────────────────────────────────

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [filter,        setFilter]        = useState("All");

  const [heroRef,    heroIn]    = useInView(0.1);
  const [skillsRef,  skillsIn]  = useInView(0.1);
  const [projRef,    projIn]    = useInView(0.1);
  const [contactRef, contactIn] = useInView(0.1);

  const handleNav = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setActiveSection(id);
  };

  return (
    <div>
      <Navbar
        active={activeSection}
        onNav={handleNav}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <HeroSection    heroRef={heroRef}       heroIn={heroIn} />
      <AboutSection />
      <SkillsSection  skillsRef={skillsRef}   skillsIn={skillsIn} filter={filter} setFilter={setFilter} />
      <ProjectsSection projRef={projRef}      projIn={projIn} />
      <ContactSection contactRef={contactRef} contactIn={contactIn} />
      <Footer />
    </div>
  );
}