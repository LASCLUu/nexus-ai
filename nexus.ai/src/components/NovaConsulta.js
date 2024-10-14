import React from "react";

const NovaConsulta = () => {
    return(
        <div className="novaConsulta">
            <div className="interfaceNovaConsulta">
                <h1 id="nova-con-h1">Fazer nova consulta:</h1>
                <label for="materiaNova" id="label-materia-nova">Matéria:</label>
                <select name="materiaNova" id="inputMateriaNova">
                    <option value="Selecione">-- Selecione --</option>
                    <option value="Matemática">Matemática</option>
                    <option value="Física">Física</option>
                    <option value="Português">Português</option>
                    <option value="Química">Química</option>
                    <option value="Outro">Outro</option>
                </select>
                <textarea name="novaConsultaText" placeholder="Digite sua dúvida aqui!" id="novaConsultaText"></textarea>
            </div>
            <div className="botaoEnviarNovaConsulta" id="btn-div">
                <button id="botao-consultar">
                    Consultar
                </button>
            </div>
        </div>
    )
}

export default NovaConsulta