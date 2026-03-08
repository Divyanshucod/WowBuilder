import {Background, Controls, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';

import CustomEdge from './CustomEdge';
import { GenerateNodes } from '../functions/CreateNodes';

export const LeftBottomSection = ({UploadedFile}:{UploadedFile: any | null}) => {
    const [initialEdges,setInitialEdges] = useState<Edge[]>([]);
    const [initialNodes,setInitialNodes] = useState<Node[]>([]);
    // {console.log('in the bottom left');
    // }
    // {console.log(UploadedFile);
    // }
    useEffect(()=>{
    //   console.log(UploadedFile);
      
      if (UploadedFile) {
        const val = GenerateNodes(UploadedFile) as { initialEdges: Edge[]; initialNodes: Node[] };
        if(val){
            setInitialNodes(val.initialNodes);
            setInitialEdges(val.initialEdges);
        }
      }
    },[UploadedFile,setInitialNodes,setInitialEdges])
    return (
           <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <Background/>
        <Controls />
      </ReactFlow>
    </div>
    );
}