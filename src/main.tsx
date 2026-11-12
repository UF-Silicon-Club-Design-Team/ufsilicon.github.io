import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import OverprintSwarmTemplate from '@/components/ui/overprint-swarm-template'
import { Button } from '@/components/ui/button'
import './styles.css'

const projects = [
  { number: '01', motif: 'digital' },
  { number: '02', motif: 'analog' },
  { number: '03', motif: 'wafer' },
  { number: '04', motif: 'layers' },
] as const

type MotifKind = 'digital' | 'analog' | 'wafer' | 'layers'

function ScrollTop() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    window.scrollTo(0, 0)
    const section = pathname.split('/')[1]
    const title = section ? section[0].toUpperCase() + section.slice(1) : 'Student silicon design team'
    document.title = `${title === 'Contact' ? 'Contact us' : title} | UF Silicon`
  }, [pathname])
  return null
}

function Motif({ kind = 'digital' }: { kind?: MotifKind }) {
  return (
    <div className={`card-motif ${kind}-motif`} aria-hidden="true">
      {kind === 'analog' ? (
        <svg viewBox="0 0 300 100"><path d="M0 50H45C60 50 60 15 80 15S100 85 120 85S140 15 160 15S180 85 200 85S220 50 235 50H300" /></svg>
      ) : kind === 'wafer' ? (
        <svg viewBox="0 0 160 120">
          <defs><clipPath id="wafer-clip"><circle cx="80" cy="60" r="44" /></clipPath></defs>
          <circle cx="80" cy="60" r="44" />
          <g clipPath="url(#wafer-clip)">
            {[36, 52, 68, 84, 100, 116].map(n => <path key={n} d={`M${n} 10V110 M30 ${n - 20}H130`} />)}
          </g>
          <path className="motif-orange" d="M67 102H93" />
        </svg>
      ) : kind === 'layers' ? (
        <svg viewBox="0 0 160 120">
          <path d="M30 65L80 90L130 65 M30 80L80 105L130 80" />
          <path className="motif-orange" d="M30 50L80 25L130 50L80 75Z" />
          <path d="M80 25V10 M30 50H10 M130 50H150" />
        </svg>
      ) : <><i /><i /><i /><i /><i /><i /><i /><i /><i /></>}
    </div>
  )
}

function CircuitAccent() {
  return <svg className="circuit-accent" viewBox="0 0 200 160" aria-hidden="true"><path d="M200 20H140L100 60V105L75 130" /><path d="M200 45H155L130 70V140" /><circle cx="75" cy="130" r="4" /><circle cx="130" cy="140" r="4" /></svg>
}

function Page({ kind }: { kind: 'digital' | 'analog' | 'fabrication' | 'projects' }) {
  const digital = kind === 'digital'
  const analog = kind === 'analog'
  const fabrication = kind === 'fabrication'
  const heading = kind[0].toUpperCase() + kind.slice(1)
  return (
    <main className="interior">
      <CircuitAccent />
      <p className="eyebrow">UF Silicon / {kind}</p>
      <h1>{heading}<span className="title-dot">.</span></h1>
      <div className="page-rule" />
      <p className="page-intro">{digital ? 'From architecture to implementation.' : analog ? 'Exploring the continuous side of silicon.' : fabrication ? 'Exploring how designs become silicon.' : 'Our next designs are taking shape.'}</p>
      <div className="card-grid">
        {kind === 'projects' ? projects.map(project => (
          <Link key={project.number} className="team-card project-card" to={`/projects/${project.number}`} aria-label={`Coming soon — project ${project.number}`}>
            <div className="card-top"><span>PROJECT / {project.number}</span><ArrowUpRight size={22} /></div>
            <Motif kind={project.motif} />
            <h2>Coming soon</h2>
            <span className="card-link">View project <ArrowUpRight size={16} /></span>
          </Link>
        )) : fabrication ? (
          <article className="team-card">
            <div className="card-top"><span>TEAM / 01</span><span className="status-dot" /></div>
            <Motif kind="wafer" />
            <h2>Fabrication Team</h2>
            <p className="card-description">Team details coming soon.</p>
          </article>
        ) : ['Advanced', 'NRF'].map((name, i) => (
          <article className="team-card" key={name}>
            <div className="card-top"><span>TEAM / 0{i + 1}</span><span className="status-dot" /></div>
            <Motif kind={analog ? 'analog' : 'digital'} />
            <h2>{name} {digital ? 'Digital' : 'Analog'} Team</h2>
            {digital && <ul className="specialties">{(i === 0 ? ['Digital Design', 'Verification and DFT', 'Physical Design', 'Architecture/PPA'] : ['Digital Design', 'Verification']).map((s, j) => <li key={s}><span>0{j + 1}</span>{s}</li>)}</ul>}
          </article>
        ))}
      </div>
    </main>
  )
}

