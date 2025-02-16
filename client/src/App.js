import Login from './Login';
import Dashboard from './Dashboard';
import './index.css';

const code = new URLSearchParams(window.location.search).get('code');

function App() {
  console.log("Authorization code in App.js:", code);
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App;
