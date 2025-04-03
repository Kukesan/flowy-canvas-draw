
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface NodeData {
  label: string;
}

export const ProcessNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div className="process-node flex items-center justify-center p-2 w-[120px] h-[60px]">
      <Handle type="target" position={Position.Top} />
      <div className="node-label text-center">{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export const DecisionNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div className="decision-node flex items-center justify-center">
      <Handle type="target" position={Position.Top} style={{ left: '50%' }} />
      <div className="node-label text-center text-sm">{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={{ left: '50%' }} />
      <Handle type="source" position={Position.Left} style={{ top: '50%' }} id="left" />
      <Handle type="source" position={Position.Right} style={{ top: '50%' }} id="right" />
    </div>
  );
});

export const StartEndNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div className="start-end-node flex items-center justify-center p-2 w-[120px] h-[60px]">
      {data.label.toLowerCase().includes('start') ? (
        <Handle type="source" position={Position.Bottom} />
      ) : (
        <Handle type="target" position={Position.Top} />
      )}
      <div className="node-label text-center">{data.label}</div>
    </div>
  );
});

export const IONode = memo(({ data }: { data: NodeData }) => {
  return (
    <div className="io-node flex items-center justify-center p-2 w-[120px] h-[60px]">
      <Handle type="target" position={Position.Top} />
      <div className="node-label text-center">{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
