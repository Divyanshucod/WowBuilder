import {Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import CustomEdge from './CustomEdge';

const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
  {
    id: 'n3',
    position: { x: 20, y: 20 },
    data: { label: 'Node 3' },
    type: 'input',
  },
  {
    id: 'n4',
    position: { x: 30, y: 30 },
    data: { label: 'Node 4' },
  },
];
const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    type: 'smoothstep',
    label: 'connects with',
  },
];
export const LeftBottomSection = ({ initialEdges, initialNodes }:{initialEdges:[], initialNodes:[]}) => {
    return (
           <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow >
        <Background/>
        <Controls />
      </ReactFlow>
    </div>
    );
}