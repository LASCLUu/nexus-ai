import "./main.css";
import Historico from "../../components/Historico";
import NovaConsulta from "../../components/NovaConsulta";
import Sugestoes from "../../components/Sugestoes";
import logo from "../../assets/logo-nexus.png";

const Main = () => {
  return (
    <>
      <header id="header">
        <img src={logo} alt="Logo" id="logo" />
        <h1 id="titulo">Seu assistente acadêmico inteligente!</h1>
      </header>
      <div className="App">
        <Historico />
        <NovaConsulta />
        <Sugestoes />
      </div>
      <footer id="footer">
        <p id="nexus">
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
        <p id="parceria">
          Parceria: Universidade São <br />
          Judas Tadeu(USJT)
        </p>
        <p id="trabalho">
          Trabalho semestral (A3) UC: <br /> Sd. Mobile - Professor Bossini
        </p>
      </footer>
    </>
  );
};

export default Main;
