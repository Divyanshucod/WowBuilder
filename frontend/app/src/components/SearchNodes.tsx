import { useCallback, useEffect, useRef, useState } from 'react';
import {FiSearch} from 'react-icons/fi'
import { flashHighlightNode } from './WorkflowCanvas';
import { useTheme } from './Hooks/ThemeToggler';
import { useReactFlow } from '@xyflow/react';
export const SearchNodes = ({ firstInstanceMap, initialNodes, setInitialNodes, isSearchOpen,setIsSearchOpen}:{firstInstanceMap: Map<string,string>, initialNodes: Node[], setInitialNodes: React.Dispatch<React.SetStateAction<Node[]>>, isSearchOpen: boolean, setIsSearchOpen:(val:boolean)=>void}) => {
  const [searchedNodes, setSearchedNodes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<number | null>(null);
   const { theme, toggleTheme } = useTheme();
   const {setCenter} = useReactFlow()

   const searchRef = useRef<HTMLInputElement | null>(null); 
  useEffect(() => {
  function handleClickOutside(e) {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsSearchOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  useEffect(() => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  debounceRef.current = window.setTimeout(() => {
    const filteredNodes = Array.from(firstInstanceMap.keys()).filter(node =>
      node.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (searchTerm.trim().length > 0 && filteredNodes.length > 0) {
     setIsSearchOpen(true);
    } else {
     setIsSearchOpen(false);
    }
    setSearchedNodes(filteredNodes);
  }, 500);

}, [searchTerm]);
    const handleNodeClick = useCallback((event: React.MouseEvent, node: string) => {
        
      const nodeId = firstInstanceMap.get(node);

      if (nodeId) {
          const targetNode = initialNodes.find(n => n.id === nodeId);
  
          if (targetNode) {
            setCenter(targetNode.position.x, targetNode.position.y, { zoom: 1.5, duration: 800 });
          }
          flashHighlightNode(nodeId, theme, setInitialNodes);
        }
      }
    , [initialNodes, setCenter]);
  return (
   <div className="relative w-full" ref={searchRef}>
  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">

    <FiSearch className="text-gray-400 mr-2" />

    <input
      type="text"
      placeholder="Search nodes..."
      onChange={(e) => setSearchTerm(e.target.value)}
      className="bg-transparent outline-none text-sm flex-1 text-gray-700 dark:text-gray-200 placeholder-gray-400"
    />
  </div>

  {/* Dropdown */}
  {isSearchOpen && (
    <div
    onMouseDown={(e) => e.preventDefault()} 
  style={{ zIndex: 9999 }}
  className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-scroll pointer-events-auto"
>

      {searchedNodes.map((node, index) => (
        <div
          key={`${node}-${index}`}
          className="px-3 py-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-500 dark:border-gray-100 dark:bg-amber-300"
          onClick={(event) => handleNodeClick(event,node)} 
        >
          {node}
        </div>
      ))}

    </div>
  )}
</div>
  );
};
