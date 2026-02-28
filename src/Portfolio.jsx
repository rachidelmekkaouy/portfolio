// ============================================================
//  Portfolio.jsx — Rachid El Mekkaouy
//  Features:
//    • Dark / Light mode toggle (persisted in localStorage)
//    • Working EmailJS contact form
//    • Scroll-based fade-in animations
//    • Responsive with Bootstrap 5 grid
//    • All styles live in portfolio.css
// ============================================================

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import "./portfolio.css";

// ── EmailJS credentials ──────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_uui1vpu";
const EMAILJS_TEMPLATE_ID = "template_xymphkr";
const EMAILJS_PUBLIC_KEY  = "9zR7F62tR73K2XVdM";

// ── Static Data ──────────────────────────────────────────────

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
  { name: "GitHub",     icon: "🐙", color: "#6e7681", category: "Tools"    },
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
    color: "#7EB8A0",
  },
  {
    icon: "📈",
    title: "Data Dashboard",
    desc: "Real-time analytics dashboard with Python backend, chart visualisations, and NoSQL storage.",
    tech: ["Python", "MongoDB", "React"],
    color: "#D4956A",
  },
  {
    icon: "☁️",
    title: "Cloud API Service",
    desc: "Scalable REST API deployed on cloud infrastructure with auto-scaling and CI/CD pipeline.",
    tech: ["PHP", "Cloud", "SQL"],
    color: "#7EB8D4",
  },
  {
    icon: "🎓",
    title: "Student Portal",
    desc: "Full-stack web application for managing student records, grades, and course enrollments.",
    tech: ["Laravel", "MySQL", "Bootstrap"],
    color: "#A07EB8",
  },
  {
    icon: "💬",
    title: "Real-time Chat App",
    desc: "Live messaging application with WebSocket support, rooms, and user authentication.",
    tech: ["React", "PHP", "NoSQL"],
    color: "#B8A07E",
  },
];

const CATEGORIES = ["All", "Frontend", "Backend", "Database", "DevOps", "Tools", "Office"];

const CONTACT_LINKS = [
  { icon: "📧", label: "rachidmeccaoui@gmail.com",           href: "mailto:rachidmeccaoui@gmail.com" },
  { icon: "💼", label: "linkedin.com/in/rachid-el-mekkaouy", href: "https://www.linkedin.com/in/rachid-el-mekkaouy" },
  { icon: "🐙", label: "github.com/rachidelmekkaouy",        href: "https://github.com/rachidelmekkaouy" },
];

