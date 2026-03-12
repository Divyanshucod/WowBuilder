import {Background, Controls, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges, useReactFlow } from '@xyflow/react';

import { GenerateNodes } from '../functions/CreateNodes';

interface GenerateNodesReturn {
  initialNodes: Node[];
  initialEdges: Edge[];
  firstInstanceMap: Map<string, string>;
}

export const LeftBottomSection = ({UploadedFile}:{UploadedFile: any | null}) => {
    const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node[]>([]);
    const [firstInstanceMap, setFirstInstanceMap] = useState<Map<string, string>>(new Map());
    const { setCenter } = useReactFlow();

    useEffect(() => {
      if (UploadedFile) {
        const val = GenerateNodes(UploadedFile) as GenerateNodesReturn;
        if (val) {
            setInitialNodes(val.initialNodes);
            setInitialEdges(val.initialEdges);
            setFirstInstanceMap(val.firstInstanceMap);

            // Focus on the starting module (module_countryPicker)
            const startNode = val.initialNodes.find(n => n.id.includes('module_countryPicker'));
            if (startNode) {
              setTimeout(() => {
                setCenter(startNode.position.x, startNode.position.y, { zoom: 1.5, duration: 800 });
              }, 100);
            }
        }
      }
    }, [UploadedFile, setCenter]);

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
      const nodeData = node.data as { originalId?: string; label?: string };
      
      if (node.id.startsWith('GOTO-')) {
        // Get the original node ID from the GOTO node
        const originalId = nodeData.originalId;
        
        if (originalId) {
          // Find the original node in the graph
          const targetNode = initialNodes.find(n => n.id === originalId);
          
          if (targetNode) {
            setCenter(targetNode.position.x, targetNode.position.y, { zoom: 1.5, duration: 800 });
          }
        }
      }
    }, [initialNodes, setCenter]);

    return (
           <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow 
        nodes={initialNodes} 
        edges={initialEdges}
        onNodeClick={handleNodeClick}
      >
        <Background/>
        <Controls />
      </ReactFlow>
    </div>
    );
}