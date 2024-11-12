import React, { useState } from "react";

const NovaConsulta = ({ messageGemini }) => {
  // Estado para o valor do textarea
  const [consulta, setConsulta] = useState("");
  const [materia, setMateria] = useState("Selecione");

  // Função de envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifique se a consulta está vazia
    if (!consulta) {
      alert("Por favor, digite uma dúvida.");
      return;
    }
    try {
      const response = await messageGemini(consulta);
      alert(response.completion);
    } catch (error) {
      console.error("Erro ao enviar consulta:", error);
    }
  };

  return (
    <div className="novaConsulta">
      <div className="interfaceNovaConsulta">
        <h1 id="nova-con-h1">Fazer nova consulta:</h1>

        <label htmlFor="materiaNova" id="label-materia-nova">
          Matéria:
        </label>
        <select
          name="materiaNova"
          id="inputMateriaNova"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
        >
          <option value="Selecione">-- Selecione --</option>
          <option value="Matemática">Matemática</option>
          <option value="Física">Física</option>
          <option value="Português">Português</option>
          <option value="Química">Química</option>
          <option value="Outro">Outro</option>
        </select>

        <form onSubmit={handleSubmit}>
          <textarea
            name="novaConsultaText"
            placeholder="Digite sua dúvida aqui!"
            id="novaConsultaText"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
          />
          <div className="botaoEnviarNovaConsulta" id="btn-div">
            <button id="botao-consultar" type="submit">
              Consultar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaConsulta;
