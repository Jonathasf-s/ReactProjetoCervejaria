import React from 'react';
import './Footer.css';
import instaSvg from '/src/assets/icons/INSTA.svg';
import whatsappSvg from '/src/assets/icons/WHATSAPP.svg';
import logometadeSvg from '/src/assets/logos/metade.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Seção de Redes Sociais */}
        <div className="footer-section">
          <h3>🌐 Conecte-se Conosco</h3>
          <div className="social-links">
            <a 
              href="https://instagram.com/marscervejaria" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Instagram Mars Cervejaria"
            >
              <img src={instaSvg} alt="Instagram" className="social-icon" />
              <span>instagram.com/marscervejaria</span>
            </a>

            <a 
              href="https://wa.me/5561377472233" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link whatsapp"
              aria-label="WhatsApp Mars Cervejaria"
            >
              <img src={whatsappSvg} alt="WhatsApp" className="social-icon" />
              <span>(61) 3747-2233</span>
            </a>
          </div>
        </div>

        {/* Divisor */}
        <div className="footer-divider"></div>

        {/* Seção de Copyright */}
        <div className="footer-section">
          <p className="copyright">
            &copy; {currentYear} <strong>Mars Cervejaria</strong>
            <img src={logometadeSvg} alt="Mars Cervejaria Logo pela Metade" className="footer-logo" />
            . Todos os direitos reservados.
          </p>
          <p className="footer-subtitle">
            Sistema de Gerenciamento Administrativo v1.0
          </p>
        </div>
      </div>

      {/* Linha de rodapé */}
      <div className="footer-bottom">
        <p>Desenvolvido com ❤️ por Mars Cervejaria</p>
      </div>
    </footer>
  );
}
