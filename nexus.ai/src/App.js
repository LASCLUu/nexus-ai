import './App.css';
import Historico from './components/Historico';
import NovaConsulta from './components/NovaConsulta';
import Sugestoes from './components/Sugestoes'

function App() {
  return (
    <div className="App">
      <Historico />
      <NovaConsulta />
      <Sugestoes />
    </div>
  );
}

export default App;
