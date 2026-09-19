import { profile } from '../data/cv.js';
import Reveal from './Reveal.jsx';

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal className="contact__card">
          <p className="eyebrow eyebrow--light">Contact</p>
          <h2>Let’s talk BIM, information management and automation.</h2>
          <ul className="contact__list">
            <li>
              <span>Email</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <span>LinkedIn</span>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                {profile.linkedinLabel}
              </a>
            </li>
            <li>
              <span>Location</span>
              <span>{profile.location}</span>
            </li>
          </ul>
          <a className="btn btn--accent" href={profile.cvFile} download>
            Download CV (PDF)
          </a>
        </Reveal>
        <p className="footer">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </section>
  );
}
