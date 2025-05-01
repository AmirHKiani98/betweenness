import { GraphCanvas } from "./components/GraphCanvas";
import { Sidebar } from "./components/Sidebar";
import { NodeRateModal } from './components/DemandModal';
import {useSelector } from "react-redux";
import { RootState } from "./store/store";

import "./App.css";
function App() {
    const allPoints = useSelector((state: RootState) => state.graph.allPoints);
    return (
        <div className="flex w-full h-full">
            <Sidebar />
            <GraphCanvas />
            <NodeRateModal  points={allPoints}/>
        </div>
    );
}

export default App;