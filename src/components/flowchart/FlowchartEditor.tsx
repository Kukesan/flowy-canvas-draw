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
  BackgroundVariant,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ProcessNode, DecisionNode, StartEndNode, IONode } from './NodeTypes';
import NodePanel from './NodePanel';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
  
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [edgeLabel, setEdgeLabel] = useState('');
  const [showProperties, setShowProperties] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        label: edgeLabel || 'connect',
        labelStyle: { fill: '#888', fontSize: 12 },
        style: { strokeWidth: 2 },
      };
      
      const newEdges = addEdge(newEdge, edges);
      setEdges(newEdges);
      
      addToHistory(nodes, newEdges);
      
      setEdgeLabel('');
    },
    [edges, nodes, edgeLabel]
  );

  const addToHistory = (nodes: Node[], edges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleNodesChange = (changes: NodeChange[]) => {
    onNodesChange(changes);
    
    const selectionChange = changes.find(
      change => change.type === 'select' && change.selected !== undefined
    );
    
    if (selectionChange && selectionChange.type === 'select') {
      const selectedNodeId = selectionChange.selected ? selectionChange.id : null;
      const node = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
      setSelectedNode(node || null);
      console.log("Node selected:", node);
    }
    
    if (changes.some(change => change.type === 'dimensions' || change.type === 'replace' || change.type === 'position')) {
      console.log("Adding to history due to node change:", changes);
      setTimeout(() => {
        addToHistory(getNodes(), getEdges());
      }, 100);
    }
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);
    
    if (!changes.every(change => change.type === 'select')) {
      addToHistory(getNodes(), getEdges());
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { nodes: historyNodes, edges: historyEdges } = history[newIndex];
      setNodes(historyNodes);
      setEdges(historyEdges);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { nodes: historyNodes, edges: historyEdges } = history[newIndex];
      setNodes(historyNodes);
      setEdges(historyEdges);
      setHistoryIndex(newIndex);
    }
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !edge.selected));
    addToHistory(
      getNodes().filter((node) => !node.selected),
      getEdges().filter((edge) => !edge.selected)
    );
  };

  const handleSave = () => {
    const flowData = {
      nodes: getNodes(),
      edges: getEdges(),
    };
    
    console.log('Flowchart data saved:', flowData);
    toast.success('Flowchart saved successfully!');
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      
      if (!data) return;

      const { type, label } = JSON.parse(data);
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      
      addToHistory(newNodes, edges);
    },
    [reactFlowInstance, nodes, edges]
  );

  const handleConnectionMode = () => {
    setIsConnecting(!isConnecting);
  };

  const handleToggleProperties = () => {
    setShowProperties(!showProperties);
  };

  const handleEdgeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdgeLabel(e.target.value);
  };

  const updateNodeData = (nodeId: string, data: any) => {
    console.log(`Updating node ${nodeId} data:`, data);
    setNodes((nodes) => nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data
        };
      }
      return node;
    }));
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({
        ...selectedNode,
        data
      });
    }
    
    setTimeout(() => {
      addToHistory(
        getNodes().map(node => {
          if (node.id === nodeId) {
            return { ...node, data };
          }
          return node;
        }),
        getEdges()
      );
    }, 100);
  };

  return (
    <div className={`flex h-full w-full ${className}`}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <NodePanel />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={showProperties ? 60 : 80}>
          <div className="flex-1 flex flex-col h-full">
            <Toolbar
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onDelete={handleDelete}
              onSave={handleSave}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onConnectionMode={handleConnectionMode}
              onToggleProperties={handleToggleProperties}
              isConnecting={isConnecting}
              showGrid={showGrid}
              showProperties={showProperties}
            />
            
            {isConnecting && (
              <div className="p-2 bg-white border-b border-gray-200 flex items-center">
                <span className="text-sm font-medium mr-2">Connection Label:</span>
                <input
                  type="text"
                  value={edgeLabel}
                  onChange={handleEdgeLabelChange}
                  placeholder="Enter edge label"
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="ml-2 text-xs text-gray-500">Click and drag between node handles to connect</span>
              </div>
            )}
            
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
                connectionMode={isConnecting ? "loose" as ConnectionMode : "strict" as ConnectionMode}
                onNodeClick={(e, node) => {
                  console.log("Node clicked:", node);
                }}
              >
                {showGrid && (
                  <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#CCCCCC"
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
        </ResizablePanel>
        
        {showProperties && (
          <>
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={20} minSize={15}>
              <PropertiesPanel
                selectedNode={selectedNode}
                onNodeChange={onNodesChange}
                updateNodeData={updateNodeData}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowchartEditor;
