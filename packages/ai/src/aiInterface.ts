import OpenAI from 'openai';
import dotenv from 'dotenv';

// Laden der Umgebungsvariablen
dotenv.config();

// Erstellen einer neuen OpenAI-Instanz
const openaiLocal = new OpenAI({
    baseURL: process.env.LOCAL_OPENAI_BASE_URL || 'http://localhost:11434/v1/',
    apiKey: process.env.LOCAL_OPENAI_API_KEY || 'obama', //Api Key wird nicht benutzt im lokalen Modus
});

const openaiServer = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

// Funktion zum Senden einer Anfrage an die KI
export async function askAI(AIprompt: string, aiSource: 'local' | 'server', temperature: number): Promise<string> {
    try {
        const aiInstance = aiSource === 'local' ? openaiLocal : openaiServer;
        const response = await aiInstance.chat.completions.create({
            model: aiSource === 'local' ? "codestral" : "codestral",
            response_format: { "type": "json_object" },
            messages: JSON.parse(AIprompt).messages,
            temperature: temperature,
            max_tokens: 8000,
        });

        if (response.choices && response.choices.length > 0 && response.choices[0].message.content !== null) {
            return response.choices[0].message.content;
        } else {
            throw new Error('No response from AI or response is null');
        }
    } catch (error) {
        console.error(`Fehler in der KI-Schnittstelle (${aiSource}) :`, error);
        throw new Error('KI-Anfrage fehlgeschlagen');
    }
}
