
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Trash2, 
  Save, 
  Undo, 
  Redo, 
  Grid3X3
} from 'lucide-react';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDelete: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleGrid: () => void;
  showGrid: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onDelete,
  onSave,
  onUndo,
  onRedo,
  onToggleGrid,
  showGrid
}) => {
  return (
    <div className="toolbar">
      <Button variant="outline" size="icon" onClick={onZoomIn} title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onZoomOut} title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <div className="border-r border-gray-200 h-6 mx-2"></div>
      <Button variant="outline" size="icon" onClick={onDelete} title="Delete Selected">
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onSave} title="Save Diagram">
        <Save className="h-4 w-4" />
      </Button>
      <div className="border-r border-gray-200 h-6 mx-2"></div>
      <Button variant="outline" size="icon" onClick={onUndo} title="Undo">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onRedo} title="Redo">
        <Redo className="h-4 w-4" />
      </Button>
      <div className="border-r border-gray-200 h-6 mx-2"></div>
      <Button 
        variant={showGrid ? "default" : "outline"} 
        size="icon" 
        onClick={onToggleGrid} 
        title="Toggle Grid"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Toolbar;
