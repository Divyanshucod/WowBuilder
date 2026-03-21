import { Background, Controls, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {  useCallback, useEffect, useRef } from 'react';
import { ReactFlow, useReactFlow } from '@xyflow/react';

import { GenerateNodes } from '../functions/CreateNodes';
import { useTheme } from './Hooks/ThemeToggler';
import type { themeColor } from './Contexts';
import { highlightDark, highlightLight } from './UI/NodeUI';

interface GenerateNodesReturn {
  initialNodes: Node[];
  initialEdges: Edge[];
  firstInstanceMap: Map<string, string>;
}

export const WorkflowCanvas = ({ UploadedFile, initialEdges, setInitialEdges, initialNodes, setInitialNodes, firstInstanceMap, setFirstInstanceMap, isSearchOpen, setIsSearchOpen }: { UploadedFile: any | null, initialEdges: Edge[], setInitialEdges: React.Dispatch<React.SetStateAction<Edge[]>>, initialNodes: Node[], setInitialNodes: React.Dispatch<React.SetStateAction<Node[]>>, firstInstanceMap: Map<string, string>, setFirstInstanceMap: React.Dispatch<React.SetStateAction<Map<string, string>>>, isSearchOpen: boolean, setIsSearchOpen: (val: boolean) => void }) => {
  const { setCenter } = useReactFlow();
  const { theme, toggleTheme } = useTheme();
  const flowref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (UploadedFile) {
      const val = GenerateNodes(UploadedFile) as GenerateNodesReturn;
      if (val) {
        setInitialNodes(val.initialNodes);
        setInitialEdges(val.initialEdges);
        setFirstInstanceMap(val.firstInstanceMap);

        // Focus on the start module (module_countryPicker)
        const startNode = val.initialNodes.find(n => n.id.includes('module_countryPicker'));
        if (startNode) {
          setTimeout(() => {
            setCenter(startNode.position.x, startNode.position.y, { zoom: 1.5, duration: 800 });
          }, 100);
          flashHighlightNode(startNode.id, theme, setInitialNodes);
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
        flashHighlightNode(originalId, theme, setInitialNodes);
      }
    }
  }, [initialNodes, setCenter]);

  if (isSearchOpen === undefined) {
    console.error(" isSearchOpen is undefined bro");
  }
  else{
    console.log(" isSearchOpen is defined bro"+isSearchOpen);
  }
  
  return (
    <div className={`h-full w-full ${isSearchOpen ? "disable-interaction react-flow" : ""}`} ref={flowref} >
    
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onNodeClick={handleNodeClick}
        colorMode={theme}
        panOnScroll={!isSearchOpen}
        selectionOnDrag={!isSearchOpen}
        panOnDrag={false}
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

export const flashHighlightNode = (nodeId: string, theme: themeColor, setInitialNodes: React.Dispatch<React.SetStateAction<Node[]>>) => {
  const highlightStyle = theme === "dark" ? highlightDark : highlightLight;

  setInitialNodes((nds) =>
    nds.map((node) =>
      node.id === nodeId
        ? {
          ...node,
          style: {
            ...node.style,
            ...highlightStyle,
          },
        }
        : node
    )
  );

  setTimeout(() => {
    setInitialNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            style: {
              ...node.style,
              outline: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
          }
          : node
      )
    );
  }, 1200);
};