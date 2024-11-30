const { createClient: createDeepgramClient } = require('@deepgram/sdk');
const deepgram = createDeepgramClient(process.env.DEEPGRAM_API_KEY);

// Transcribe audio
const transcribeAudio = async (req, res) => {
    const { audioUrl } = req.body;

    if (!audioUrl) {
        return res.status(400).json({ error: 'Audio URL is required' });
    }

    try {
        const transcription = await deepgram.transcription.preRecorded(
            { url: audioUrl },
            { punctuate: true, language: 'en-US' }
        );

        const transcript = transcription.results.channels[0].alternatives[0].transcript;
        res.status(200).json({ transcript });
    } catch (error) {
        console.error('Deepgram API Error:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
};

module.exports = { transcribeAudio };
