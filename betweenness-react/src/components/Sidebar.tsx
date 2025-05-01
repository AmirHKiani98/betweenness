import "../App.css";
import { motion } from "motion/react";
import {TooltipWrapper} from "./TooltipWrapper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareNodes, faPencil, faCircleDot } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawingNode, toggleDrawingLink } from '../store/graphSlice';
import type { RootState } from '../store/store';




export function Sidebar() {
    const dispatch = useDispatch();
    const isDrawingNode = useSelector((state: RootState) => state.graph.isDrawingNode);
    const isDrawingLink = useSelector((state: RootState) => state.graph.isDrawingLink);
    const x = useSelector((state: RootState) => state.graph.x);
    const y = useSelector((state: RootState) => state.graph.y);

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

            <TooltipWrapper tooltipText="Calculates centerness score">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=""
                onClick={() => console.log("Find Centerness")}
                >
                Find Centerness
                </motion.button>
            </TooltipWrapper>
            <div className='flex items-center justify-between'>
                <TooltipWrapper tooltipText="Activate drawing node">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`!w-20 !flex gap-2 justify-center ${isDrawingNode ? "!bg-main-800 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => dispatch(toggleDrawingNode())}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                        <FontAwesomeIcon icon={faCircleDot} />

                    </motion.button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Activate drawing lines" tooltipPosition={"left"}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`!w-20 !flex gap-2 justify-center ${isDrawingLink ? "!bg-main-800 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => dispatch(toggleDrawingLink())}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                        <FontAwesomeIcon icon={faShareNodes} />

                    </motion.button>
                </TooltipWrapper>
            </div>
            <h2 className="text-xl font-bold mt-4">Interactive Web</h2>
            <div className="flex justify-between items-center gap-5 [&>div]:flex [&>div]:flex-row [&>div]:gap-2 [&>div]:items-center [&>div]:justify-between [&>div>*]:text-2xl [&>div>span]:text-main-600 [&>div]:item-center">
                <div><p>x</p><span>{x ?? "----"}</span></div>
                <div><p>y</p><span>{y ?? "----"}</span></div>

            </div>
        </div>
    );
}
