import ReactDOM from "react-dom/client";
import App from "./App";
import Store from "./store/store";
import StoreState from "./interfaces/StoreState";
import { createContext } from "react";

const store = new Store();

export const Context = createContext<StoreState>({ store });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Context.Provider value={{ store }}>
        <App />
    </Context.Provider>
);
