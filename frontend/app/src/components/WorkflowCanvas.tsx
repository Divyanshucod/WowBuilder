import {Background, BackgroundVariant, Controls, type Edge, type Node, type ColorMode} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges, useReactFlow } from '@xyflow/react';

import { GenerateNodes } from '../functions/CreateNodes';
import { useTheme } from './Hooks/ThemeToggler';

interface GenerateNodesReturn {
  initialNodes: Node[];
  initialEdges: Edge[];
  firstInstanceMap: Map<string, string>;
}

export const WorkflowCanvas = ({UploadedFile}:{UploadedFile: any | null}) => {
    const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node[]>([]);
    const [firstInstanceMap, setFirstInstanceMap] = useState<Map<string, string>>(new Map());
    const { setCenter } = useReactFlow();
    const {theme, toggleTheme} = useTheme();
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
           <div className='h-full w-full'>
      <ReactFlow 
        nodes={initialNodes} 
        edges={initialEdges}
        onNodeClick={handleNodeClick}
        colorMode={theme}
      >
        <Background
  gap={20}
  size={1}
  color="#1f2937"
/>
<div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-400">
  Scroll to explore • Click nodes for details
</div>
        <Controls />
      </ReactFlow>
    </div>
    );
}