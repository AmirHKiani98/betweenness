import { GraphCanvas } from "./components/GraphCanvas";
import { Sidebar } from "./components/Sidebar";
import "./App.css";
function App() {
    return (
        <div className="flex w-full h-full">
            <Sidebar />
            <GraphCanvas />
        </div>
    );
}

export default App;