import OpenAI from 'openai';
import dotenv from 'dotenv';

// Laden der Umgebungsvariablen
dotenv.config();

// Erstellen einer neuen OpenAI-Instanz
const openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1/',
    apiKey: 'obama',
});

const openaiserver = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

// Funktion zum Senden einer Anfrage an die KI
export async function askAI(AIprompt: string, aiSource: string, temperature: number) {
    console.log("Rufe KI auf...");
    let response;
    let responseserver;
    let errormessage;
    try {
        switch (aiSource) {
            case ("local"):
                console.log("Lokalen KI Anfrage")
                errormessage = "Lokalen KI Anfrage"
                // Erstellen und Senden der Anfrage
                response = await openai.chat.completions.create({
                    model: "llama3",
                    response_format: { "type": "json_object" },
                    messages: JSON.parse(AIprompt).messages,
                    temperature: temperature,
                    max_tokens: 8000,
                });
                return response.choices[0].message.content;
            case ("server"):
                console.log("Server KI Anfrage")
                errormessage = "Server KI Anfrage"
                responseserver = await openaiserver.chat.completions.create({
                    model: "codestral",
                    response_format: { "type": "json_object" },
                    messages: JSON.parse(AIprompt).messages,
                    temperature: temperature,
                    max_tokens: 8000,
                });
                return responseserver.choices[0].message.content;

            default:
                throw new Error("Fehler im aiInterface. Die es wurde weder local noch server ausgewählt")
        }
        // Rückgabe der KI-Antwort
    } catch (error) {
        console.error(`Fehler in der KI-Schnittstelle (${errormessage}) :`, error);
        throw new Error('KI-Anfrage fehlgeschlagen');
    }
}
