import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AudioRecorder from './components/AudioRecorder';
import AudioTranscriber from './components/AudioTranscriber';

function App() {


  return (
    <>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <AudioRecorder />
            <AudioTranscriber/>
        </div>
   
    </>
  )
}

export default App;
