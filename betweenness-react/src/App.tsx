import { GraphCanvas } from "./components/GraphCanvas";
import { Sidebar } from "./components/Sidebar";
import { NodeRateModal } from './components/DemandModal';
import "./App.css";
function App() {
    return (
        <div className="flex w-full h-full">
            <Sidebar />
            <GraphCanvas />
            <NodeRateModal />
        </div>
    );
}

export default App;