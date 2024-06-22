import express from 'express';
import { askAI } from './aiInterface';
import cors from 'cors';
import { generateAIPrompt } from './promptGenerator';
import { saveDoc, getDoc, checkIfIDInUse, checkIfDocIsExisting, getAllDocs, deleteEverything, deleteDoc, deleteID, getAiSource, setAiSource, getAllDocsForSpecificId, doc, savePersonaUnderID, personaData, getPersonaForID } from './storageController';

// Erstellen einer neuen Express-Anwendung
const app = express();
const PORT = 3000;

// Speichern der Theme-Konfiguration (leztzt generierte antwort der ai) (ehemals storedThemeConfig)
let latestGeneratedTheme = {};

// Das Theme das gerade angezeigt wird
let applyedTheme = {};

// Die ID mit der der User gerade "angemeldet" ist
let currentID: string;

// Die Persona mit der die ID abgespeichert wird. Standartmäßig die Standart Persona
let currentPersona: string;

//Ist nur true während die AI eine Anfrage bearbeitet
let isAiLoading = false;

//Das Theme welche zuletzt gelöscht wurde
let lastDeletedThemeData : DeletedThemeData | null = null;

interface DeletedThemeData {
  id: string;
  docName: string;
  themeandquestionnaire: doc;
}

//Die ID welche zuletzt gelöscht wurde
let lastDeletedIdData : DeletedIDData | null = null;

interface DeletedIDData {
  id: string;
  themes: {
    [key: string]: {
      doc : doc
    }
  }
  personaData : any;
}

// CORS und JSON Middleware verwenden
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Helper Funktion zum Überprüfen, ob ein String ein gültiges JSON ist
function isValidJSON(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString);
    return !!parsed && typeof parsed === 'object';
  } catch (e) {
    return false;
  }
}

// Helper Funktion zum Überprüfen, ob ein JSON leere Strings enthält
function hasEmptyStrings(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  if (Array.isArray(value)) {
    return value.some(hasEmptyStrings);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some(hasEmptyStrings);
  }
  return false;
}

// Funktion um die KI-Anfrage zu wiederholen, falls die Antwort nicht den Anforderungen entspricht
async function retryAskAI(AIprompt: string, preferences: any, temperature: number, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const aiSourceDoc = await getAiSource();
      const response = await askAI(AIprompt, aiSourceDoc.aiSource, temperature);
      console.log(`AI Response Attempt ${attempt}: ${response}`);

      let jsonMatch = null;
      if (response) {
        jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/i) || response.match(/```(?:\s*([\s\S]*?)\s*)```/i) || response.match(/({[\s\S]*})/i);
      }
      if (jsonMatch && jsonMatch[1]) {
        const extractedJSON = jsonMatch[1].trim();
        console.log(`Extracted JSON: ${extractedJSON}`);

        if (isValidJSON(extractedJSON)) {
          const jsonResponse = JSON.parse(extractedJSON);
          console.log(`Valid JSON found on attempt ${attempt}`);

          if (Object.keys(jsonResponse).length === 0) {
            console.warn(`Attempt ${attempt} failed: JSON is empty.`);
            AIprompt = generateAIPrompt(preferences, response);
            continue;
          }

          if (!hasEmptyStrings(jsonResponse)) {
            return jsonResponse;
          } else {
            console.warn(`Attempt ${attempt} failed: JSON contains empty strings.`);
            AIprompt = generateAIPrompt(preferences, response);
          }
        } else {
          console.warn(`Attempt ${attempt} failed: Extracted JSON is invalid.`);
          AIprompt = generateAIPrompt(preferences, response);
        }
      } else {
        console.warn(`Attempt ${attempt} failed: No JSON code block found.`);
        AIprompt = generateAIPrompt(preferences, response);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`Attempt ${attempt} failed: ${error.message}`);
        AIprompt = generateAIPrompt(preferences, error.message);
      } else {
        console.warn(`Attempt ${attempt} failed with an unknown error`);
        AIprompt = generateAIPrompt(preferences, 'Unknown error');
      }
    }
  }
  throw new Error('All attempts to get a valid AI response failed.');
}

