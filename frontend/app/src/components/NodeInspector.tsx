export const NodeInspector = ({
  selectedNode
}: {
  selectedNode: { id: string; label: string } | null;
}) => {
    
  return (
    <div className="p-4 border-b border-gray-700 flex-1">

      <h3 className="text-sm font-semibold mb-3 text-[#0F172A] dark:text-[#E5E7EB]">
        Node Details
      </h3>

      {!selectedNode ? (
        <p className="text-sm text-[#0F172A] dark:text-[#E5E7EB]">
          Click a node to see details
        </p>
      ) : (
        <div className="space-y-2 text-sm overflow-y-auto">
          <div>
            <span className="text-gray-400">ID</span>
            <p className="text-white">{selectedNode.id}</p>
          </div>

          <div>
            <span className="text-gray-400">Label</span>
            <p className="text-white">{selectedNode.label}</p>
          </div>
        </div>
      )}
    </div>
  );
};