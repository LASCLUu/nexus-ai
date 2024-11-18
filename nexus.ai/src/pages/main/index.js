import { useState } from "react";
// import "./main.css";
import Historico from "../../components/otherComponents/Historico";
import NovaConsulta from "../../components/otherComponents/NovaConsulta";
import Sugestoes from "../../components/otherComponents/Sugestoes";
import logo from "../../assets/logo-nexus.png";
import Chat from "../../components/otherComponents/Chat";
import { messageGemini } from "../../services/api";
import dotenv from "dotenv";

dotenv.config();

const Main = () => {
  const [conteudo, setConteudo] = useState("current");

  const renderComponent = () => {
    if (conteudo === true) {
      return <Chat />;
    } else {
      return (
        <>
          <Historico />
          <NovaConsulta messageGemini={messageGemini} />
          <Sugestoes />
        </>
      );
    }
  };

  return (
    <>
      <header id="header">
        <img
          src={logo}
          alt="Logo"
          id="logo"
          onClick={() => setConteudo((c) => !c)}
        />
        <h1 id="titulo">Seu assistente acadêmico inteligente!</h1>
      </header>
      <div className="App">{renderComponent()}</div>
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
          </a>
        </p>
        <p id="parceria">
          Parceria: Universidade São Judas Tadeu(USJT)&copy;
        </p>
        <p id="trabalho">
          Trabalho semestral (A3) UC: Sd. Mobile - Professor Bossini
        </p>
      </footer>
    </>
  );
};

export default Main;