// Endpunkt zum Generieren einer Theme-Konfiguration mit KI
app.post('/api/generate-with-ai', async (req, res) => {
  const { message, temperature } = req.body;
  const userPreferences = message;
  let AIprompt = generateAIPrompt(userPreferences);
  try {
    isAiLoading = true;
    latestGeneratedTheme = await retryAskAI(AIprompt, userPreferences, temperature);
    applyedTheme = JSON.parse(JSON.stringify(latestGeneratedTheme));
    res.json({ successFullConnectionToAi: true, theme: latestGeneratedTheme });
  } catch (error) {
    console.error('AI Request failed:', error);
    res.json({ successFullConnectionToAi: false, message: 'Connection to AI failed' });
  } finally {
    isAiLoading = false;
  }
});

// Speichert questionaire und json wenn es die ID noch nicht gibt. Wirft ein Error falls es sie gibt
app.post('/api/try-set-id', async (req, res) => {
  const data = req.body;
  await checkIfIDInUse(data.id);

  if (!data.id) {
    res.json({ success: false, idInUse: false, message: "Die ID darf nicht leer sein!" })
  } else if (await checkIfIDInUse(data.id)) {
    res.json({ success: false, idInUse: true, message: "Die ID ist bereits in verwendung" })
  } else {
    currentID = data.id
    await savePersonaUnderID(currentID, currentPersona)
    //console.log(`Die jetzige ID nach try-set-id ist: ${currentID}`)
    res.json({ success: true, idInUse: false, message: "Alles supi" })

  }
});

app.post('/api/force-set-ID', async (req, res) => {
  const data = req.body;
  currentID = data.id
  await savePersonaUnderID(currentID, currentPersona)
  res.json({ success: true })
  //console.log(`Die jetzige ID ist nach force-set-id ist: ${currentID}`)
});

app.post('/api/setPersona', async (req, res) => {
  const data = req.body;
  currentPersona = data.selectedPersona
  console.log(data.selectedPersona)
  res.json({ success: true })
});

app.get('/api/getPersona', async (req, res) => {
  if (!currentPersona) {
    res.json({ currentPersona: "" })
  } else {
    res.json({ currentPersona })
  }
});

// Speichert questionaire und json direkt ab
app.post('/api/save-questionnaire', async (req, res) => {
  const data = req.body;
  if (!data.saveUnder) {
    res.json({ success: false, message: "Please choose a name under which to save the theme!" })
  } else if (!currentID) {
    res.json({ success: false, message: "The ID cant be empty!" })
  } else if (Object.keys(latestGeneratedTheme).length === 0) {
    res.json({ success: false, message: "Please submit the questionnaire first!" })
  } else if (await checkIfDocIsExisting(currentID, data.saveUnder)) {
    res.json({ success: false, message: "Name for the theme with this ID already in use!" })
  } else {
    await saveDoc(currentID, data.saveUnder, latestGeneratedTheme, data.message)
    res.json({ success: true, message: "Theme saved successfully!" })
  }
});

// Braucht man um zb die Aktuelle ID zu bekommen nachdem Server neugestartet ist
app.get('/getID', async (req, res) => {
  if (!currentID) {
    res.json({ id: "" })
  } else {
    res.json({ id: currentID })
  }
});

app.get('/getDocs', async (req, res) => {
  const docs = await getAllDocs();
  res.json(docs);
});

app.get('/getLastTheme', async (req, res) => {
  res.json({ theme: applyedTheme })
});

//Is das ein sicherheitsrisiko wenn man einfach den body einer anfrage nimmt und settet?
app.post('/setAppliedTheme', async (req, res) => {
  const data = req.body
  applyedTheme = data.theme
  res.json({ success: true })
})

