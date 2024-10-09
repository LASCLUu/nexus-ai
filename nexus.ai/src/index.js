import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import logo from './logo-nexus.png';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <header id='header'>
      <img src={logo} alt="Logo" id='logo'/>
      <h1 id='titulo'>Seu assistente acadêmico inteligente!</h1>
    </header>
      <App />
    <footer id='footer'>
      <p id='nexus'>Neuxus <br /> Powered by OpenAI©</p>
      <p id='parceria'>Parceria: Universidade São <br />Judas Tadeu(USJT)</p>
      <p id='trabalho'>Trabalho semestral (A3) UC: <br /> Sd. Mobile - Professor Bossini</p>
    </footer>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
