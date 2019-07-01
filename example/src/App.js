import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-component-carousel/dist/component-carousel.css'
import PhotosExample from './components/PhotosExample';

function App() {
  return (
    <div className="Main-App">
      <div>
        <PhotosExample className="Main-App-photo" />
      </div>
      <header className="Main-App-header">
        <img src={logo} className="Main-App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