app.post('/getDoc', async (req, res) => {
  const data = req.body
  const doc = await getDoc(data.category, data.docName)
  res.json({ theme: doc })
})

app.post('/deleteDatabaseEntries', async (req, res) => {
  try {
    await deleteEverything();
    res.status(200).json({ message: 'All entries deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entries', error });
  }
});

app.post('/deleteDoc', async (req, res) => {
  const data = req.body
  const themeandquestionnaire = await getDoc(data.category, data.docName);
  if (themeandquestionnaire){
    lastDeletedThemeData = { id : data.category, docName : data.docName, themeandquestionnaire : { json: themeandquestionnaire.json, questionnaire: themeandquestionnaire.questionnaire}}
    await deleteDoc(data.category, data.docName)
    res.json({ success: true })
  } else {
    res.status(400).json({ success: false, ok: false, message: 'No document to delete' });
  }
});

app.put('/undoDeleteDoc', async (req, res) => {
  if(lastDeletedThemeData) {
    saveDoc(lastDeletedThemeData.id.replace('O4S-ai-', ''), lastDeletedThemeData.docName, lastDeletedThemeData.themeandquestionnaire.json, lastDeletedThemeData.themeandquestionnaire.questionnaire)
    res.status(200).json({ success: true, ok: true });
    lastDeletedThemeData = null;
  } else {
    res.status(400).json({ success: false, ok: false, message: 'No document to undo delete' });
  }
});

app.post('/deleteID', async (req, res) => {
  console.log("delteID wurde aufgerufen")
  const data = req.body
  const themes = await getAllDocsForSpecificId(data.category)
  console.log("Die zwischengespeicherten Themes sind: ", themes)
  const personaData : personaData | null = await getPersonaForID(data.category)
  console.log("Die zwischengespeicherten Persona ist: ", personaData)
  if (data.category){
    lastDeletedIdData = { id: data.category, themes : themes, personaData }
    await deleteID(data.category)
    res.status(200).json({ success: true, ok: true });
  } else {
    res.status(400).json({ success: false, ok: false, message: 'No ID to delete' });
  }
});

export interface personaDoc extends doc {
  doc: {
    personaName: string;
  };
}

app.put('/undoDeleteID', async (req, res) => {
  console.log("UndoDelteID wurde aufgerufen")
  if(lastDeletedIdData) {
    for (const key in lastDeletedIdData.themes) {
      const keyAsString = key;
      console.log("Key für Theme ist: ", keyAsString)
      console.log("lastDeletedIdData.themes[key].json ist: ", lastDeletedIdData.themes[key])
      if (keyAsString === "personaData"){
      const ichKannNichtMehrIchWillSchlafen : personaDoc = lastDeletedIdData.themes[key] as unknown as personaDoc;
      await savePersonaUnderID(lastDeletedIdData.id.replace('O4S-ai-', ''), ichKannNichtMehrIchWillSchlafen.doc.personaName)
      } else {
      await saveDoc(lastDeletedIdData.id.replace('O4S-ai-', ''), keyAsString, lastDeletedIdData.themes[key].doc.json, lastDeletedIdData.themes[key].doc.questionnaire);
      }
    } 
    res.status(200).json({ success: true, ok: true });
    lastDeletedIdData = null
  } else {
    res.status(400).json({ success: false, ok: false, message: 'No document to undo delete' });
  }
});

app.post('/setAiSource', async (req, res) => {
  const data = req.body
  await setAiSource(data.aiSource)
  res.json({ success: true })
});

app.get('/getAiSource', async (req, res) => {
  const aiSource = await getAiSource();
  res.json(aiSource)
});

app.get('/getIsAiLoading', async (req, res) => {
  res.json({isAiLoading : isAiLoading})
});

app.listen(PORT, () => {
  setAiSource("server");
  console.log(`AI Backend Server running on port ${PORT}`);
});

export default generateAIPrompt;
