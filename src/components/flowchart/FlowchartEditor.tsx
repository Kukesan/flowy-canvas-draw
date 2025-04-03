
import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  MiniMap,
  NodeChange,
  EdgeChange,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ProcessNode, DecisionNode, StartEndNode, IONode } from './NodeTypes';
import NodePanel from './NodePanel';
import Toolbar from './Toolbar';

// Define node types for the flowchart
const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
  io: IONode,
};

// Default starting nodes
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'start',
    position: { x: 250, y: 50 },
    data: { label: 'Start' },
  }
];

// Default starting edges
const initialEdges: Edge[] = [];

interface FlowchartEditorProps {
  className?: string;
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({ className }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showGrid, setShowGrid] = useState(true);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { zoomIn, zoomOut, getNodes, getEdges, setViewport } = useReactFlow();
  
  // History for undo/redo functionality
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // On connection between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        style: { strokeWidth: 2 },
      };
      
      const newEdges = addEdge(newEdge, edges);
      setEdges(newEdges);
      
      // Update history
      addToHistory(nodes, newEdges);
    },
    [edges, nodes]
  );

  // Add current state to history
  const addToHistory = (nodes: Node[], edges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle node changes and update history
  const handleNodesChange = (changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Don't add to history for selection changes
    if (!changes.every(change => change.type === 'select')) {
      addToHistory(getNodes(), getEdges());
    }
  };

  // Handle edge changes and update history
  const handleEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);
    
    // Don't add to history for selection changes
    if (!changes.every(change => change.type === 'select')) {
      addToHistory(getNodes(), getEdges());
    }
  };

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { nodes: historyNodes, edges: historyEdges } = history[newIndex];
      setNodes(historyNodes);
      setEdges(historyEdges);
      setHistoryIndex(newIndex);
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { nodes: historyNodes, edges: historyEdges } = history[newIndex];
      setNodes(historyNodes);
      setEdges(historyEdges);
      setHistoryIndex(newIndex);
    }
  };

  // Delete selected elements
  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !edge.selected));
    addToHistory(
      getNodes().filter((node) => !node.selected),
      getEdges().filter((edge) => !edge.selected)
    );
  };

  // Save the diagram (demonstrate with JSON for now)
  const handleSave = () => {
    const flowData = {
      nodes: getNodes(),
      edges: getEdges(),
    };
    
    // In a real app, you'd send this to a server or save to local storage
    console.log('Flowchart data saved:', flowData);
    toast.success('Flowchart saved successfully!');
  };

  // Handle drag over for node placement
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop for adding new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      
      if (!data) return;

      const { type, label } = JSON.parse(data);
      
      // Get position from drop coordinates
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create new node
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label },
      };

      // Add new node to the graph
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      
      // Update history
      addToHistory(newNodes, edges);
    },
    [reactFlowInstance, nodes, edges]
  );

  return (
    <div className={`flex h-full w-full ${className}`}>
      <NodePanel />
      <div className="flex-1 flex flex-col">
        <Toolbar
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onDelete={handleDelete}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onToggleGrid={() => setShowGrid(!showGrid)}
          showGrid={showGrid}
        />
        <div 
          className="flex-1 h-full w-full"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            deleteKeyCode="Delete"
            fitView
            snapToGrid
            snapGrid={[10, 10]}
          >
            {showGrid && (
              <Background
                variant="dots"
                gap={20}
                size={1}
              />
            )}
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Panel position="top-right" className="bg-white p-2 rounded shadow-sm border border-gray-200">
              <div className="text-xs text-gray-500">
                Drag elements from left panel to canvas
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default FlowchartEditor;
