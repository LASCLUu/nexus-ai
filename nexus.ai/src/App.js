import './App.css';
import Historico from './components/Historico';
import NovaConsulta from './components/NovaConsulta';
import Sugestoes from './components/Sugestoes'
// import TelaPesquisa from './components/TelaPesquisa'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Historico />
      <NovaConsulta />
      <Sugestoes />
    {/* <Router>
      <Routes>
        <Route path='/' element={<botao-consultar />} />
        <Route path='/resposta-gpt' element={<TelaPesquisa />} />
      </Routes>
    </Router> */}
    </div>

  );
}

export default App;
