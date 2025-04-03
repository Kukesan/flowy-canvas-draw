
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import FlowchartEditor from '@/components/flowchart/FlowchartEditor';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">FlowCanvas - Interactive Flowchart Builder</h1>
        <p className="text-sm opacity-80">Create, edit, and visualize flowcharts with ease</p>
      </header>
      
      <main className="flex-1 flex">
        <ReactFlowProvider>
          <FlowchartEditor className="h-[calc(100vh-4rem)]" />
        </ReactFlowProvider>
      </main>
    </div>
  );
};

export default Index;
