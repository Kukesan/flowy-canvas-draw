
import React from 'react';
import { NodeChange } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

interface PropertiesPanelProps {
  selectedNode: any | null;
  onNodeChange: (changes: NodeChange[]) => void;
  updateNodeData: (nodeId: string, data: any) => void;
}

const nodeColors = [
  { value: 'process', label: 'Purple', color: '#8B5CF6' },
  { value: 'decision', label: 'Pink', color: '#D946EF' },
  { value: 'start', label: 'Blue', color: '#0EA5E9' },
  { value: 'end', label: 'Orange', color: '#F97316' },
  { value: 'io', label: 'Green', color: '#10B981' },
];

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedNode, 
  onNodeChange, 
  updateNodeData 
}) => {
  if (!selectedNode) {
    return (
      <div className="properties-panel">
        <div className="p-4 text-sm text-gray-500">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(selectedNode.id, { 
      ...selectedNode.data, 
      label: e.target.value 
    });
  };

  const handleColorChange = (value: string) => {
    // Change node type to change its color
    onNodeChange([
      {
        type: 'replace',
        id: selectedNode.id,
        item: {
          ...selectedNode,
          type: value,
        }
      }
    ]);
  };

  const handleSizeChange = (values: number[]) => {
    const size = values[0];
    
    // For decision nodes, we maintain a square shape
    const width = selectedNode.type === 'decision' ? size : size * 2;
    const height = size;
    
    onNodeChange([
      {
        type: 'dimensions',
        id: selectedNode.id,
        dimensions: {
          width,
          height,
        }
      }
    ]);
  };

  // Get current node dimensions or default values
  const currentHeight = selectedNode.dimensions?.height || 60;

  return (
    <div className="properties-panel p-4 space-y-4">
      <h3 className="text-md font-medium">Node Properties</h3>
      <Separator />
      
      <div className="space-y-2">
        <Label htmlFor="node-label">Label</Label>
        <Input
          id="node-label"
          value={selectedNode.data.label || ''}
          onChange={handleLabelChange}
          placeholder="Enter node label"
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <RadioGroup 
          value={selectedNode.type} 
          onValueChange={handleColorChange}
          className="flex flex-wrap gap-2"
        >
          {nodeColors.map((color) => (
            <div key={color.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={color.value} 
                id={`color-${color.value}`}
                className="peer sr-only" 
              />
              <Label
                htmlFor={`color-${color.value}`}
                className="flex items-center gap-2 rounded-md border-2 border-muted px-3 py-2 peer-data-[state=checked]:border-primary"
              >
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color.color }}
                />
                {color.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Size</Label>
        <Slider
          defaultValue={[currentHeight]}
          max={120}
          min={40}
          step={10}
          value={[currentHeight]}
          onValueChange={handleSizeChange}
          className="py-4"
        />
      </div>
    </div>
  );
};

export default PropertiesPanel;
