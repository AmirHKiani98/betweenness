import "../App.css";
import { motion } from "motion/react";
import {TooltipWrapper} from "./TooltipWrapper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareNodes, faPencil, faCircleDot, faSquareXmark, faSquareShareNodes, faCloudDownload, faRefresh, faTruckField, faBezierCurve, faPlay} from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawingNode, toggleDrawingLine, toggleRemovingNode, toggleRemovingLine, setTimeInterval, setJamDensity, setDuration } from '../store/graphSlice';
import type { RootState } from '../store/store';
import { Button } from "flowbite-react";
import { NumberInput } from '../components/NumberInput.tsx';
import {NodeRateModal} from './DemandModal.tsx';
import { setOpenModal as setOpenFlowModal } from "../store/flowSlice";
import { setOpenLinkModal as setOpenLinkModal } from "../store/linkSlice";
import { setOpenNodeMetaModal as setOpenNodeMetaModal } from "../store/nodeMetaSlice";

import { convertToCSV, downloadCSV, sendFilesToBackend} from "../services/utilities";




export function Sidebar() {
    const dispatch = useDispatch();
    const isDrawingNode = useSelector((state: RootState) => state.graph.isDrawingNode);
    const isDrawingLine = useSelector((state: RootState) => state.graph.isDrawingLine);
    const isRemvoingNode = useSelector((state: RootState) => state.graph.isRemovingNode);
    const isRemovingLine = useSelector((state: RootState) => state.graph.isRemovingLine);
    const x = useSelector((state: RootState) => state.graph.x);
    const y = useSelector((state: RootState) => state.graph.y);
    const hoveredLineId = useSelector((state: RootState) => state.graph.hoveredLineId);
    const timeInterval = useSelector((state: RootState) => state.graph.timeInterval);
    const jamDensity = useSelector((state: RootState) => state.graph.jamDensity);
    const duration = useSelector((state: RootState) => state.graph.duration);
    const linkRows = useSelector((state: RootState) => state.links.rows);
    const nodeMetaRows = useSelector((state: RootState) => state.nodeMeta.rows);
    const demandRows = useSelector((state: RootState) => state.flow.rows);

    function runCode() {
        const nodeCSV = convertToCSV(nodeMetaRows);
        const linkCSV = convertToCSV(linkRows);
        const demandCSV = convertToCSV(demandRows);
      
        const paramsTXT = `dt ${timeInterval}\nduration ${duration}\njam_density ${jamDensity}`;
      
        const files = {
          "nodes": nodeCSV,
          "links": linkCSV,
          "demand": demandCSV,
          "params": paramsTXT
        };
      
        // Option 1: Download locally
        // Object.entries(files).forEach(([name, content]) => downloadCSV(name + ".txt", content));
      
        // Option 2: Send to backend and trigger run
        sendFilesToBackend(files).then(console.log).catch(console.error);
      }
    // console.log(isRemovingLine);
    return (
        <div className="p-4 bg-gray-200 h-full w-80 overflow-y-auto fixed right-0 top-0 z-50">
            <h2 className="text-xl font-bold mb-4">Graph Controls</h2>

            <TooltipWrapper tooltipText="Calculates betweenness score">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=""
                onClick={() => console.log("Find Betweenness")}
                >
                Find Betweenness
                </motion.button>
            </TooltipWrapper>

            <TooltipWrapper tooltipText="Calculates closeness score">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=""
                onClick={() => console.log("Find Closeness")}
                >
                Find Closeness
                </motion.button>
            </TooltipWrapper>
            <div className='flex items-center justify-between'>
                <TooltipWrapper tooltipText="Activate drawing node">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`!w-14 !flex gap-2 justify-center ${isDrawingNode ? "!bg-main-800 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => dispatch(toggleDrawingNode())}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                        <FontAwesomeIcon icon={faCircleDot} />

                    </motion.button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Activate removing node">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`!w-14 !flex gap-2 justify-center ${isRemvoingNode ? "!bg-main-800 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => dispatch(toggleRemovingNode())}
                    >
                        <FontAwesomeIcon icon={faSquareXmark} />
                        <FontAwesomeIcon icon={faCircleDot} />

                    </motion.button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Activate drawing lines" tooltipPosition={"bottom"}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`!w-14 !flex gap-2 justify-center ${isDrawingLine ? "!bg-main-800 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => dispatch(toggleDrawingLine())}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                        <FontAwesomeIcon icon={faShareNodes} />

                    </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tooltipText="Activate removing lines" tooltipPosition={"left"}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`!w-14 !flex gap-2 justify-center ${isRemovingLine ? "!bg-main-800 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => dispatch(toggleRemovingLine())}
                    >
                        <FontAwesomeIcon icon={faSquareXmark} />
                        <FontAwesomeIcon icon={faShareNodes} />

                    </motion.button>
                </TooltipWrapper>
            </div>
            <div className="flex items-center justify-between">
                <TooltipWrapper tooltipText="Download the graph" tooltipPosition={"top"}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`!w-14 !flex gap-2 justify-center`}
                            onClick={() => {}} // Download the graph.
                        >
                            <FontAwesomeIcon icon={faCloudDownload} />
                            <FontAwesomeIcon icon={faSquareShareNodes} />

                        </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tooltipText="Reset the graph" tooltipPosition={"left"}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`!w-14 !flex gap-2 justify-center`}
                            onClick={() => {}} // Reset the graph.
                        >
                            <FontAwesomeIcon icon={faRefresh} />
                            <FontAwesomeIcon icon={faSquareShareNodes} />

                        </motion.button>
                </TooltipWrapper>
            </div>
            <h2 className="text-xl font-bold mt-4 mb-4">Coordinates</h2>
            <div className="flex justify-between items-center gap-5 [&>div]:flex [&>div]:flex-row [&>div]:gap-2 [&>div]:items-center [&>div]:justify-between [&>div>*]:text-lg [&>div>span]:text-main-600 [&>div]:item-center">
                <div><p>x</p><span>{x ?? "----"}</span></div>
                <div><p>y</p><span>{y ?? "----"}</span></div>
                
            </div>
            <h2 className="text-xl font-bold mt-4 mb-4">Coordinates</h2>
            <div className="flex mt-4 justify-between items-center gap-5 [&>div]:flex [&>div]:flex-row [&>div]:gap-2 [&>div]:items-center [&>div]:justify-between [&>div>*]:text-lg [&>div>span]:text-main-600 [&>div]:item-center">
                <div className="flex flex-row justify-between items-center w-full">
                    <p>Mouse on line:</p><span>{hoveredLineId === "" ? "----" : hoveredLineId}</span>
                </div>
            </div>
            <div className="flex mt-4 justify-between items-center">
                <TooltipWrapper tooltipText="Demand modal" tooltipPosition={"left"}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`!w-14 !flex gap-2 justify-center`}
                                onClick={() => dispatch(setOpenFlowModal(true))} // Reset the graph.
                            >
                                <FontAwesomeIcon icon={faTruckField} />

                            </motion.button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Link modal" tooltipPosition={"bottom"}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`!w-14 !flex gap-2 justify-center`}
                                onClick={() => dispatch(setOpenLinkModal(true))} // Reset the graph.
                            >
                                <FontAwesomeIcon icon={faBezierCurve} />

                            </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tooltipText="Node modal" tooltipPosition={"left"}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`!w-14 !flex gap-2 justify-center`}
                                onClick={() => dispatch(setOpenNodeMetaModal(true))} // Reset the graph.
                            >
                                <FontAwesomeIcon icon={faShareNodes} />

                            </motion.button>
                </TooltipWrapper>
            </div>
            <div className="flex mt-4 justify-between items-center gap-5 [&>div]:flex [&>div]:flex-row [&>div]:gap-2 [&>div]:items-center [&>div]:justify-between [&>div>*]:text-lg [&>div>span]:text-main-600 [&>div]:item-center">
                <div className="flex flex-row justify-between items-center w-full">
                    <p>Time interval</p>
                    <NumberInput
                        value={timeInterval}
                        onChange={(e) => {
                            dispatch(setTimeInterval(Number(e.target.value)));
                          }}
                    
                        min={1}
                        max={1000}
                        step={1}
                        className="!w-24"
                    />
                </div>
            </div>

            <div className="flex mt-4 justify-between items-center gap-5 [&>div]:flex [&>div]:flex-row [&>div]:gap-2 [&>div]:items-center [&>div]:justify-between [&>div>*]:text-lg [&>div>span]:text-main-600 [&>div]:item-center">
                <div className="flex flex-row justify-between items-center w-full">
                    <p>Jam Density</p>
                    <NumberInput
                        value={jamDensity}
                        onChange={(e) => {
                            dispatch(setJamDensity(Number(e.target.value)));
                          }}
                        
                        min={1}
                        max={1000}
                        step={1}
                        className="!w-24"
                    />
                </div>
            </div>
            <div className="flex mt-4 justify-between items-center gap-5 [&>div]:flex [&>div]:flex-row [&>div]:gap-2 [&>div]:items-center [&>div]:justify-between [&>div>*]:text-lg [&>div>span]:text-main-600 [&>div]:item-center">
                <div className="flex flex-row justify-between items-center w-full">
                    <p>Jam Density</p>
                    <NumberInput
                        value={duration}
                        onChange={(e) => {
                            dispatch(setDuration(Number(e.target.value)));
                          }}
                        min={1}
                        max={9000}
                        step={1}
                        className="!w-24"
                    />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                    runCode();
                }}>
                    <FontAwesomeIcon icon={faPlay} />
            </motion.button>

        </div>
    );
}
