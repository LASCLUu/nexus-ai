const Footer = () => {
  return (
    <footer className="bg-light text-dark text-center py-3">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4">
            <p className="mb-1">
              Powered by{" "}
              <a
                href="https://openai.com/"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                OpenAI©
              </a>
            </p>
          </div>
          <div className="col-12 col-md-4">
            <p className="mb-1">Universidade São Judas Tadeu (USJT)</p>
          </div>
          <div className="col-12 col-md-4">
            <p className="mb-1">
              Trabalho semestral (A3) UC: Sd. Mobile - Professor Bossini
            </p>
          </div>
        </div>
      </div>
      <div className="text-center pt-2">
        <p className="mb-0">© 2024 Nexus. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
