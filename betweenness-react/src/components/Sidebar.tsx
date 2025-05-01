import { useState, useRef } from 'react';
import { motion } from "motion/react";
import {TooltipWrapper} from "./TooltipWrapper";
import { useFloating, offset, useHover, useInteractions, FloatingPortal, autoUpdate } from '@floating-ui/react';
import "../App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareNodes, faPencil } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawingNode } from '../store/graphSlice';
import type { RootState } from '../store/store';



export function Sidebar() {
    const dispatch = useDispatch();
    const isDrawingNode = useSelector((state: RootState) => state.graph.isDrawingNode);
    


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
                        className={`!w-20 !flex gap-2 justify-center ${isDrawingNode ? "!bg-blue-500 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => dispatch(toggleDrawingNode())}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                        <FontAwesomeIcon icon={faShareNodes} />

                    </motion.button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Activate drawing node" tooltipPosition={"left"}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`!w-20 !flex gap-2 justify-center ${false ? "!bg-blue-500 !text-white" : "!bg-gray-300 !text-gray-700"}`}
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                        <FontAwesomeIcon icon={faShareNodes} />

                    </motion.button>
                </TooltipWrapper>
            </div>
            <h2 className="text-xl font-bold mt-4">Interactive Web</h2>
            
        </div>
    );
}
