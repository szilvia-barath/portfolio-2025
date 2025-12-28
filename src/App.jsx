// App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ========================= Data ========================= */
const SKILLS = [
  "JavaScript","React","Node.js","CSS","Tailwind","SVG","D3","Framer Motion","GSAP","Vite",
  "Testing","Accessibility","GraphQL","REST APIs","Next.js","Wordpress","Canva","Affinity",
  "Three.js", "Procreate","Photoshop","Blender","Figma","Resolume Arena","Usability Testing","Wireframing",
  "Prototyping","UI/UX Design","Digital Humanities","Curriculum Development","Data Visualization",
  "Teaching","Workshop Facilitation"
];

const PROJECTS = [
  { title: "Nebula visuals", description: "Coded visuals that react to your hand movement.", link: "https://szilvia-barath.github.io/nebula/", tags: ["Three.js", "Visuals"], image: "nebula.png" },

  {
    title: "Noisy Frequencies",
    description: "Audio-reactive music and sound visualizer.",
    link: "https://szilvia-barath.github.io/audio-reactive-visuals/",
    tags: ["SVG","Audio","Animation"],
    image: "audio-viz.png",
  },
  {
    title: "<Ada_Lovelace>",
    description: "Interactive storytelling about Ada Lovelace with layered parallax.",
    link: "https://szilvia-barath.github.io/ada-lovelace/",
    tags: ["HTML","CSS","JS","Parallax"],
    image: "ada.jpg",
  },
  {
    title: "Ghost Grid",
    description: "Generative poster tool using grid glitches.",
    link: "https://szilvia-barath.github.io/ghost-grid/",
    tags: ["Canvas","Generative","Creative"],
    image: "ghost-grid.png",
  },

];
const POSTS = [
  {
    slug: "grunge-web-design",
    title: "Grunge Web Design as a tool of engagement",
    excerpt: "Subversion, signal noise, and the return of the unreadable.",
    date: "2025-12-16",
    cover: "raygun.jpg",
    content: `I’ve been thinking a lot about Ray Gun Magazine. If you’ve never seen it, imagine a layout so chaotic you can’t always tell where the article ends and the ad begins. Sometimes the font is sideways. Sometimes you get a page printed in dingbats. And somehow, it still feels like reading.
   Ray Gun’s aesthetic was illegibility as ideology. It said: you don’t get to skim this. You have to pause, you have to engage.
   Now, this spirit is resurfacing in web design. I think the return of “grunge UX”, broken grids, overloaded typography, is our way of pushing back against hyper-optimized, sterile interfaces that treat users like heatmaps.
   I’ve been experimenting with these ideas in my own frontend work. Embracing noise textures, misalignments, flickers. In teaching, we’re always told: don’t make your site too complex, too weird, too unreadable. But I wonder: what if unreadability is the message?`,
  },
  {
    slug: "ode-to-horizontal-scroll-sites",
    title: "An Ode to Horizontal Scroll Sites",
    excerpt: "Wandering sideways through webspace.",
    date: "2025-12-18",
    cover: "hscroll.jpg",
    content: `There’s something deeply satisfying about horizontal scroll sites. When you scroll sideways, it feels less like scrolling a document and more like flipping through an unfolding reel of thought. I’ve used horizontal scroll in my recent experiments and I keep coming back to it as a mode of narrative because they feel cinematic and speculative. It turns the page sideways and invites you to wander, not just consume.  `,
  },
  {
    slug: "visuals-that-feel",
    title: "Visuals That Feel: Design and Synesthesia",
    excerpt: "What does blue sound like?",
    date: "2025-11-29",
    cover: "visuals.gif",
    content: `When I’m designing, especially in Procreate, Resolume Arena or building web layouts, I sometimes find myself describing color palettes as “fizzy” or linework as “sharp like static.”

This instinct led me into the strange and rich world of synesthesia: a neurological phenomenon where senses blend. People with synesthesia might hear shapes, see sounds, or feel textures when reading letters. What fascinates me isn’t just the condition itself, but what it reveals: that design has always been sensory.

When I draw or layout a site, I want the user to feel something before they read anything.
My current challenge: to make digital experiences that vibrate with more than pixels. `,
  },
  {
    slug: "curricula-analysis",
    title: "Reading Between Curricula: Comparing DH at UNIBO and ELTE",
    excerpt: "What are we really teaching when we teach Digital Humanities?",
    date: "2025-12-09",
    cover: "conference.JPG",
    content: `Earlier this year, I had the privilege of presenting my findings about the syllabi of two European DH programs, the University of Bologna (UNIBO) and Eötvös Loránd University (ELTE) at DH_YR ELTE 2025. On paper, both offer rigorous, exciting, digitally literate programs. But when you step back, squint, and ask: what version of DH are these institutions cultivating? You begin to see the outlines of different futures.
   My biggest takeaway? Digital Humanities is not one discipline. It's a prism. The differences between these programs aren’t weaknesses. They’re reflections of broader cultural, institutional, and even generational visions for what counts as knowledge in a digital age.
    `,
  },
];

