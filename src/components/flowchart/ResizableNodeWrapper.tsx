
import React, { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

interface ResizableNodeProps {
  id: string;
  selected: boolean;
  children: React.ReactNode;
}

const ResizableNodeWrapper: React.FC<ResizableNodeProps> = ({ id, selected, children }) => {
  return (
    <div className="resizable-node">
      {selected && (
        <NodeResizer
          minWidth={60}
          minHeight={40}
          isVisible={selected}
          handleStyle={{ 
            width: 10, 
            height: 10, 
            borderRadius: 5, 
            backgroundColor: '#FFF', 
            border: '3px solid #8B5CF6',
            opacity: 1
          }}
        />
      )}
      {children}
    </div>
  );
};

export default memo(ResizableNodeWrapper);
