import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./pages/main";
import logo from "./assets/logo-nexus.png";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <header id="header">
      <img src={logo} alt="Logo" id="logo" />
      <h1 id="titulo">Seu assistente acadêmico inteligente!</h1>
    </header>
    <Main />
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
  </React.StrictMode>
);