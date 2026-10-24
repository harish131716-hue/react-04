
import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from 'react-router-dom';
import './App.css';

const internships = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechNova Solutions',
    location: 'Coimbatore / Remote',
    duration: '3 Months',
    type: 'Paid Internship',
    description:
      'Build responsive web pages using HTML, CSS, JavaScript and React.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React']
  },
  {
    id: '2',
    title: 'Backend Developer Intern',
    company: 'CloudBridge Technologies',
    location: 'Chennai / Remote',
    duration: '4 Months',
    type: 'Paid Internship',
    description:
      'Develop REST APIs and work with Node.js, Express and MongoDB.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API']
  },
  {
    id: '3',
    title: 'Data Analyst Intern',
    company: 'Insight Analytics',
    location: 'Bengaluru',
    duration: '3 Months',
    type: 'Internship',
    description:
      'Analyze datasets, create reports and communicate useful insights.',
    skills: ['Python', 'SQL', 'Excel', 'Data Analysis']
  },
  {
    id: '4',
    title: 'UI/UX Design Intern',
    company: 'Creative Pixel Studio',
    location: 'Remote',
    duration: '2 Months',
    type: 'Internship',
    description:
      'Design user-friendly interfaces and create prototypes for web apps.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'UI/UX']
  }
];

function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        InternConnect
      </Link>
      <nav>
        <Link to="/">Internships</Link>
        <a href="#about">About</a>
      </nav>
    </header>
  );
}

function Home() {
  const [search, setSearch] = useState('');

  const filtered = internships.filter((internship) =>
    `${internship.title} ${internship.company} ${internship.skills.join(' ')}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <span className="eyebrow">YOUR CAREER STARTS HERE</span>
        <h1>Find an internship.<br />Build your future.</h1>
        <p>
          Discover opportunities, develop your skills and take
          the first step towards your career.
        </p>
        <a href="#internships" className="primary-button">
          Explore Internships
        </a>
      </section>

      <main className="container" id="internships">
        <div className="section-heading">
          <div>
            <span className="eyebrow">OPPORTUNITIES</span>
            <h2>Available Internships</h2>
          </div>
          <span className="count">{filtered.length} opportunities</span>
        </div>

        <input
          className="search"
          type="search"
          placeholder="Search by role, company or skill..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search internships"
        />

        <div className="internship-grid">
          {filtered.map((internship) => (
            <article className="internship-card" key={internship.id}>
              <div className="card-top">
                <span className="company-icon">
                  {internship.company.charAt(0)}
                </span>
                <span className="tag">{internship.type}</span>
              </div>

              <h3>{internship.title}</h3>
              <p className="company-name">{internship.company}</p>
              <p className="description">{internship.description}</p>

              <div className="meta">
                <span>📍 {internship.location}</span>
                <span>◷ {internship.duration}</span>
              </div>

              <div className="skills">
                {internship.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <Link
                to={`/internship/${internship.id}`}
                className="details-button"
              >
                View Details →
              </Link>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="empty">No internships match your search.</p>
        )}
      </main>

      <footer id="about">
        <strong>InternConnect</strong>
        <p>Connecting students with career opportunities.</p>
      </footer>
    </>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const internship = internships.find((item) => item.id === id);

  if (!internship) {
    return (
      <main className="container page">
        <h2>Internship not found</h2>
        <Link to="/">Return to internships</Link>
      </main>
    );
  }

  return (
    <main className="container page">
      <Link to="/" className="back-link">← All internships</Link>
      <article className="detail-card">
        <span className="tag">{internship.type}</span>
        <h1>{internship.title}</h1>
        <h3 className="company-name">{internship.company}</h3>
        <div className="meta">
          <span>📍 {internship.location}</span>
          <span>◷ {internship.duration}</span>
        </div>

        <h2>About this internship</h2>
        <p>{internship.description}</p>

        <h2>Required skills</h2>
        <div className="skills">
          {internship.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        <Link
          to={`/apply/${internship.id}`}
          className="primary-button"
        >
          Apply Now
        </Link>
      </article>
    </main>
  );
}

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const internship = internships.find((item) => item.id === id);

  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNumber: ''
  });
  const [status, setStatus] = useState({
    type: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  if (!internship) {
    return (
      <main className="container page">
        <h2>Internship not found</h2>
        <Link to="/">Return to internships</Link>
      </main>
    );
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    const name = form.name.trim();
    const email = form.email.trim();
    const rollNumber = form.rollNumber.trim();

    if (name.length < 2) {
      setStatus({
        type: 'error',
        message: 'Name must contain at least 2 characters.'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    if (!rollNumber) {
      setStatus({
        type: 'error',
        message: 'Please enter your roll number.'
      });
      return;
    }

    setLoading(true);

    try {
      const apiUrl = (
        import.meta.env.VITE_API_URL || '/api'
      ).replace(/\/$/, '');

      const response = await fetch(`${apiUrl}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          rollNumber,
          internshipId: internship.id,
          internshipTitle: internship.title,
          company: internship.company
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Application failed.');
      }

      setStatus({
        type: 'success',
        message: data.message || 'Application submitted successfully!'
      });

      setForm({
        name: '',
        email: '',
        rollNumber: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message ||
          'Unable to submit your application. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container page">
      <Link to={`/internship/${internship.id}`} className="back-link">
        ← Back to internship
      </Link>

      <section className="form-card">
        <span className="eyebrow">APPLICATION FORM</span>
        <h1>Apply for an internship</h1>
        <p className="description">
          Applying for <strong>{internship.title}</strong> at{' '}
          <strong>{internship.company}</strong>
        </p>

        {status.message && (
          <div
            className={`notice ${status.type}`}
            role="status"
            aria-live="polite"
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Student Name</label>
          <input
            id="name"
            name="name"
            type="text"
            minLength="2"
            maxLength="100"
            autoComplete="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="student@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="rollNumber">Roll Number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            maxLength="30"
            placeholder="Enter your roll number"
            value={form.rollNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="internship">Selected Internship</label>
          <input
            id="internship"
            value={`${internship.title} — ${internship.company}`}
            readOnly
          />

          <button
            type="submit"
            className="primary-button submit-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        {status.type === 'success' && (
          <button
            className="secondary-button"
            onClick={() => navigate('/')}
          >
            Browse More Internships
          </button>
        )}
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <main className="container page">
      <h1>Page not found</h1>
      <Link to="/">Go to home page</Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/internship/:id"
          element={<InternshipDetails />}
        />
        <Route path="/apply/:id" element={<ApplicationForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
