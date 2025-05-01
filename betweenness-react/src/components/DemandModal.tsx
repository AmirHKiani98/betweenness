import "../App.css";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOpenModal,
  updateRow,
  addRow,
  removeRow,
  setRows,
} from "../store/flowSlice";
import { RootState } from "../store/store";
import { useEffect } from "react";

export function NodeRateModal() {
  const dispatch = useDispatch();
  const openModal = useSelector((state: RootState) => state.flow.openModal);
  const rows = useSelector((state: RootState) => state.flow.rows);
  const points = useSelector((state: RootState) => state.graph.allPoints); // <- get points from redux

  // Populate rows from points if opening modal and no rows exist
  useEffect(() => {
    if (openModal && points.length > 0) {
      const syncedRows = points.map((p) => {
        const existing = rows.find((r) => r.node === p.id.toString());
        return existing ?? {
          node: p.id,
          start: 0,
          end: 900,
          rate: 1000,
        };
      });
      dispatch(setRows(syncedRows));
    }
  }, [openModal, points, dispatch]);
  console.log("Rows in NodeRateModal:", rows);
  return (
    <>
      <Modal show={openModal} onClose={() => dispatch(setOpenModal(false))}>
        <ModalBody>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-2 py-1">Node</th>
                <th className="px-2 py-1">Start (s)</th>
                <th className="px-2 py-1">End (s)</th>
                <th className="px-2 py-1">Rate (vph)</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {(["node", "start", "end", "rate"] as const).map((key) => (
                    <td key={key} className="px-2 py-1">
                      <input
                        type="text"
                        className="w-full border px-2 py-1 rounded"
                        value={row[key]}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const parsedValue = ["start", "end", "rate"].includes(key)
                            ? Number(rawValue)
                            : rawValue;
                          dispatch(updateRow({ index: i, key, value: parsedValue }));
                        }}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => dispatch(removeRow(i))}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <Button size="sm" onClick={() => dispatch(addRow())}>
              Add Row
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => dispatch(setOpenModal(false))}>Save</Button>
          <Button color="gray" onClick={() => dispatch(setOpenModal(false))}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
