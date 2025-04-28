import { GraphCanvas } from "./components/GraphCanvas";
import { Sidebar } from "./components/Sidebar";

function App() {
    return (
        <div className="flex">
            <Sidebar />
            <GraphCanvas />
        </div>
    );
}

export default App;