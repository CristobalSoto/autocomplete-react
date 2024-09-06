import React from 'react';
import './App.css';
import AutoComplete from './AutoComplete';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AutoComplete placeholder='Search...'/>
      </header>
    </div>
  );
}

export default App;
