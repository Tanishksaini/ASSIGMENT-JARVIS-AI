import React, { useState, useEffect } from 'react';

const AudioTranscriber = () => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [transcription, setTranscription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch audio files from backend
        const fetchAudioFiles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/list-audio');
                const data = await response.json();
                setAudioFiles(data.audioFiles || []);
            } catch (error) {
                console.error('Error fetching audio files:', error);
            }
        };

        fetchAudioFiles();
    }, []);

    const transcribeAudio = async (audioUrl) => {
        setIsLoading(true);
        setTranscription('');

        try {
            const response = await fetch('http://localhost:5000/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioUrl }),
            });

            const data = await response.json();
            if (response.ok) {
                setTranscription(data.transcript);
            } else {
                console.error('Transcription error:', data.error);
            }
        } catch (error) {
            console.error('Error transcribing audio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Audio Files</h1>
            <ul className="list-disc list-inside">
                {audioFiles.map((file) => (
                    <li key={file.name}>
                        {file.name}{' '}
                        <button
                            onClick={() => transcribeAudio(file.url)}
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Transcribe
                        </button>
                    </li>
                ))}
            </ul>

            {isLoading && <p className="mt-4 text-blue-500">Transcribing...</p>}

            {transcription && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold">Transcription:</h3>
                    <p className="text-gray-700">{transcription}</p>
                </div>
            )}
        </div>
    );
};

export default AudioTranscriber;
