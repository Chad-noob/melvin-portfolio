import { useEffect, useState } from 'react';
import './Projects.css';

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleMediaChange = (event) => {
      setIsMobileView(event.matches);
      if (!event.matches) {
        setExpandedProject(null);
      }
      setHoveredProject(null);
    };

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleProjectInteraction = (projectId) => {
    if (!isMobileView) {
      return;
    }

    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  const isProjectActive = (projectId) => {
    return (!isMobileView && hoveredProject === projectId) || expandedProject === projectId;
  };

  const projects = [
    {
      id: 3,
      name: "SnapDiff - AI Code Dependency Analyzer",
      category: "Design & Development",
      period: "03/2026 - Present",
      shortDesc: "AI Code Dependency Analyzer",
      description: [
        "Developed a tool that visualizes code dependencies and module relationships in JavaScript/React projects using interactive graphs.",
        "Implemented impact analysis to identify files affected by code changes, improving debugging and development efficiency.",
        "Enabled root dependency tracing to help developers quickly understand complex codebases.",
        "Assisted software testing by identifying affected modules, allowing focused regression testing."
      ],
      tools: "JavaScript, React.js, Interactive Graphs, Impact Analysis, Dependency Tracing",
      link: "https://github.com/Chad-noob/snapdiff",
      status: "completed"
    },
    {
      id: 1,
      name: "Simulation of Electronic Road Passing System",
      category: "Design & Development",
      period: "05/2024 – 07/2024",
      shortDesc: "Simulation of FASTAG",
      description: [
        "Designed and developed a web-based simulation of the FASTAG electronic toll collection system using HTML, CSS, and a database.",
        "The system included three functional modules-Transaction, Administration, and User Management-to replicate real-world toll processing. This project aimed to understand the automation of toll collection, improve operational efficiency, and reduce manual errors.",
        "The frontend provided an intuitive user interface, while the backend database managed vehicle data, user accounts, and transaction records, enabling smooth and secure toll deductions and administrative control."
      ],
      tools: "HTML, CSS, JavaScript, MySQL",
      link: "https://github.com/Chad-noob/RoadPassingSystem",
      status: "completed"
    },
    {
      id: 2,
      name: "High-Animation Web Experience for RoWeR India",
      category: "Design & Development",
      period: "08/2025 – 11/2025",
      shortDesc: "RoWeR India - Interactive Web Experience",
      description: [
        "Developed a highly interactive single-page website for Mechreatio Industrial Solutions India with animated logo loader and scroll-based effects.",
        "Implemented advanced animations including dynamic logo loader, GSAP timelines, ScrollTrigger effects, and smooth page transitions.",
        "The interface was designed specifically for potential customers, business partners, and stakeholders to explore the brand in a visually compelling way."
      ],
      tools: "React.js, Vite, GSAP (Timelines, ScrollTrigger), Framer Motion, Three.js, Tailwind CSS, Git, Node.js",
      link: "https://github.com/Chad-noob/ROWER-",
      status: "development"
    }
  ];

  return (
    <section className="projects-section">
      <div className="projects-container">
        <div className="section-label">RECENT WORK</div>
        
        <div className="projects-list">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`project-item ${isProjectActive(project.id) ? 'hovered' : ''}`}
              onMouseEnter={() => {
                if (!isMobileView) {
                  setHoveredProject(project.id);
                }
              }}
              onMouseLeave={() => {
                if (!isMobileView) {
                  setHoveredProject(null);
                }
              }}
              onClick={() => handleProjectInteraction(project.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="project-main">
                <div className="project-name-wrapper">
                  <h2 className="project-name">{project.name}</h2>
                </div>
                <div className="project-right">
                  {project.status === 'development' && isProjectActive(project.id) && (
                    <span className="status-badge">Under Development</span>
                  )}
                  <div className="project-category">{project.category}</div>
                  <button
                    type="button"
                    className="expand-indicator"
                    aria-label={isProjectActive(project.id) ? 'Collapse project details' : 'Expand project details'}
                    aria-expanded={isProjectActive(project.id)}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleProjectInteraction(project.id);
                    }}
                  >
                    {isProjectActive(project.id) ? '−' : '+'}
                  </button>
                </div>
              </div>
              
              {/* Expanded Details */}
              <div className={`project-details ${isProjectActive(project.id) ? 'visible' : ''}`}>
                <div className="project-info-grid">
                  <div className="project-info-left">
                    <h3 className="project-subtitle">{project.shortDesc}</h3>
                    <div className="project-description">
                      {project.description.map((para, idx) => (
                        <p key={idx} className="desc-paragraph">• {para}</p>
                      ))}
                    </div>
                    <div className="project-period">{project.period}</div>
                    <div className="project-tools">
                      <span className="tools-label">Tools Used:</span> {project.tools}
                    </div>
                  </div>
                  <div className="project-info-right">
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
