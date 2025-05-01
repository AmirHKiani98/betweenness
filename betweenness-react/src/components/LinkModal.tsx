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
  setOpenLinkModal,
  updateLinkRow,
  addLinkRow,
  removeLinkRow,
  setLinkRows,
} from "../store/linkSlice"; // you need to define this
import { RootState } from "../store/store";
import { useEffect } from "react";

export function LinkModal() {
  const dispatch = useDispatch();
  const openModal = useSelector((state: RootState) => state.links.openModal);
  const linkRows = useSelector((state: RootState) => state.links.rows);
  const allLinks = useSelector((state: RootState) => state.graph.allLinks);

  useEffect(() => {
    if (openModal && allLinks.length > 0) {
      const synced = allLinks.map((l) => {
        const existing = linkRows.find((r) => r.id === l.id);
        return existing ?? {
          id: l.id,
          type: "ctm",
          source: l.from,
          dest: l.to,
          length: 0.25,
          ffspd: 60,
          capacity: 2600,
          num_lanes: 2,
        };
      });
      dispatch(setLinkRows(synced));
    }
  }, [openModal, allLinks, dispatch]);

  return (
    <Modal show={openModal} onClose={() => dispatch(setOpenLinkModal(false))}>
      <ModalHeader>Edit Links</ModalHeader>
      <ModalBody>
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">Type</th>
              <th className="px-2 py-1">Source</th>
              <th className="px-2 py-1">Dest</th>
              <th className="px-2 py-1">Length (mi)</th>
              <th className="px-2 py-1">FFSpd (mph)</th>
              <th className="px-2 py-1">Capacity</th>
              <th className="px-2 py-1">Lanes</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {linkRows.map((row, i) => (
              <tr key={i}>
                {(["id", "type", "source", "dest", "length", "ffspd", "capacity", "num_lanes"] as const).map((key) => (
                  <td key={key} className="px-2 py-1">
                    <input
                      type={typeof row[key] === "number" ? "number" : "text"}
                      className="w-full border px-2 py-1 rounded"
                      value={row[key]}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const parsed = ["length", "ffspd", "capacity", "num_lanes"].includes(key)
                          ? Number(raw)
                          : raw;
                        dispatch(updateLinkRow({ index: i, key, value: parsed }));
                      }}
                    />
                  </td>
                ))}
                <td className="px-2 py-1">
                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => dispatch(removeLinkRow(i))}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3">
          <Button size="sm" onClick={() => dispatch(addLinkRow())}>
            Add Row
          </Button>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => dispatch(setOpenLinkModal(false))}>Save</Button>
        <Button color="gray" onClick={() => dispatch(setOpenLinkModal(false))}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
