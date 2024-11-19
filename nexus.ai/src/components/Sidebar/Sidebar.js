import React, { useEffect, useState } from "react";
import PlusIcon from "bootstrap-icons/icons/plus.svg";
import "./sidebar.css";
import { useContextSelector } from "use-context-selector";
import { AppContext, useAppContext } from "../../contexts/AppContext";

const Sidebar = ({
  handleCreateConversa,
  selectedConversa,
  selectedRow,
  deleteRow,
  showSidebar,
  setShowSidebar,
}) => {
  const listaConversas = useContextSelector(
    AppContext,
    (context) => context.conversas
  );

  return (
    <div
      id="sidebar"
      className={`sidebar ${showSidebar ? "d-block" : "d-none"}`}
    >
      <div className="menuSidebar d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
        <a
          href="/"
          className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom"
        >
          <span className="fs-5 fw-semibold">Conversas</span>
        </a>
        <button
          className="btn btn-outline-primary"
          onClick={handleCreateConversa}
        >
          <img src={PlusIcon} alt="Adicionar" />
        </button>
      </div>
      <div
        className="list-group list-group-flush border-bottom scrollarea"
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        {listaConversas && listaConversas.length > 0 ? (
          listaConversas.map((conversa, index) => (
            <a
              href="#"
              key={conversa.id}
              className={`list-group-item list-group-item-action py-3 lh-tight ${
                selectedConversa === conversa.id ? "active" : ""
              }`}
              aria-current={
                selectedConversa === conversa.id ? "true" : undefined
              }
              onClick={() => selectedRow(conversa)}
            >
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">{conversa.id}</strong>
                <small>
                  {new Date(conversa.data_log).toLocaleDateString("pt-BR")}
                </small>
                <button
                  className="btn btn-sm btn-danger ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRow(conversa.id);
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="col-10 mb-1 small">
                {conversa.mensagem_resumo}
              </div>
            </a>
          ))
        ) : (
          <div>Nenhuma conversa encontrada</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
