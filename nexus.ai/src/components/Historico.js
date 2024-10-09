import React from "react";
import Materia from "./Materia";

const Historico = () => {
    return(
        <div className="historico">
            <div>
                <h1 id="historico-h1">Histórico:</h1>
            </div>
            <Materia />
            <Materia />
            <Materia />
            <Materia />
            <Materia />
        </div>
    )
}

export default Historico;