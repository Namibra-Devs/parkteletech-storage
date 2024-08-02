import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routes";
import { ApiProvider } from "./hooks/context/GlobalContext";

function App() {
  return (
    <ApiProvider>
      <Router>
        <AppRouter />
      </Router>
    </ApiProvider>
  );
}

export default App;