export default function App() { return <Root />; }

/* ========================= Root & Router ========================= */
function Root() {
  const route = useHashRoute();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="h-full bg-white text-neutral-900 selection:bg-pink-300/40 selection:text-neutral-900">

      {/* ADD THE NAVBAR HERE */}
      <Navbar routeName={route.name} />

      {route.name !== "post" && <OverlayArrows routeName={route.name} />}

      <EnvelopeButton onClick={() => setContactOpen(true)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {route.name === "post" ? (
        // Add top padding so content isn't hidden behind fixed navbar
        <div className="pt-16">
          <BlogPostPage slug={route.params.slug} />
        </div>
      ) : (
        <HomeSections initialSection={route.name} />
      )}
    </div>
  );
}

function useHashRoute() {
  const parse = () => {
    const hash = window.location.hash || "#/";
    if (hash.startsWith("#/post/")) {
      const slug = decodeURIComponent(hash.replace("#/post/", ""));
      return { name: "post", params: { slug } };
    }
    if (hash.startsWith("#/blog")) return { name: "blog", params: {} };
    if (hash.startsWith("#/projects")) return { name: "projects", params: {} };
    return { name: "home", params: {} };
  };
  const [route, setRoute] = useState(parse());
  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}
/* ========================= Scroll Arrows ========================= */
function ScrollArrows() {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Check scroll position to toggle visibility
  useEffect(() => {
    const scroller = document.querySelector('[data-hscroll]');
    if (!scroller) return;

    const checkScroll = () => {
      // buffer of 10px to avoid flickering
      const isAtStart = scroller.scrollLeft < 10;
      const isAtEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 10;

      setShowLeft(!isAtStart);
      setShowRight(!isAtEnd);
    };

    scroller.addEventListener("scroll", checkScroll);
    // Check initially
    checkScroll();

    return () => scroller.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction) => {
    const scroller = document.querySelector('[data-hscroll]');
    if (scroller) {
      // Scroll by one viewport width
      const amount = window.innerWidth;
      scroller.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const btnClass =
    "fixed top-1/2 z-40 hidden md:flex items-center justify-center w-12 h-12 -translate-y-1/2 rounded-full " +
    "bg-neutral-950/50 backdrop-blur-sm border border-white/10 text-white shadow-lg transition-all duration-300 " +
    "hover:bg-neutral-950 hover:border-pink-500 hover:text-pink-500 hover:scale-110 active:scale-95 cursor-pointer";

  return (
    <>
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={`${btnClass} left-6 ${showLeft ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        aria-label="Scroll Left"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={`${btnClass} right-6 ${showRight ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        aria-label="Scroll Right"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </>
  );
}
/* ========================= Navbar & Progress ========================= */
function Navbar({ routeName }) {
  const [activeSection, setActiveSection] = useState("home");
  const [progress, setProgress] = useState(0);

  // Handle Scroll Progress & Active State Detection
  useEffect(() => {
    // We only track scroll if we are on the home/main route
    if (routeName === "post") {
      setProgress(100);
      return;
    }

    const scroller = document.querySelector('[data-hscroll]');
    if (!scroller) return;

    const onScroll = () => {
      const scrollLeft = scroller.scrollLeft;
      const width = scroller.clientWidth;
      const scrollWidth = scroller.scrollWidth;

      // 1. Calculate Progress %
      const maxScroll = scrollWidth - width;
      const pct = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setProgress(pct);

      // 2. Calculate Active Section based on scroll position
      // Since sections are w-screen (100vw), we can calculate index
      const index = Math.round(scrollLeft / width);
      const sectionNames = ["home", "about", "skills", "projects", "blog"];
      // Guard against out of bounds
      if (sectionNames[index]) {
        setActiveSection(sectionNames[index]);
      }
    };

    scroller.addEventListener("scroll", onScroll);
    // Trigger once on mount
    onScroll();

    return () => scroller.removeEventListener("scroll", onScroll);
  }, [routeName]);

  const handleNavClick = (sectionId) => {
    // If we are on a blog post, go home first
    if (routeName === "post") {
      window.location.hash = "#/";
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "section-home", label: "Home", key: "home" },
    { id: "section-about", label: "About", key: "about" },
    { id: "section-skills", label: "Skills", key: "skills" },
    { id: "section-projects", label: "Projects", key: "projects" },
    { id: "section-blog", label: "Blog", key: "blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        {/* Logo / Name */}
        <div
          onClick={() => handleNavClick("section-home")}
          className="text-lg font-black tracking-widest text-white uppercase transition-colors cursor-pointer select-none hover:text-pink-500"
        >
          SB<span className="text-pink-500">.</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.key && routeName !== "post";
            return (
              <li key={item.key}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive ? "text-pink-500" : "text-neutral-400 hover:text-pink-400"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Icon (Simple placeholder if needed, or keep hidden) */}
        <div className="text-xs tracking-widest uppercase md:hidden text-neutral-400">
           {routeName === 'post' ? 'Blog' : activeSection}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
        <div
          className="h-full transition-all duration-100 ease-out bg-gradient-to-r from-pink-600 to-pink-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
/* ========================= Home Sections ========================= */
/* ========================= Home Sections ========================= */
function HomeSections({ initialSection }) {
  const scrollerRef = useRef(null);
  useHorizontalWheel(scrollerRef);

  useEffect(() => {
    if (!scrollerRef.current) return;
    if (initialSection === "projects") {
      document.getElementById("section-projects")?.scrollIntoView({ inline: "start", behavior: "smooth" });
    } else if (initialSection === "blog") {
      document.getElementById("section-blog")?.scrollIntoView({ inline: "start", behavior: "smooth" });
    }
  }, [initialSection]);

  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <>
      {/* 1. Add the Arrows here */}
      <ScrollArrows />

      {/* 2. The Scroll Container */}
      <div
        ref={scrollerRef}
        data-hscroll
        className="h-screen w-screen overflow-x-scroll overflow-y-hidden snap-x snap-mandatory flex scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Section id="section-home" className="relative"><Hero /></Section>

        <IllustrationSplit id="section-about" side="left" image="/me.png">
          <PinkHeadline>About</PinkHeadline>
          <div className="mt-4 text-[15px] leading-relaxed space-y-4">
            <p>I blend the analytical with the artistic, uniting frontend development with digital humanities to design thoughtful, tactile experiences. My work lives at the intersection of code, culture, and pedagogy.</p>
            <p>With a dual background in Digital Humanities and Education, I explore how interface design and visual storytelling can enrich knowledge sharing. Whether building visual narratives, facilitating workshops, or preserving digital archives, I aim to make technology more human.</p>
          </div>
          <ul className="flex flex-wrap gap-2 mt-6">
            {["Design", "Frontend", "Digital Humanities", "Education", "Art and creativity"].map((k) => (
              <li key={k} className="px-2.5 py-1 text-[10px] uppercase tracking-widest border border-neutral-300 bg-white hover:border-pink-500/60 transition -rotate-1">{k}</li>
            ))}
          </ul>
        </IllustrationSplit>

        <div id="section-skills" className="contents">
          <GalaxySplit side="right" hoveredSkill={hoveredSkill}>
            <PinkHeadline>Skills</PinkHeadline>
            <p className="mt-4 mb-6 text-sm md:text-base">Hover over the skills to locate them in the galaxy.</p>
            <p className="mt-4 mb-6 text-sm md:text-base">From expressive code to thoughtful interaction, these are the tools I use to build stories and systems, on the web, in the classroom, and beyond.</p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SKILLS.map((s, i) => (
                <span
                  key={s}
                  onMouseEnter={() => setHoveredSkill(s)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`cursor-crosshair text-[11px] uppercase tracking-widest px-2 py-1 border bg-white ${i % 3 === 0 ? "-rotate-1" : "rotate-1"} border-neutral-300 hover:border-pink-500 hover:bg-pink-50 transition`}
                >
                  {s}
                </span>
              ))}
            </div>
          </GalaxySplit>
        </div>

        <Section id="section-projects" className="relative">
          <div className="flex w-full h-full">
            <div className="relative hidden w-1/2 h-full overflow-hidden border-r md:block bg-neutral-100 border-neutral-200">
              <img src="/drawing-spiral.png" className="absolute inset-0 object-cover w-full h-90 opacity-90" alt="" />
              <div className="absolute inset-0 bg-pink-500/10 mix-blend-multiply" />
            </div>
            <div className="relative w-full h-full px-6 py-12 pt-24 overflow-y-auto bg-white md:w-1/2 md:px-16 md:py-20">
              <div className="max-w-3xl mx-auto">
                <PinkHeadline>Projects</PinkHeadline>
                <p className="mt-4 text-sm md:text-base">Selected work exploring motion, data, and narrative on the web.</p>
                <p className="mt-2 text-sm md:text-base">These selected works reflect my fascination with interactivity, storytelling, and speculative aesthetics. Many draw from the cultural archive or remix visual media in new formats.</p>
                <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
                  {PROJECTS.map((p, i) => (<ProjectCard key={i} project={p} index={i} />))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        <IllustrationSplit side="right" image="/drawing-eye.png" id="section-blog">
          <PinkHeadline>Blog</PinkHeadline>
          <p className="mt-4 text-sm md:text-base">Notes on interfaces, visuals, and teaching.</p>
          <p className="mt-2 text-sm md:text-base">Reflections on design, web culture, and creative pedagogy.</p>
          <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-2">
            {POSTS.map((p) => (<BlogCard key={p.slug} post={p} />))}
          </div>
          <div className="mt-8">
            <a href="#/blog" className="inline-block px-3 py-2 hidden text-[11px] uppercase tracking-[0.25em] border border-neutral-300 hover:border-pink-500 transition">Read All Entries</a>
          </div>
        </IllustrationSplit>

        <Section className="relative"><Footer /></Section>
      </div>
    </>
  );
}

/* ========================= Layout Helpers ========================= */
function Section({ children, className = "", id = "" }) {
  return <section id={id} className={`min-w-full h-screen snap-start relative ${className}`}>{children}</section>;
}

function IllustrationSplit({ side = "left", image, children, id="" }) {
  const leftImage = side === "left";
  return (
    <section id={id} className="relative flex h-screen min-w-full overflow-hidden bg-white snap-start">
      <div className={`hidden md:block absolute top-0 bottom-0 ${leftImage ? "left-0" : "right-0"} w-1/2 overflow-hidden`}>
        <div className="absolute inset-0 scale-105 -rotate-1">
          <div className="w-full h-full bg-neutral-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
          <img src={image} alt="" className="absolute inset-0 object-cover w-full h-full opacity-90" draggable={false} />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-pink-500/5 mix-blend-multiply" />
      </div>
      <div className={`w-full md:w-1/2 h-full flex flex-col relative z-10 ${leftImage ? "ml-auto" : "mr-auto"}`}>
        <div className="flex-1 px-6 py-12 overflow-y-auto md:px-16 md:py-20">
          <div className={`max-w-2xl ${leftImage ? "ml-auto md:mr-12" : "mr-auto md:ml-12"}`}>{children}</div>
        </div>
      </div>
    </section>
  );
}

function GalaxySplit({ side = "right", hoveredSkill, children }) {
  return (
    <section className="relative flex h-screen min-w-full overflow-hidden bg-white snap-start">
      <div className="relative z-10 flex flex-col w-full h-full md:w-1/2">
        <div className="flex flex-col justify-center flex-1 px-6 py-12 overflow-y-auto md:px-16 md:py-20">
          <div className="max-w-2xl ml-auto md:mr-12">{children}</div>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 right-0 hidden w-1/2 overflow-hidden md:block bg-neutral-950">
        <GalaxySkills skills={SKILLS} hoveredSkill={hoveredSkill} />
      </div>
    </section>
  );
}

/* ========================= Galaxy Visualization ========================= */
function GalaxySkills({ skills, hoveredSkill }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const count = skills.length;
    const stars = skills.map((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const rNorm = i / count;
      const r = rNorm * 0.8;
      return { skill, rBase: r, thetaBase: theta, size: Math.random() * 2 + 1, color: `hsl(${Math.random() * 60 + 280}, 80%, 70%)` };
    });

    const bgStars = Array.from({ length: 100 }).map(() => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, size: Math.random() * 1, alpha: Math.random() * 0.5 }));

    let animationId; let time = 0;

    const render = () => {
      time += 0.002;
      const { width, height } = canvas;
      const cx = width / 2; const cy = height / 2; const minDim = Math.min(width, height) / 2;

      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'white';
      bgStars.forEach(s => { const x = cx + s.x * width; const y = cy + s.y * height; ctx.globalAlpha = s.alpha; ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill(); });

      stars.forEach(s => {
        const currentTheta = s.thetaBase + time;
        const x = cx + Math.cos(currentTheta) * (s.rBase * minDim);
        const y = cy + Math.sin(currentTheta) * (s.rBase * minDim);
        const isHovered = s.skill === hoveredSkill;

        ctx.globalAlpha = isHovered ? 1 : 0.8;
        ctx.fillStyle = isHovered ? '#fbbf24' : s.color;
        const size = isHovered ? s.size * 3.5 : s.size;

        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
          ctx.beginPath(); ctx.arc(x, y, size * 4, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = 'white'; ctx.font = '12px sans-serif'; ctx.fillText(s.skill, x + 15, y + 4);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth; canvas.height = parent.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize(); render();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationId); };
  }, [skills, hoveredSkill]);

  return <canvas ref={canvasRef} className="block w-full h-full" />;
}

/* ========================= Hero (shader + controls IN THIS FILE) ========================= */
function Hero() {
  const [controls, setControls] = useState({ count: 8, speed: 1.0, bias: 0.0, follow: 1.0, reduce: false });
  const setField = (k) => (e) => setControls((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : Number(e.target.value) }));

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden bg-neutral-950">
      <LiquidHeroBackground
        poster={null}
        count={controls.count}
        speed={controls.speed}
        bias={controls.bias}
        follow={controls.follow}
        reduceOverride={controls.reduce}
      />
      <div className="relative z-10 max-w-6xl px-8 text-center md:px-16">
        <h1 className="text-[13vw] leading-none font-black tracking-tight uppercase select-none [filter:url(#distort)] drop-shadow-[0_4px_0_rgba(0,0,0,0.35)] text-neutral-50 mix-blend-overlay" aria-label="Portfolio">
          <span className="inline-block -rotate-3">Hello</span>
          <span className="inline-block ml-4 rotate-2">World</span>
        </h1>
        <p className="mt-6 md:mt-8 text-white/90 max-w-3xl mx-auto text-sm md:text-base [text-wrap:balance] drop-shadow-md font-medium">
          Creative technologist | Digital Humanities Researcher | Educator
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <a href="#/blog" className="px-5 py-3 text-xs tracking-widest text-white uppercase transition-all duration-300 border rounded border-white/30 hover:border-white bg-black/20 hover:bg-black/40 backdrop-blur">Read Blog</a>
          <a href="#/projects" className="px-5 py-3 text-xs tracking-widest text-white uppercase transition-all duration-300 border rounded border-white/30 hover:border-white bg-white/10 hover:bg-white/20">See Projects</a>
        </div>
      </div>
      <HeroControls controls={controls} setField={setField} />
    </div>
  );
}

function HeroControls({ controls, setField }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="absolute z-20 left-4 bottom-4">
      <div className="border border-white/20 bg-black/30 backdrop-blur rounded-md p-3 text-white w-[280px] hidden md:block">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase opacity-80">Liquid Controls</span>
          <button onClick={() => setOpen((v) => !v)} className="text-[10px] uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded hover:bg-white/10">{open ? "Hide" : "Show"}</button>
        </div>
        {open && (
          <div className="mt-3 space-y-3">
            <LabeledRange label="Blobs" min={1} max={16} step={1} value={controls.count} onChange={setField("count")} />
            <LabeledRange label="Speed" min={0.2} max={2.0} step={0.05} value={controls.speed} onChange={setField("speed")} />
            <LabeledRange label="Color Bias" min={-1} max={1} step={0.01} value={controls.bias} onChange={setField("bias")} />
            <LabeledRange label="Follow" min={0} max={2} step={0.05} value={controls.follow} onChange={setField("follow")} />
            <label className="flex items-center justify-between text-xs">
              <span>Reduced Motion</span>
              <input type="checkbox" checked={controls.reduce} onChange={setField("reduce")} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function LabeledRange({ label, ...props }) {
  return (
    <label className="block text-xs">
      <div className="flex items-center justify-between mb-1"><span>{label}</span><span className="opacity-70">{props.value}</span></div>
      <input type="range" className="w-full accent-pink-400" {...props} />
    </label>
  );
}

/* ========================= WebGL Liquid Background ========================= */
function LiquidHeroBackground({
  poster,
  count = 8,
  speed = 1.0,
  bias = 0.0,   // -1..1: shifts color palette
  follow = 1.0, // 0..2: mouse attraction strength
  reduceOverride = false,
}) {
  const canvasRef = useRef(null);

  // Detect reduced motion preference
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // --- Shaders ---
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_count;
      uniform float u_bias;
      uniform float u_follow;

      // Color Palette Function (iquilezles.org/articles/palettes)
      vec3 palette( in float t ) {
        // Bias shifts the cosine phase to create different color moods
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557) + (u_bias * 0.2);
        return a + b * cos( 6.28318 * (c * t + d) );
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        vec2 mouse = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        // Background color (Deep dark blue/slate)
        vec3 finalColor = vec3(0.02, 0.04, 0.08);

        float totalField = 0.0;

        // Loop through blobs (Max 16 for performance/style)
        for (float i = 0.0; i < 16.0; i++) {
            if (i >= u_count) break;

            // Unique offsets for each blob
            float t = u_time * (0.5 + i * 0.05);
            float radius = 0.4 + sin(t * 0.8) * 0.1;

            // Lissajous-like movement
            vec2 pos = vec2(
                sin(t * 0.9 + i),
                cos(t * 1.2 + i * 1.5)
            );

            // Mouse Influence (Lerp position towards mouse based on u_follow)
            // We dampen it so they don't snap instantly
            pos = mix(pos, mouse, u_follow * 0.4);

            // Metaball function: 1 / distance
            float dist = length(uv - pos);

            // Add to field strength (exponent controls "goopiness")
            totalField += 0.08 / pow(dist, 1.2);
        }

        // Thresholding to draw the blobs
        // If field strength is high, we are inside a blob
        if (totalField > 0.6) {
            // Map the field value to color
            vec3 blobColor = palette(totalField * 0.5 + u_time * 0.2);

            // Smooth edges (anti-aliasing the threshold)
            float alpha = smoothstep(0.6, 0.65, totalField);
            finalColor = mix(finalColor, blobColor, alpha);

            // Add a "rim light" effect
            float rim = smoothstep(0.65, 0.8, totalField) - smoothstep(0.8, 1.2, totalField);
            finalColor += vec3(1.0) * rim * 0.2;
        }

        // Vignette
        float vign = length(uv);
        finalColor *= 1.0 - vign * 0.5;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // --- WebGL Boilerplate ---
    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    // --- Attributes & Uniforms ---
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Two triangles covering the screen
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uCountLoc = gl.getUniformLocation(program, "u_count");
    const uBiasLoc = gl.getUniformLocation(program, "u_bias");
    const uFollowLoc = gl.getUniformLocation(program, "u_follow");

    // --- State ---
    let animationId;
    let startTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;

    // Smooth mouse (interpolation)
    let targetX = 0;
    let targetY = 0;

    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      targetX = t.clientX;
      // WebGL Y is usually inverted relative to screen, but we handle it in shader
      // passing raw screen Y is fine if we normalize correctly there.
      // Here we pass (0,0) top-left to (width, height) bottom-right pixels
      targetY = canvas.height - t.clientY; // Invert Y for GL coords
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);

    // --- Resize Handler ---
    const resize = () => {
      const parent = canvas.parentElement;
      if(parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener("resize", resize);
    resize();

    // --- Loop ---
    const render = () => {
      if (!reduceMotion && !reduceOverride) {
         animationId = requestAnimationFrame(render);
      } else {
         // Render one frame and stop if reduced motion
         animationId = null;
      }

      const now = performance.now();
      const time = (now - startTime) * 0.001 * speed;

      // Smooth mouse
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTimeLoc, time);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouseX, mouseY);
      gl.uniform1f(uCountLoc, count);
      gl.uniform1f(uBiasLoc, bias);
      gl.uniform1f(uFollowLoc, follow);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      if (animationId) cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
    };
  }, [count, speed, bias, follow, reduceMotion, reduceOverride]);

  return (
    <div className="absolute inset-0 bg-neutral-950">
      {poster && (
        <img
            src={poster}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${reduceMotion || reduceOverride ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

/* ========================= Cards ========================= */
function ProjectImage({ src, alt, className = "" }) {
  const [err, setErr] = useState(false);
  const shownSrc = err ? "" : src;
  if (!src || err) return <div className={`w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300 text-xs uppercase tracking-widest ${className}`}>No Image</div>;
  return <img src={shownSrc} alt={alt} loading="lazy" onError={() => setErr(true)} className={className} draggable={false} />;
}

function ProjectCard({ project }) {
  return (
    <a href={project.link} target="_blank" rel="noreferrer" className="flex flex-col p-4 transition-all bg-white border rounded-sm group border-neutral-300 hover:shadow-lg hover:border-pink-300">
      <div className="relative overflow-hidden aspect-video bg-neutral-100">
        <ProjectImage src={project.image} alt={project.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-black tracking-widest uppercase truncate"><span className="transition-colors group-hover:text-pink-600">{project.title}</span></h3>
        <p className="mt-1 text-xs text-neutral-600 line-clamp-2">{project.description}</p>
        <div className="mt-2 flex flex-wrap gap-1 text-[9px] tracking-wider uppercase opacity-70">
          {project.tags.slice(0, 3).map((t) => (<span key={t} className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200">{t}</span>))}
        </div>
      </div>
    </a>
  );
}

function BlogCard({ post }) {
  return (
    <a href={`#/post/${encodeURIComponent(post.slug)}`} className="block overflow-hidden transition-all bg-white border rounded-sm border-neutral-300 group hover:border-pink-400">
      <div className="relative aspect-[2/1] bg-neutral-100 overflow-hidden">
        <img src={`./${post.cover}`} alt="" className="absolute inset-0 object-cover w-full h-full transition duration-700 group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        <time className="absolute bottom-2 left-3 text-[10px] text-white tracking-widest font-medium">{new Date(post.date).toLocaleDateString()}</time>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-black tracking-widest uppercase transition group-hover:text-pink-600">{post.title}</h3>
        <p className="mt-2 text-xs text-neutral-600 line-clamp-2">{post.excerpt}</p>
      </div>
    </a>
  );
}

/* ========================= Blog Page ========================= */
function BlogPostPage({ slug }) {
  const post = POSTS.find((p) => p.slug === slug);
  return (
    <div className="w-screen min-h-screen overflow-y-auto bg-white text-neutral-900">
      <div className="max-w-3xl px-6 py-10 mx-auto md:px-10">
        <div className="flex items-center justify-between">
          <a href="#/projects" className="text-xs tracking-widest uppercase transition border-b border-neutral-300 hover:border-pink-500 hover:text-pink-600">← Back to Projects</a>
        </div>
        {!post ? (
          <div className="mt-20 text-center"><h1 className="text-4xl font-black uppercase">Post Not Found</h1></div>
        ) : (
          <article className="mt-12">
            <header>
              <PinkHeadline>{post.title}</PinkHeadline>
              <div className="relative mt-6 overflow-hidden rounded-sm aspect-video bg-neutral-100">
                <img src={post.cover} className="object-cover w-full h-full" alt="" />
              </div>
            </header>
            <div className="mt-8 prose prose-neutral prose-headings:uppercase prose-headings:font-bold prose-a:text-pink-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </article>
        )}
        <div className="h-24" />
      </div>
    </div>
  );
}

/* ========================= Reused UI ========================= */
function PinkHeadline({ children }) {
  return (
    <div className="inline-block -rotate-1">
      <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl"><span className="px-2 bg-pink-100 text-neutral-900">{children}</span></h2>
      <div className="w-16 h-1 mt-1 bg-pink-500" />
    </div>
  );
}

function useHorizontalWheel(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onWheel = (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); el.scrollLeft += e.deltaY; } };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);
}

function OverlayArrows() {
  return (
    <div className="fixed inset-0 z-40 hidden pointer-events-none md:block">
      <div className="absolute flex hidden gap-2 right-4 bottom-4">
        <div className="text-[10px] uppercase tracking-widest text-neutral-400 bg-white/80 backdrop-blur px-2 py-1 rounded border border-neutral-200">
          Scroll / Shift+Scroll
        </div>
      </div>
    </div>
  );
}

function EnvelopeButton({ onClick }) {
  return (
    <button onClick={onClick} className="fixed z-50 p-3 transition border rounded-full top-10 right-4 border-neutral-300 bg-white/70 backdrop-blur hover:border-pink-500 hover:text-pink-600">
      <span className="sr-only">Contact</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16v12H4z" /><path dName="envelope" d="M22 6l-10 7L2 6" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    </button>
  );
}

function ContactModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid p-6 place-items-center">
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md p-8 bg-white rounded shadow-2xl">
        <h3 className="text-2xl font-black tracking-widest text-pink-500 uppercase">Say Ciao</h3>
        <p className="mt-4 text-neutral-600">Available for freelance and research collaborations.</p>
        <div className="flex flex-col gap-3 mt-6">
          <a href="mailto:szilvia.barat@gmail.com" className="pb-2 font-bold border-b hover:text-pink-600 border-neutral-200">send me an email</a>
          <button onClick={onClose} className="self-end px-4 py-2 mt-4 text-xs tracking-widest uppercase border border-neutral-300 hover:bg-neutral-100">Close</button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="flex items-center justify-center w-full h-full px-6 bg-white border-l border-neutral-200">
      <div className="text-center">
        <h3 className="text-lg font-black tracking-widest uppercase">Let's create something together!</h3>
        <div className="flex justify-center gap-6 mt-6">
          <a href="https://github.com/szilvia-barath" className="text-xs tracking-widest uppercase hover:text-pink-600">GitHub</a>
          <a href="https://www.instagram.com/serena.serotonina" className="text-xs tracking-widest uppercase hover:text-pink-600">Instagram</a>
          <a href="https://www.linkedin.com/in/szilvia-bar%C3%A1th/" className="text-xs tracking-widest uppercase hover:text-pink-600">LinkedIn</a>
        </div>
        <p className="mt-8 text-[10px] text-neutral-400 uppercase tracking-[0.2em]">© {new Date().getFullYear()} Portfolio</p>
      </div>
    </div>
  );
}
