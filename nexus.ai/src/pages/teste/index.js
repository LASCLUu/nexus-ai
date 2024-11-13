import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat"; // Importando o Chat
import "./main.css";
import { useEffect, useState } from "react";

const Teste = () => {
  const [rows, setRows] = useState([]);

  return (
    <div className="page-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="chat-container">
          <Chat />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Teste;
