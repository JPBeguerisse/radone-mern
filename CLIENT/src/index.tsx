import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// ✅ Création du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Réessaye 2 fois en cas d'erreur
      refetchOnWindowFocus: false, // Ne recharge pas automatiquement quand tu reviens sur l'onglet
    },
  },
});

// render the application
root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