function Contact() {
  return (
    <main className="interior">
      <CircuitAccent />
      <p className="eyebrow">UF Silicon / Contact</p>
      <h1>Contact us<span className="title-dot">.</span></h1>
      <div className="page-rule" />
      <p className="page-intro">Interested in building with us or supporting the team?</p>
      <div className="card-grid">
        <article className="team-card contact-card">
          <div className="card-top"><span>FOR STUDENTS</span><span className="status-dot" /></div>
          <Motif kind="digital" />
          <h2>Join the team</h2>
          <p className="card-description">Interested in Digital, Analog, or Fabrication? Connect with UF Silicon to learn about joining our student silicon design team.</p>
          <Button type="button" aria-describedby="join-note">Join the team <ArrowUpRight size={16} /></Button>
          <p className="contact-note" id="join-note">Contact details coming soon.</p>
        </article>
        <article className="team-card contact-card">
          <div className="card-top"><span>FOR SPONSORS</span><span className="status-dot" /></div>
          <Motif kind="layers" />
          <h2>Support student silicon</h2>
          <p className="card-description">Help students bring silicon designs to life. Get in touch to explore sponsorship, mentorship, and ways to support our teams.</p>
          <Button type="button" aria-describedby="sponsor-note">Become a sponsor <ArrowUpRight size={16} /></Button>
          <p className="contact-note" id="sponsor-note">Contact details coming soon.</p>
        </article>
      </div>
    </main>
  )
}

function Placeholder({ number, motif }: { number: string; motif: MotifKind }) {
  return <main className="interior placeholder"><Link className="back-link" to="/projects"><ArrowLeft size={16} /> Back to Projects</Link><p className="eyebrow">UF Silicon / Project {number}</p><h1>Coming soon<span className="title-dot">.</span></h1><div className="page-rule" /><Motif kind={motif} /></main>
}

function App() {
  return (
    <HashRouter>
      <ScrollTop />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="UF Silicon home"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="" /><span>UF Silicon</span></Link>
        <nav aria-label="Main navigation">{['Digital', 'Analog', 'Fabrication', 'Projects', 'Contact'].map(n => <NavLink key={n} to={`/${n.toLowerCase()}`}>{n}</NavLink>)}</nav>
      </header>
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<OverprintSwarmTemplate />} />
          <Route path="/digital" element={<Page kind="digital" />} />
          <Route path="/analog" element={<Page kind="analog" />} />
          <Route path="/fabrication" element={<Page kind="fabrication" />} />
          <Route path="/projects" element={<Page kind="projects" />} />
          <Route path="/contact" element={<Contact />} />
          {projects.map(project => <Route key={project.number} path={`/projects/${project.number}`} element={<Placeholder number={project.number} motif={project.motif} />} />)}
          <Route path="*" element={<main className="interior"><h1>Page not found</h1><Link to="/">Return home</Link></main>} />
        </Routes>
      </div>
      <footer className="site-footer"><Link to="/">UF Silicon</Link><span>University of Florida <span className="footer-slash">/</span> Student silicon design team</span><Link to="/contact">Contact us</Link></footer>
    </HashRouter>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
