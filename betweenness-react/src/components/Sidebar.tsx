import { motion } from "motion/react";
import "../App.css";
export function Sidebar() {
    return (
        <div className="p-4 bg-gray-200 h-full w-80 overflow-y-auto absolute right-0 z-50">
            <h2 className="text-xl font-bold mb-4">Graph Controls</h2>

            <button>Find Best Betweenness</button>
            <button >Reset Graph</button>

            <div className="mt-4">
            <input type="text" placeholder="Node Name" />
            <motion.input
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 1 }}
                type="text"
                placeholder="Motion working!"
                />
            </div>

            <div className="mt-4">
            <select defaultValue="" id="from-selection">
                <option value="" disabled>From</option>
                <option value="node1">Node 1</option>
                <option value="node2">Node 2</option>
            </select>
            <select defaultValue="" id="to-selection">
                <option value="" disabled>To</option>
                <option value="node1">Node 1</option>
                <option value="node2">Node 2</option>
            </select>
            <button className="bg-yellow-500 text-white py-2 px-4 rounded w-full mb-2 hover:bg-yellow-600">Add Link</button>
            </div>

            <div className="mt-4">
            <button className="bg-red-500 text-white py-2 px-4 rounded w-full hover:bg-red-600">Remove All Marks</button>
            </div>
        </div>
    );
}