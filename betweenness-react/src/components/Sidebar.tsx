export function Sidebar() {
    return (
        <div className="p-4 bg-gray-200 h-full w-80 overflow-y-auto absolute z-50">
            <h2 className="text-xl font-bold mb-4">Graph Controls</h2>

            <button className="btn btn-primary w-full mb-2">Find Best Betweenness</button>
            <button className="btn btn-primary w-full mb-2">Reset Graph</button>

            <div className="mt-4">
                <input type="text" placeholder="Node Name" className="input input-bordered w-full mb-2" />
                <button className="btn btn-success w-full mb-2">Add Node</button>
            </div>

            <div className="mt-4">
                <select defaultValue="" className="select select-bordered w-full mb-2">
                    <option value="" disabled>From</option>
                    <option value="node1">Node 1</option>
                    <option value="node2">Node 2</option>
                </select>
                <select defaultValue="" className="select select-bordered w-full mb-2">
                    <option value="" disabled>To</option>
                    <option value="node1">Node 1</option>
                    <option value="node2">Node 2</option>
                </select>
                <button className="btn btn-warning w-full mb-2">Add Link</button>
            </div>

            <div className="mt-4">
                <button className="btn btn-error w-full">Remove All Marks</button>
            </div>
        </div>
    );
}