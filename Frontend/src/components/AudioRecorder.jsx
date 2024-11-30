import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { CirclePause, Mic } from 'lucide-react';
import { createClient } from '@deepgram/sdk';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [status, setStatus] = useState();
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [audioFiles, setAudioFiles] = useState([]); 
    const [backet ,setbacket] =useState("audio_ recording")
   
    // Function to start recording
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => setChunks((prev) => [...prev, e.data]);
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setStatus(<div className='flex justify-center items-center'>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>);
    };

    // Function to stop recording and save the audio
    const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
        setStatus('Stopping...');
        saveAudioFile();
    };

    // Function to save the audio file to Supabase
    const saveAudioFile = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
         const fileName = `audio-${Date.now()}.wav`;
      

        const { data, error } = await supabase.storage
            .from('audio_ recording')
            .upload(fileName, audioBlob);

        if (error) {
            setStatus('Failed to upload');
            console.error('Error uploading file:', error);
        } else {
            const { publicUrl } = supabase.storage
                .from('audio_ recording')
                .getPublicUrl(fileName);

            setDownloadUrl(publicUrl);
            setStatus('Audio saved successfully!');
        }
    };
   


 


   
    const listAudioFiles = async () => {
        const { data, error } = await supabase
            .storage
            .from('audio_ recording')  // Use the correct bucket name
            .list('', { 
                limit: 100,      // Limit the number of results to 100
            });

        if (error) {
            console.error('Error listing files:', error.message);
            return;
        }
   console.log(data);
        setAudioFiles(data);  // Update state with the list of audio files
    };

    // Use useEffect to list audio files when the component mounts
    useEffect(() => {
        listAudioFiles();
    }, [],);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto ">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Audio Recorder</h1>

            <div className='h-4'>
                <p className="text-gray-500 mb-6">{status}</p>
            </div>

            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-6 mt-20 py-3 bg-green-600 text-white font-medium rounded-lg w-full flex justify-center items-center${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
            >
                {isRecording ? <CirclePause /> : <Mic />}
            </button>

            {downloadUrl && (
                <div className="mt-6">
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        Download your recording
                    </a>
                </div>
            )}

            {/* List all recorded files */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">All Recordings</h2>
                {audioFiles.length > 0 ? (
                    <ul>
                        {audioFiles.map((file) => (
                            <li key={file.name} className="mb-2">
                                <a
                                    href={`https://zhltpofqbbdsmguyhjwwsupabase.co/storage/v1/object/public/${backet}/${file.name}`} // Construct the URL
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    {file.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recordings found.</p>
                )}
            </div>
        </div>
    );
};

export default AudioRecorder;
