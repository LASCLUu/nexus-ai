const Footer = () => {
  return (
    <footer className="container py-5">
      <div className="row">
        <div className="col-12 col-md">
          <p>
            Nexus <br />
            Powered by{" "}
            <a
              href="https://openai.com/"
              target="_blank"
              id="open-ai-link"
              rel="noreferrer"
            >
              OpenAI©
            </a>
          </p>
        </div>
        <div className="col-12 col-md">
          <p>
            Parceria: Universidade São <br />
            Judas Tadeu(USJT)
          </p>
        </div>
        <div className="col-12 col-md">
          <p>
            Trabalho semestral (A3) UC: <br /> Sd. Mobile - Professor Bossini
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
