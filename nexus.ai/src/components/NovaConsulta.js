import React from "react";

const NovaConsulta = () => {
    return(
        <div className="novaConsulta">
            <div className="interfaceNovaConsulta">
                <h1 id="nova-con-h1">Fazer nova consulta:</h1>
                <label for="materiaNova">Matéria:</label>
                <select name="materiaNova" id="inputMateriaNova">
                    <option value="Matemática">Matemática</option>
                    <option value="Física">Física</option>
                    <option value="Português">Português</option>
                    <option value="Química">Química</option>
                </select>
                <textarea name="novaConsultaText" id="novaConsultaText"></textarea>
            </div>
            <div className="botaoEnviarNovaConsulta" id="btn-div">
                <button id="botao-pesquisa">
                    Consultar
                </button>
            </div>
        </div>
    )
}

export default NovaConsulta