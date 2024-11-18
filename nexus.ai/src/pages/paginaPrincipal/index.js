import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";
import "./main.css";
import { useEffect, useState } from "react";
import {
  messageGemini,
  tituloGemini,
  atualizarConversa,
} from "../../services/api";

const PaginaPrincipal = () => {
  const [rows, setRows] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const mostraSideBar = () => {
    if (showSidebar) {
      return (
        <div className="main-content">
          <Sidebar />
          <div className="chat-container">
            <Chat
              messageGemini={(messageGemini, tituloGemini, atualizarConversa)}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-content">
          <div className="chat-container">
            <Chat
              messageGemini={(messageGemini, tituloGemini, atualizarConversa)}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="page-container">
      <Header
        toggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />
      {mostraSideBar()}
      <Footer />
    </div>
  );
};

export default PaginaPrincipal;
