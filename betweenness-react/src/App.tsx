import { GraphCanvas } from "./components/GraphCanvas";
import { Sidebar } from "./components/Sidebar";
import { NodeRateModal } from './components/DemandModal';
import { LinkModal } from "./components/LinkModal";
import { NodeMetaModal } from "./components/NodeMetaModal";

import "./App.css";
function App() {
    return (
        <div className="flex w-full h-full">
            <Sidebar />
            <GraphCanvas />
            <NodeRateModal/>
            <LinkModal />
            <NodeMetaModal />
        </div>
    );
}

export default App;