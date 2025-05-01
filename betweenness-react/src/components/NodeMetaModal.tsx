import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
  } from "flowbite-react";
  import { useDispatch, useSelector } from "react-redux";
  import {
    setOpenNodeMetaModal,
    updateNodeMetaRow,
    addNodeMetaRow,
    removeNodeMetaRow,
    setNodeMetaRows,
  } from "../store/nodeMetaSlice";
  import { RootState } from "../store/store";
  import { useEffect } from "react";
  import { convertToCSV, downloadCSV } from "../services/utilities";

  export function NodeMetaModal() {
    const dispatch = useDispatch();
    const openModal = useSelector((state: RootState) => state.nodeMeta.openModal);
    const rows = useSelector((state: RootState) => state.nodeMeta.rows);
    const allPoints = useSelector((state: RootState) => state.graph.allPoints);
    const handleDownload = () => {
        const csv = convertToCSV(rows);
        downloadCSV(csv, "nodes.txt");
      };
    // Prepopulate if needed
    useEffect(() => {
        if (openModal && allPoints.length > 0) {
          const synced = allPoints.map((p) => {
            const existing = rows.find((r) => r.id === p.id);
            return existing ?? {
              id: p.id,
              type: "series", // default type if not previously set
              longitude: p.x,
              latitude: p.y,
              elevation: 0,
            };
          });
          dispatch(setNodeMetaRows(synced));
        }
      }, [openModal, allPoints, dispatch]);
  
    return (
      <Modal show={openModal} onClose={() => dispatch(setOpenNodeMetaModal(false))} size="7xl">
        <ModalBody>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                {["ID", "Type", "Longitude", "Latitude", "Elevation", "Actions"].map((label) => (
                  <th key={label} className="px-2 py-1">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {(["id", "type", "longitude", "latitude", "elevation"] as const).map((key) => (
                    <td key={key} className="px-2 py-1">
                      <input
                        type={typeof row[key] === "number" ? "number" : "text"}
                        className="w-full border px-2 py-1 rounded"
                        value={row[key]}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parsed = ["longitude", "latitude", "elevation"].includes(key)
                            ? Number(raw)
                            : raw;
                          dispatch(updateNodeMetaRow({ index: i, key, value: parsed }));
                        }}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <Button size="xs" color="failure" onClick={() => dispatch(removeNodeMetaRow(i))}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <Button size="sm" onClick={() => dispatch(addNodeMetaRow())}>
              Add Row
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => {
            dispatch(setOpenNodeMetaModal(false))
            handleDownload();
            }}>Download</Button>
          <Button color="gray" onClick={() => dispatch(setOpenNodeMetaModal(false))}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  