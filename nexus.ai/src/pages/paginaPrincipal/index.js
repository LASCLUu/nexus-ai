import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat"; // Importando o Chat
import "./main.css";
import { useEffect, useState } from "react";
import { messageGemini, tituloGemini } from "../../services/api";

const PaginaPrincipal = () => {
  const [rows, setRows] = useState([]);

  return (
    <div className="page-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="chat-container">
          <Chat messageGemini={(messageGemini, tituloGemini)} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaginaPrincipal;
