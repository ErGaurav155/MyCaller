import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not configured');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (audioUrl: string): Promise<string> => {
  try {
    // Download audio from Twilio
    const response = await fetch(audioUrl);
    const audioBuffer = await response.arrayBuffer();
    
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], 'audio.wav', { type: 'audio/wav' }),
      model: 'whisper-1',
    });
    
    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    return '';
  }
};