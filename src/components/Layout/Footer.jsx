import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa6'
import { siteInfo } from '../../data/content'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <img
              src="/vfu.png"
              alt={siteInfo.name}
              className="footer__logo-img"
            />
          </div>
          <p>{siteInfo.description}</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/statistics">Global Statistics</Link>
          <Link to="/why-therapy">Why Speech Therapy</Link>
          <Link to="/programs">All Programs</Link>
          <Link to="/methodology">Our Methodology</Link>
        </div>

        <div className="footer__col">
          <h4>Learn</h4>
          <Link to="/age-groups">Age Groups</Link>
          <Link to="/educator">Meet the Educator</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer__col">
          <h4>Connect</h4>
          <Link to="/contact">Contact Us</Link>
          <a href="https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss" target="_blank" rel="noopener noreferrer">
            WHO Hearing Loss Data
          </a>
          <a href="https://www.asha.org" target="_blank" rel="noopener noreferrer">
            ASHA Resources
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          © {year} {siteInfo.name}. Built with <FaHeart className="footer__heart" /> for hearing impaired learners worldwide.
        </p>
        <p className="footer__cite">
          Statistics sourced from WHO, Global Burden of Disease Study, and peer reviewed research.
        </p>
      </div>
    </footer>
  )
}
