
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import ResizableNodeWrapper from './ResizableNodeWrapper';

interface NodeData {
  label: string;
}

interface NodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
  dimensions?: { width: number; height: number };
}

export const ProcessNode = memo(({ id, data, selected, dimensions }: NodeProps) => {
  const width = dimensions?.width || 120;
  const height = dimensions?.height || 60;
  
  return (
    <ResizableNodeWrapper id={id} selected={selected}>
      <div 
        className="process-node flex items-center justify-center p-2"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Handle type="target" position={Position.Top} />
        <div className="node-label text-center">{data.label}</div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    </ResizableNodeWrapper>
  );
});

export const DecisionNode = memo(({ id, data, selected, dimensions }: NodeProps) => {
  const size = dimensions?.height || 70;
  
  return (
    <ResizableNodeWrapper id={id} selected={selected}>
      <div 
        className="decision-node flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Handle type="target" position={Position.Top} style={{ left: '50%' }} />
        <div className="node-label text-center text-sm">{data.label}</div>
        <Handle type="source" position={Position.Bottom} style={{ left: '50%' }} />
        <Handle type="source" position={Position.Left} style={{ top: '50%' }} id="left" />
        <Handle type="source" position={Position.Right} style={{ top: '50%' }} id="right" />
      </div>
    </ResizableNodeWrapper>
  );
});

export const StartEndNode = memo(({ id, data, selected, dimensions }: NodeProps) => {
  const width = dimensions?.width || 120;
  const height = dimensions?.height || 60;
  
  return (
    <ResizableNodeWrapper id={id} selected={selected}>
      <div 
        className="start-end-node flex items-center justify-center p-2"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {data.label.toLowerCase().includes('start') ? (
          <Handle type="source" position={Position.Bottom} />
        ) : (
          <Handle type="target" position={Position.Top} />
        )}
        <div className="node-label text-center">{data.label}</div>
      </div>
    </ResizableNodeWrapper>
  );
});

export const IONode = memo(({ id, data, selected, dimensions }: NodeProps) => {
  const width = dimensions?.width || 120;
  const height = dimensions?.height || 60;
  
  return (
    <ResizableNodeWrapper id={id} selected={selected}>
      <div 
        className="io-node flex items-center justify-center p-2"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Handle type="target" position={Position.Top} />
        <div className="node-label text-center">{data.label}</div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    </ResizableNodeWrapper>
  );
});
