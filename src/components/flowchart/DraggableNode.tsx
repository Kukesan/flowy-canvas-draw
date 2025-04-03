
import React from 'react';

interface DraggableNodeProps {
  type: string;
  label: string;
  className?: string;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, className }) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`draggable-node ${className}`}
      onDragStart={onDragStart}
      draggable
    >
      {label}
    </div>
  );
};

export default DraggableNode;
