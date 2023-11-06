import React from 'react';
import './App.css';
import DraggableResizable from './DraggableResizable';
function App() {
  return (
    <div className="App">
      <DraggableResizable
        left={20}
        top={20}
        width={200}
        height={100}
        bounds="parent"
        onDragStop={({left, top}) => {
          console.log(top, left)
        }}
        onResizeStop={({left, top, width, height}) => {
          console.log(left, top, width, height) 
        }}
      >
       <div style={{border: '1px solid red',height: '100%',width: '100%',boxSizing: 'border-box', background: '#fff'}}></div>
      </DraggableResizable>
    </div>
  );
}

export default App;
