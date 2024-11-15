import React from "react";

const Sidebar = () => {
  return (
    <div
      className=""
      id="sidebar"
    >
      <a
        href="/"
        className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom"
      >
        <span className="fs-5 fw-semibold">Conversas</span>
      </a>
      <div
        className="list-group list-group-flush border-bottom scrollarea"
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        <a
          href="#"
          className="list-group-item list-group-item-action py-3 lh-tight active"
          aria-current="true"
        >
          <div className="d-flex w-100 align-items-center justify-content-between">
            <strong className="mb-1">Conversa com João</strong>
            <small>Hoje</small>
          </div>
          <div className="col-10 mb-1 small">
            Mensagem curta do que foi discutido...
          </div>
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action py-3 lh-tight"
        >
          <div className="d-flex w-100 align-items-center justify-content-between">
            <strong className="mb-1">Conversa com Maria</strong>
            <small className="text-muted">Ontem</small>
          </div>
          <div className="col-10 mb-1 small">
            Outra mensagem curta de resumo...
          </div>
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action py-3 lh-tight"
        >
          <div className="d-flex w-100 align-items-center justify-content-between">
            <strong className="mb-1">Conversa com Pedro</strong>
            <small className="text-muted">Segunda-feira</small>
          </div>
          <div className="col-10 mb-1 small">
            Resumo da conversa de segunda...
          </div>
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action py-3 lh-tight"
        >
          <div className="d-flex w-100 align-items-center justify-content-between">
            <strong className="mb-1">Conversa com Ana</strong>
            <small className="text-muted">Semana passada</small>
          </div>
          <div className="col-10 mb-1 small">Mensagem sobre o projeto...</div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
