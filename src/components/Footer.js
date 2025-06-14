import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import { SiTiktok } from "react-icons/si";
import logoRivaltWhite from '../img/logoRivaltN.png';
import './estilos/Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer professional-footer">
      <div className="footer-top-section">
        <div className="footer-brand-column">
          <Link to="/" className="footer-brand-link">
            <img src={logoRivaltWhite} alt="Rivalt Logo" className="footer-logo" />
            <span className="footer-brand-name">Rivalt</span>
          </Link>
        </div>
        <div className="footer-links-container">
          <div className="footer-column">
            <h4>Nosotros</h4>
            <ul>
              <li><Link to="/Terminos">Términos y condiciones</Link></li>
              <li><Link to="/Privacidad">Política de privacidad</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Información</h4>
            <ul>
              <li><Link to="/guia">Guía</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Ayuda</h4>
            <ul>
              <li>
                <a href="mailto:rivalt.contacto@gmail.com" target="_blank" rel="noopener noreferrer">
                  Contacto
                </a>
              </li>
              <li><Link to="/Preguntas">Preguntas frecuentes</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Rivalt. Todos los derechos reservados.</p>
        <div className="social-media-icons footer-bottom-socials">
          <a href="https://www.instagram.com/rivalt_torneos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.tiktok.com/@rivalt_torneos" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <SiTiktok />
          </a>
          <a href="https://x.com/rivalt_torneos" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;