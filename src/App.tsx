import AppRouter from "./routes";
import AppProvider from "./providers";
import { ApiProvider } from "./hooks/context/GlobalContext";
import { checkAndRemoveExpiredTokens } from "./lib/utils";

function App() {
  const isTokenExpired = checkAndRemoveExpiredTokens();
  if (isTokenExpired) {
    return null;
  }
  return (
    <AppProvider>
      <ApiProvider>
        <AppRouter />
      </ApiProvider>
    </AppProvider>
  );
}

export default App;
