import './main.css';
import Historico from '../../components/Historico';
import NovaConsulta from '../../components/NovaConsulta';
import Sugestoes from '../../components/Sugestoes'

const Main =() => {
    return (

        
      <div className="App">
        <Historico />
        <NovaConsulta />
        <Sugestoes />
      </div>
  
    );
  }
  
  export default Main;