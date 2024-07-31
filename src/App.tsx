import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./hooks/context/AuthContext";
import AppRouter from "./routes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}

export default App;
