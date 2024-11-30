const supabase = require('../supabaseClient');

// List audio files
const listAudioFiles = async (req, res) => {
    try {
        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .list();

        if (error) {
            console.error('Error listing audio files:', error);
            return res.status(500).json({ error: 'Failed to list audio files' });
        }

        // Generate public URLs
        const audioFiles = data.map((file) => {
            const { publicUrl } = supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .getPublicUrl(file.name);

            return { name: file.name, url: publicUrl };
        });

        res.status(200).json({ audioFiles });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to list audio files' });
    }
};

module.exports = { listAudioFiles };
