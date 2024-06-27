import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../providers/ToggleColorMode';
import ColorPicker from '@frontend/app/components/core/weboranger/ColorPicker';
import SliderComponent from '@frontend/app/components/core/weboranger/SliderComponent';
import OptionsQuestion from '@frontend/app/components/core/weboranger/OptionsQuestion';
import TextQuestion from '@frontend/app/components/core/weboranger/TextQuestion';
import { explanaitions } from './QuestionExplanaitions';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {useUser} from "@frontend/hooks/use-user"

interface Question {
  id: number;
  text: string;
  options?: string[];
  colorPicker?: boolean;
  slider?: boolean;
  tooltips?: string[];
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Questionnaire: React.FC = () => {
  const { applyTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const [temperature, setTemperature] = useState<number>(0.9);

  //Die angezeigten Fragen in Questionnaire
  const questions: Question[] = [
    {
      id: 1,
      text: 'What theme should the application have?',
      options: ['Serious', 'Energetic', 'Cheerful', 'Nature-oriented', 'Technical', 'Minimalistic', 'Premium'],
      tooltips: [explanaitions.whatTheme.serious, explanaitions.whatTheme.energetic, explanaitions.whatTheme.cheerful, explanaitions.whatTheme.natureOriented, explanaitions.whatTheme.technical, explanaitions.whatTheme.minimalistic, explanaitions.whatTheme.premium],
    },
    { id: 2, text: 'Is there a specific color the application should have?', colorPicker: true},
    { id: 3, text: 'How strong should the color weighting be?', slider: true },
    {
      id: 4,
      text: 'What theme should the font have?',
      options: ['Playful', 'Simple', 'Mechanical', 'Rounded', 'Elegant', 'Dramatic', 'Factual'],
      tooltips: [explanaitions.whatFont.playful, explanaitions.whatFont.simple, explanaitions.whatFont.mechanical, explanaitions.whatFont.rounded, explanaitions.whatFont.elegant, explanaitions.whatFont.dramatic, explanaitions.whatFont.factual],
    },
  ];  

  const defaultResponses = questions.reduce((acc, question) => {
    acc[question.id] = {
      question: question.text,
      answer: question.options
        ? question.options[0]
        : question.colorPicker
          ? null
          : '',
    };
    return acc;
  }, {} as Record<any, any>);

  const savedResponses = JSON.parse(localStorage.getItem('responses') || JSON.stringify(defaultResponses));

  const mergedResponses = Object.keys(savedResponses).reduce((acc, key) => {
    const id = Number(key);
    if (questions.find((question) => question.id === id)) {
      acc[id] = savedResponses[key];
    }
    return acc;
  }, {} as Record<any, any>);

  const [responses, setResponses] = useState<Record<any, any>>(mergedResponses);
  const [loading, setLoading] = useState(false);
  const [saveUnder, setSaveUnder] = useState<string>('');
  const [openWarningSnackbar, setWarningSnackbar] = useState(false);
  const [warningSnackbarMessage, setWarningSnackbarMessage] = useState<string>('');
  const [openSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [successSnackbarMessage, setSuccessSnackbarMessage] = useState<string>(''); 
  const [saveButtonGrey, setSaveButtonGrey] = useState<boolean>(); 
  //Die aktuelle ID die in Server gespeichert ist und unter der die Daten in der Datenbank gespeichert werden
  const [currentId, setCurrentId] = useState<string>(() => {
    return localStorage.getItem('currentId') || '';
  });
  const [personaData] = useUser();

  //Es werden alle Relevanten Daten vom Server abgefragt um Sie darzustellen
  useEffect(() => {
    fetchCurrentTheme();
    fetchCurrentId();
    fetchIsAiLoading();
    fetchLastGeneratedTheme();
  }, []);

  const fetchLastGeneratedTheme = async () => {
    try {
      const response = await fetch('http://localhost:3000/getLastGeneratedTheme');
      if (!response.ok) {
        throw new Error('Fehler bei: /getLastGeneratedTheme');
      }
      const data = await response.json();
      console.log("Data :", data)
      if (Object.keys(data.theme).length === 0) {
        console.log("Button grey = true");
        setSaveButtonGrey(true);
      }
       else {
        console.log("Button grey = false")
        setSaveButtonGrey(false)
      }
    } catch (error) {
      console.error('Error fetching current theme:', error);
    }
  };

  //Überprüft ob die AI noch am Laden ist nachdem man die Komponente neu läd um dann die Ladeanzeigt weiter anzeugen zu lassen
  const fetchIsAiLoading = async () => {
    try {
      const response = await fetch('http://localhost:3000/getIsAiLoading');
      if (!response.ok) {
        throw new Error('Fehler bei: /getIsAiLoading');
      }
      const data = await response.json();
      if(data.isAiLoading){
        setLoading(true);
        let waitingForAiResponse = true;
        while(waitingForAiResponse){
          //Die 2000 steht für die Anzahl an ms für die Gewartet wird bis eine neue Anfrage an den Server geschickt wird ob die KI nun fertiggeneriert hat.
          await new Promise(resolve => setTimeout(resolve, 2000));
          const response = await fetch('http://localhost:3000/getIsAiLoading');
          if (!response.ok) {
            throw new Error('Fehler bei: /getIsAiLoading, waitingForAiResponse');
          }
          const data = await response.json();
          if (!data.isAiLoading) {
            waitingForAiResponse = false;
          }
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching AI status:', error);
    }
  };

  const fetchCurrentTheme = async () => {
    try {
      const response = await fetch('http://localhost:3000/getTheme');
      if (!response.ok) {
        throw new Error('Fehler bei: /getTheme');
      }
      const data = await response.json();
      applyTheme(data.theme);
    } catch (error) {
      console.error('Error fetching current theme:', error);
    }
  };

  const fetchCurrentId = async () => {
    try {
      const response = await fetch('http://localhost:3000/getID');
      if (!response.ok) {
        throw new Error('Fehler bei: /getID');
      }
      const data = await response.json();
      setCurrentId(data.id);
    } catch (error) {
      console.error('Error fetching current ID:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
  }, [responses]);


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    id: number,
  ) => {
    const value = e.target.value;
    setResponses((prevResponses) => {
      const updatedResponses = {
        ...prevResponses,
        [id]: {
          question: questions.find((question) => question.id === id)?.text!,
          answer: value,
        },
      };
      return updatedResponses;
    });
  };

  const handleColorChange = (color: string, id: number) => {
    setResponses((prevResponses) => {
      const updatedResponses = {
        ...prevResponses,
        [id]: {
          question: questions.find((question) => question.id === id)?.text!,
          answer: color,
        },
      };
      return updatedResponses;
    });
  };

  const handleSliderChange = (value: number, id: number) => {
    setResponses((prevResponses) => {
      const updatedResponses = {
        ...prevResponses,
        [id]: {
          question: questions.find((question) => question.id === id)?.text!,
          answer: value,
        },
      };
      return updatedResponses;
    });
  };

  //Handlermethode für den SAVE button. Saved das Questionnaire und Theme in der Datenbank wenn alle Bedingungen erfüllt sind.
  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const personaName = personaData.displayName;
    console.log("PersonaName in Questionnaire: ", personaName)
    try {
      const response = await fetch('http://localhost:3000/api/save-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: responses, saveUnder, personaName }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /api/save-questionnaire');
      }
      const responseData = await response.json();

      if (!responseData.success) {
        setWarningSnackbarMessage(responseData.message);
        setWarningSnackbar(true);
      } else {
        setSuccessSnackbarMessage(responseData.message);
        setSuccessSnackbar(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  //Handlermethode für den SUBMIT button. Schickt den Fragebogen mit Antworten an die KI.
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: responses, temperature }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /api/generate-with-ai');
      }
      const responseJson = await response.json();
      if (responseJson.successFullConnectionToAi) {
        applyTheme(responseJson.theme);
        setSaveButtonGrey(false)
      } else {
        setWarningSnackbarMessage(responseJson.message);
        setWarningSnackbar(true);
      }
      
    } catch (error) {
      console.error('Error in /api/generate-with-ai', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Themes will be Saved under ID:
          </Typography>
          <Typography variant="h6" gutterBottom fontWeight="bold" style={{ marginLeft: '10px' }}>
            {currentId}
          </Typography>
        </Box>
        {questions.map((question) => (
          <Box
            key={question.id}
            p={4}
            mb={2}
            bgcolor={theme.palette.background.default}
            borderRadius={2}
            boxShadow={1}
          >
            <Typography variant="h5" fontWeight="light" gutterBottom>
              {question.text}
            </Typography>
            {question.options ? (
              <OptionsQuestion handleInputChange={handleInputChange} question={question} response={responses[question.id]} />
            ) : question.colorPicker ? (
              <ColorPicker
                initialColor={responses[question.id]?.answer ?? ''}
                onChange={(color) => handleColorChange(color, question.id)}
              />
            ) : question.slider ? (
              <SliderComponent
                value={responses[question.id]?.answer ?? 50}
                onChange={(value) => handleSliderChange(value, question.id)}
                min={0}
                max={100}
                step={1}
                percentage
              />
            ) : (
              <TextQuestion handleInputChange={handleInputChange} question={question} />
            )}
          </Box>
        ))}
        <Box
          p={4}
          mb={2}
          bgcolor={theme.palette.background.default}
          borderRadius={2}
          boxShadow={1}
        >
          <Typography variant="h5" fontWeight="light" gutterBottom>
          Determine the creativity of the AI
          </Typography>
          <SliderComponent
            value={temperature}
            onChange={(value) => setTemperature(value)}
            min={0.1}
            max={0.9}
            step={0.1}
            percentage
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.dark)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.main)}
          onMouseDown={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.light)}
          onMouseUp={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.dark)}
        >
          Submit
        </Button>

        <Divider sx={{ borderBottomWidth: 3, borderColor: 'black', my: 1 }} />

        <TextField
          label="Save Under"
          variant="outlined"
          value={saveUnder}
          onChange={(e) => setSaveUnder(e.target.value)}
          fullWidth
        />
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Typography style={{ fontSize: '14px', marginBottom: -2 }}>The last generated Theme will be saved</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.dark)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.main)}
            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.light)}
            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = theme.palette.primary.dark)}
            fullWidth
            style={{ marginTop: 0 }}
            disabled={saveButtonGrey}
          >
            Save
          </Button>
        </Box>

      </Box>

      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={openWarningSnackbar} autoHideDuration={6000} onClose={() => setWarningSnackbar(false)}>
        <Alert onClose={() => setWarningSnackbar(false)} severity="warning">
          {warningSnackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={() => setSuccessSnackbar(false)}>
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success">
          {successSnackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Questionnaire;
