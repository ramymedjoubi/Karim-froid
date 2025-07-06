// src/components/Footer.tsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 pt-4 pb-3">
      <div className="container">
        <div className="row">

          <div className="col-md-4 mb-3">
            <h5>À propos</h5>
            <p>
              Spécialistes en équipements de réfrigération, nous vous proposons 
              les meilleures solutions pour vos besoins professionnels.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt-fill"></i> Bordj Bou Arreridj, Algérie</li>
              <li><i className="bi bi-telephone-fill"></i> +213 562 61 90 39</li>
              <li><i className="bi bi-envelope-fill"></i> karimfroid@gmail.com</li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Suivez-nous</h5>
            <div>
              <a href="#" className="text-white me-3">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-x fs-4"></i>
              </a>
            </div>
          </div>

        </div>

        <hr className="bg-light" />
        <div className="text-center">
          &copy; {new Date().getFullYear()} Ramy Medjoubi. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