// ── Custom Hook: useInView ───────────────────────────────────
// Uses the browser's IntersectionObserver API to detect when
// an element enters the viewport. Once visible, sets inView=true
// so we can trigger CSS fade-in animations.
// threshold=0.1 means the animation fires when 10% of the
// element is visible on screen.
function useInView(threshold = 0.1) {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once — no need to re-animate on scroll out
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    // Cleanup: disconnect observer when component unmounts
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// ── Custom Hook: useTheme ────────────────────────────────────
// Manages dark/light mode. Reads from localStorage on first
// load so the user's preference is remembered across sessions.
// Applies a "light" class to <html> which CSS uses to swap
// all CSS variables via [data-theme="light"] selectors.
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first; default to dark if nothing saved
    const saved = localStorage.getItem("portfolio-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    // Apply theme to the root <html> element so CSS variables update
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return [isDark, toggleTheme];
}

// ── Component: Navbar ────────────────────────────────────────
// Fixed top navigation with smooth-scroll links.
// The dark/light toggle lives here on the right side, next to
// the hamburger. isDark and onToggleTheme come from the parent.
function Navbar({ active, onNav, menuOpen, setMenuOpen, isDark, onToggleTheme }) {
  return (
    <>
      <nav className="portfolio-nav">
        {/* Logo — initials with accent dot */}
        <span className="nav-logo">R<span>.</span>E</span>

        {/* Desktop navigation links — hidden on mobile via Bootstrap */}
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

        {/* Right-side controls: theme toggle + hamburger (mobile) */}
        <div className="d-flex align-items-center gap-3">

          {/* Theme toggle — visible on ALL screen sizes inside the navbar */}
          <button
            className="theme-toggle-nav"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Hamburger icon — only visible on mobile */}
          <button
            className="hamburger btn p-0 fs-4"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

        </div>
      </nav>

      {/* Mobile fullscreen overlay menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          {["home", "about", "skills", "projects", "contact"].map((s) => (
            <button
              key={s}
              className="nav-link text-capitalize"
              onClick={() => onNav(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ── Component: HeroSection ───────────────────────────────────
// The main landing section. Uses the heroRef + heroIn from
// useInView to stagger the fade-up animations on all children.
// The decorative orbs are absolutely-positioned divs with
// blurred radial gradients — no images needed.
function HeroSection({ heroRef, heroIn }) {
  return (
    <section id="home" className="hero-section">

      {/* Decorative background glow orbs */}
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />
      <div className="glow-orb orb-3" />

      {/* Subtle dot-grid pattern overlay */}
      <div className="hero-grid-overlay" />

      <div className="container-fluid px-0 w-100" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="row align-items-center g-5" ref={heroRef}>

          {/* ── Left column: text content ── */}
          <div className="col-12 col-lg-7">

            {/* Badge label */}
            <div className={`hero-badge fade-up ${heroIn ? "visible" : ""}`}>
              <span className="hero-badge-dot" />
              Available for work
            </div>

            {/* Main heading — gradient animated text */}
            <h1 className={`hero-name fade-up ${heroIn ? "visible" : ""}`}>
              Rachid<br />
              <span className="hero-name-last">El Mekkaouy</span>
              <span className="hero-cursor" />
            </h1>

            {/* Role tag */}
            <p className={`hero-role fade-up ${heroIn ? "visible" : ""}`}>
              Full Stack Developer
            </p>

            <p className={`hero-subtitle fade-up ${heroIn ? "visible" : ""}`}>
              Building elegant, high-performance web applications from front to back.
              Passionate about clean code and seamless user experiences.
            </p>

            {/* Call-to-action buttons */}
            <div className={`d-flex gap-3 flex-wrap fade-up ${heroIn ? "visible" : ""}`}>
              <button
                className="btn-primary-custom"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Projects →
              </button>
              <button
                className="btn-outline-custom"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Let's Talk
              </button>
            </div>

            {/* Stats row */}
            <div className={`hero-stats fade-up ${heroIn ? "visible" : ""}`}>
              {[["1+", "Years Exp."], ["5+", "Projects"], ["15+", "Technologies"]].map(([n, l]) => (
                <div key={l} className="hero-stat">
                  <div className="hero-stat-number">{n}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: animated avatar — hidden on mobile ── */}
          <div className="col-12 col-lg-5 d-flex justify-content-center hero-avatar-col">
            <div className="avatar-wrapper">
              {/* Rotating dashed rings — pure CSS animation */}
              <div className="avatar-ring-2" />
              <div className="avatar-ring" />
              {/* Pulsing ring that fades out — creates "heartbeat" feel */}
              <div className="avatar-pulse" />
              {/* Main avatar circle with float animation */}
              <div className="avatar-circle">👨‍💻</div>

              {/* Floating tech badge icons around the avatar */}
              <div className="avatar-badge badge-react">⚛</div>
              <div className="avatar-badge badge-php">🐘</div>
              <div className="avatar-badge badge-python">🐍</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Component: AboutSection ──────────────────────────────────
// Static section — no scroll animation needed here since
// it's usually visible quickly after hero.
function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="container-fluid px-0" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="row align-items-center g-5">

          {/* Visual card with emoji and background glow */}
          <div className="col-12 col-md-5 d-flex justify-content-center">
            <div className="about-visual">
              <div className="about-visual-glow" />
              {/* Decorative code lines for visual interest */}
              <div className="about-code-lines">
                <span className="code-line cl-1" />
                <span className="code-line cl-2" />
                <span className="code-line cl-3" />
                <span className="code-line cl-4" />
              </div>
              <span className="about-emoji">🚀</span>
            </div>
          </div>

          {/* Text content */}
          <div className="col-12 col-md-7">
            <p className="section-label">About Me</p>
            <h2 className="section-title mb-4">
              Crafting Digital<br />
              <em>Experiences</em>
            </h2>
            <p className="about-text mb-3">
              Hi! I'm <strong>Rachid El Mekkaouy</strong>, a passionate full-stack
              developer with a strong foundation in both front-end and back-end technologies.
              I love turning complex problems into clean, elegant solutions.
            </p>
            <p className="about-text mb-4">
              Whether it's building reactive UIs with React, crafting robust APIs with Laravel,
              or architecting cloud-deployed services, I bring dedication and creativity to every project.
            </p>

            {/* Trait tags */}
            <div className="d-flex gap-2 flex-wrap">
              {["Problem Solver", "Team Player", "Fast Learner", "Clean Code"].map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            {/* Quick info row */}
            <div className="about-info-row mt-4">
              <div className="about-info-item">
                <span className="about-info-icon">📍</span>
                <span>Morocco</span>
              </div>
              <div className="about-info-item">
                <span className="about-info-icon">🎓</span>
                <span>Computer Science</span>
              </div>
              <div className="about-info-item">
                <span className="about-info-icon">💼</span>
                <span>Open to work</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Component: SkillsSection ─────────────────────────────────
// Filterable skill cards. The `filter` state lives in the
// parent (Portfolio) so it persists if the user scrolls away
// and comes back. CSS custom property --skill-color is set
// inline so each card can have a unique hover glow color.
function SkillsSection({ skillsRef, skillsIn, filter, setFilter }) {
  // Filter skills based on selected category
  const filtered = filter === "All"
    ? SKILLS
    : SKILLS.filter((s) => s.category === filter);

  return (
    <section id="skills" className="skills-section">
      <div className="glow-orb orb-skills" />

      <div className="section-container" ref={skillsRef}>

        {/* Section heading */}
        <div className="text-center mb-5">
          <p className="section-label">What I Know</p>
          <h2 className="section-title">My <em>Skills</em></h2>
        </div>

        {/* Category filter pills */}
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

        {/* Skills grid — Bootstrap responsive columns */}
        <div className="row g-3">
          {filtered.map((skill, i) => (
            <div key={skill.name} className="col-6 col-sm-4 col-md-3 col-lg-2">
              {/*
                transitionDelay staggers each card's fade-in.
                --skill-color is a CSS custom property used in
                the card's ::before pseudo-element for the glow.
              */}
              <div
                className={`skill-card fade-up ${skillsIn ? "visible" : ""}`}
                style={{
                  "--skill-color": skill.color,
                  transitionDelay: `${i * 0.04}s`,
                }}
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

// ── Component: ProjectsSection ───────────────────────────────
// Each project card has a unique accent color passed via the
// `color` field in PROJECTS data. This is used for the card's
// top border highlight and subtle glow on hover.
function ProjectsSection({ projRef, projIn }) {
  return (
    <section id="projects" className="projects-section">
      <div className="section-container" ref={projRef}>

        <div className="text-center mb-5">
          <p className="section-label">Portfolio</p>
          <h2 className="section-title">Featured <em>Projects</em></h2>
        </div>

        {/* Project cards grid */}
        <div className="row g-4">
          {PROJECTS.map((p, i) => (
            <div key={p.title} className="col-12 col-md-6 col-lg-4">
              <div
                className={`project-card fade-up ${projIn ? "visible" : ""}`}
                style={{
                  // Each card gets its own accent color for the top border
                  "--project-color": p.color,
                  transitionDelay: `${i * 0.12}s`,
                }}
              >
                {/* Colored top border accent line */}
                <div className="project-card-accent" />

                <div className="project-icon">{p.icon}</div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>

                {/* Tech stack tags */}
                <div className="d-flex gap-2 flex-wrap mt-auto">
                  {p.tech.map((t) => (
                    <span key={t} className="tag" style={{ "--tag-color": p.color }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Arrow icon — moves on hover via CSS */}
                <div className="project-arrow">→</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Component: ContactSection ────────────────────────────────
// Controlled form — each input is tied to `form` state.
// On submit, we call emailjs.send() with the form values.
// Status state drives the button label and feedback messages:
//   idle     → normal state
//   sending  → request in flight (button disabled)
//   sent     → success (green message, form cleared)
//   error    → failure (red message, user can retry)
//   validation → empty required fields (orange warning)
function ContactSection({ contactRef, contactIn }) {
  // Single state object for all form fields
  const [form, setForm] = useState({
    from_name:  "",
    from_email: "",
    subject:    "",
    message:    "",
  });

  // Track submission lifecycle
  const [status, setStatus] = useState("idle");

  // Generic change handler — updates only the changed field
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit handler — validates, then sends via EmailJS
  const handleSubmit = () => {
    // Basic required-field validation before calling the API
    if (!form.from_name.trim() || !form.from_email.trim() || !form.message.trim()) {
      setStatus("validation");
      return;
    }

    setStatus("sending");

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.from_name,
          from_email: form.from_email,
          subject:    form.subject || "No subject",
          message:    form.message,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setStatus("sent");
        // Clear the form after successful send
        setForm({ from_name: "", from_email: "", subject: "", message: "" });
        // Reset status after 5 seconds so user can send again
        setTimeout(() => setStatus("idle"), 5000);
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        setStatus("error");
      });
  };

  // Derive button label from current status
  const btnLabel = {
    idle:       "Send Message ✦",
    sending:    "Sending...",
    sent:       "Message Sent ✓",
    error:      "Try Again",
    validation: "Send Message ✦",
  }[status];

  return (
    <section id="contact" className="contact-section">
      <div className="glow-orb orb-contact" />

      <div className="section-container-sm" ref={contactRef}>

        {/* Heading */}
        <div className="text-center mb-5">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Let's Work <em>Together</em></h2>
          <p className="contact-subtitle mt-3">
            Have a project in mind? Let's build something amazing together.
          </p>
        </div>

        {/* Contact form card */}
        <div className={`contact-card fade-up ${contactIn ? "visible" : ""}`}>

          {/* Name + Email side by side on larger screens */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label">Name <span className="required">*</span></label>
              <input
                type="text"
                name="from_name"
                className="form-control"
                placeholder="Your name"
                value={form.from_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label">Email <span className="required">*</span></label>
              <input
                type="email"
                name="from_email"
                className="form-control"
                placeholder="your@email.com"
                value={form.from_email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Project discussion..."
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Message <span className="required">*</span></label>
            <textarea
              name="message"
              className="form-control"
              rows={5}
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={handleChange}
            />
          </div>

          {/* Inline status feedback messages */}
          {status === "validation" && (
            <div className="contact-status status-warning">
              ⚠ Please fill in Name, Email and Message.
            </div>
          )}
          {status === "error" && (
            <div className="contact-status status-error">
              ✕ Something went wrong. Please try again.
            </div>
          )}
          {status === "sent" && (
            <div className="contact-status status-success">
              ✓ Message sent! I'll get back to you soon.
            </div>
          )}

          {/* Submit button — disabled while sending or after success */}
          <button
            className={`btn-primary-custom w-100 ${status === "sent" ? "btn-sent" : ""}`}
            onClick={handleSubmit}
            disabled={status === "sending" || status === "sent"}
          >
            {btnLabel}
          </button>
        </div>

        {/* Social / contact links below the form */}
        <div className="contact-links-row">
          {CONTACT_LINKS.map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <span className="contact-link-icon">{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Component: Footer ────────────────────────────────────────
function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="footer-inner">
        <span className="footer-name">Rachid El Mekkaouy</span>
        <span className="footer-copy">© 2025 — Built with React ⚛</span>
        <span className="footer-role">Full Stack Developer</span>
      </div>
    </footer>
  );
}

// ── Main Component: Portfolio ────────────────────────────────
// Root component that:
//  1. Manages global state (active section, menu open, skill filter)
//  2. Creates IntersectionObserver refs for each animated section
//  3. Initialises EmailJS once on mount
//  4. Handles smooth-scroll navigation
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [filter,        setFilter]        = useState("All");
  const [isDark,        toggleTheme]      = useTheme();

  // Each section gets its own ref + visibility flag for animations
  const [heroRef,    heroIn]    = useInView(0.1);
  const [skillsRef,  skillsIn]  = useInView(0.1);
  const [projRef,    projIn]    = useInView(0.1);
  const [contactRef, contactIn] = useInView(0.1);

  // Initialise EmailJS once when the app mounts
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  // Update active nav link based on scroll position
  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "contact"];

    const handleScroll = () => {
      // Find which section is currently most visible in the viewport
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        // Section is "active" when its top half is in view
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth-scroll to a section by its HTML id
  const handleNav = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setActiveSection(id);
  };

  return (
    <div className="portfolio-root">
      <Navbar
        active={activeSection}
        onNav={handleNav}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <HeroSection
        heroRef={heroRef}
        heroIn={heroIn}
      />

      <AboutSection />

      <SkillsSection
        skillsRef={skillsRef}
        skillsIn={skillsIn}
        filter={filter}
        setFilter={setFilter}
      />

      <ProjectsSection
        projRef={projRef}
        projIn={projIn}
      />

      <ContactSection
        contactRef={contactRef}
        contactIn={contactIn}
      />

      <Footer />
    </div>
  );
}