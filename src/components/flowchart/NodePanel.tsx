
import React from 'react';
import DraggableNode from './DraggableNode';

const NodePanel: React.FC = () => {
  return (
    <div className="node-panel">
      <div className="node-panel-header">Flowchart Elements</div>
      <div className="node-panel-content">
        <div className="node-category">
          <div className="node-category-title">Basic</div>
          <div className="nodes-container">
            <DraggableNode type="process" label="Process" className="process-node" />
            <DraggableNode type="decision" label="Decision" className="decision-node" />
            <DraggableNode type="start" label="Start" className="start-end-node" />
            <DraggableNode type="end" label="End" className="start-end-node" />
            <DraggableNode type="io" label="Input/Output" className="io-node" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePanel;
