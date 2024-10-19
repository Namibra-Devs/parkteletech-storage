// import { BrowserRouter as Router } from "react-router-dom";
// import AppRouter from "./routes";
// import { ApiProvider } from "./hooks/context/GlobalContext";
// import { SidebarProvider } from "./hooks/use-sidebar";

// function App() {
//   return (
//     <ApiProvider>
//       <SidebarProvider>
//         <Router>
//           <AppRouter />
//         </Router>
//       </SidebarProvider>
//     </ApiProvider>
//   );
// }

// export default App;

import AppRouter from "./routes";
import AppProvider from "./providers";
import { ApiProvider } from "./hooks/context/GlobalContext";

function App() {
  return (
    <AppProvider>
      <ApiProvider>
        <AppRouter />
      </ApiProvider>
    </AppProvider>
  );
}

export default App;
