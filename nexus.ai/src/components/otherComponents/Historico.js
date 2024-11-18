import React from "react";
import Materia from "./Materia";

const Historico = () => {
    return(
        <div className="historico">
            <div className="materias"> 
                    <h1 id="historico-h1">Histórico:</h1>
                    <Materia />
                    <Materia />
                    <Materia />
                    <Materia />
                    <Materia />
            </div>
        </div>
    )
}

export default Historico;