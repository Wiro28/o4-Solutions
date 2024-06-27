import React, { useContext, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, Typography, Backdrop, Snackbar, List, ListItem, ListItemText, ListItemSecondaryAction, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, useTheme, Divider, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ThemeContext } from '@frontend/app/providers/ToggleColorMode';
import IconWithCard from './IconWithCard';
import QuestionnairePopup from "./QuestionnairePopup";
import {Personas} from "@app/shared/extensions/personas"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Adminpanel = () => {
  const { applyTheme } = useContext(ThemeContext);
  const theme = useTheme();

  const [questionnaires, setQuestionnaires] = useState<docFormat>({});
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openIDSnackbar, setOpenIDSnackbar] = useState(false);
  const [openDeleteAllSnackbar, setOpenDeleteAllSnackbar] = useState(false);
  const [openUndoDeleteIDSnackbar,  setOpenUndoDeleteIDSnackbar] = useState(false);
  const [openUndoDeleteThemeSnackbar, setOpenUndoDeleteThemeSnackbar] = useState(false);
  const [openWarningSnackbar, setWarningSnackbar] = useState(false);
  const [aiSourceID, setAiSourceID] = useState('');
  const [jsonToShow, setJsonToShow] = useState({});
  const [showJsonToShowPopup, setShowJsonToShowPopup] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('');
  //Die aktuelle ID die in Server gespeichert ist und unter der die Daten in der Datenbank gespeichert werden
  const [currentId, setCurrentId] = useState<string>(() => {
    return localStorage.getItem('currentId') || '';
  });

  //Es werden alle Relevanten Daten vom Server abgefragt um Sie darzustellen
  useEffect(() => {
    fetchQuestionnaires();
    fetchCurrentTheme();
    fetchAiSource();
    fetchCurrentId();
    fetchCurrentPersona();
  }, []);

  const fetchCurrentPersona = async () => {    try {
    const response = await fetch('http://localhost:3000/api/getPersona');
    if (!response.ok) {
      throw new Error('Fehler bei: /getPersona');
    }
    const data = await response.json();
    setSelectedPersona(data.currentPersona);
    } catch (error) {
      console.error('Error fetching aiSource:', error);
    }
  }

  const fetchAiSource = async () => {    try {
    const response = await fetch('http://localhost:3000/getAiSource');
    if (!response.ok) {
      throw new Error('Fehler bei: /getAiSource');
    }
    const data = await response.json();
    setAiSourceID(data.aiSource);
    } catch (error) {
      console.error('Error fetching aiSource:', error);
    }
  }

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

  const fetchQuestionnaires = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/getDocs');
      if (!response.ok) {
        throw new Error('Fehler bei: /getDocs');
      }
      const data = await response.json();
      setQuestionnaires(data);
    } catch (error) {
      console.error('Error fetching docFormat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentTheme = async () => {
    try {
      const response = await fetch('http://localhost:3000/getLastTheme');
      if (!response.ok) {
        throw new Error('Fehler bei: /getLastTheme');
      }
      const data = await response.json();
      console.log(data.theme)
      applyTheme(data.theme)
    } catch (error) {
        console.error('Error fetching current ID:', error);
    }
  };

  //Handler Methode für den APPLY button
  const handleApplyTheme = async (category: string, docName: string) => {
    try {
      const response = await fetch('http://localhost:3000/getDoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category, docName: docName }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /getDoc');
      } else {
        const responseJson = await response.json();

        try {
          if (!(await fetch('http://localhost:3000/setAppliedTheme', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme : responseJson.theme.json }),
          })).ok) {
            throw new Error('Fehler bei: /setAppliedTheme');
          }
        
        } catch (error) {
          console.error('Error in /setAppliedTheme', error);
        }

        applyTheme(responseJson.theme.json);
      }
    } catch (error) {
      console.error('Error in /getDoc', error);
    }
    setSnackbarMessage(`Applying theme for ${category.replace('O4S-ai-', '')} - ${docName}`);
    setOpenSuccessSnackbar(true);
  };

  //Hadler Methode für den DELETE ALL DATA button. Löscht alle Einträge in der Datenbank
  const handleDeleteEverything = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/deleteDatabaseEntries', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Fehler bei: /deleteDatabaseEntries');
      }
      await response.json();
      setQuestionnaires({});
      setOpenDeleteAllSnackbar(false);
      setSnackbarMessage("All entries deleted successfully");
      setOpenSuccessSnackbar(true);
    } catch (error) {
      console.error('Error in /deleteDatabaseEntries', error);
    } finally {
      setLoading(false);
    }
  };

  //Handler Methode  für den DELETE Button. Löscht das Theme
  const handleDeleteTheme = async (category: string, docName: string) => {
    try {
      const response = await fetch('http://localhost:3000/deleteDoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category, docName: docName }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /deleteDoc');
      }
      setQuestionnaires(prevState => {
        const newState = { ...prevState };
        delete newState[category][docName];
        return newState;
      });
      setSnackbarMessage(`Deleted Theme: ${category.replace('O4S-ai-', '')} - ${docName}`);
      setOpenUndoDeleteThemeSnackbar(true)
    } catch (error) {
      console.error('Error in /deleteDoc', error);
    }
  };

  //Handlermethode für den DELETE ID button. Löscht die ID und all ihre einträge.
  const handleDeleteID = async (category: string) => {
    try {
      const response = await fetch('http://localhost:3000/deleteID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /deleteID');
      }
      setQuestionnaires(prevState => {
        const newState = { ...prevState };
        delete newState[category];
        return newState;
      });
      setSnackbarMessage(`Deleted ID: ${category.replace('O4S-ai-', '')}`);
      setOpenUndoDeleteIDSnackbar(true)
    } catch (error) {
      console.error('Error in /deleteID', error);
    }
  };

  //Handlermethode für den APPLY DEFAULT THEME button. Applyt den Default Theme.
  const setDefaultTheme = async () => {
    try {
      const response = await fetch('http://localhost:3000/setAppliedTheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: {} }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /setAppliedTheme auf default');
      }
    } catch (error) {
      console.error('Error in /setAppliedTheme auf default', error);
    }
    applyTheme({});
  };

  //Ein interface das bekannt ist wie ein Dokument welches aus der Datenbank kommt aussieht.
  interface docFormat {
    [category: string]: {
      [docName: string]: {
        doc: {
          questionnaire: {
            [questionId: string]: {
              question: string;
              answer: string;
            };
          }, personaName: string
        }
      }
    };
  }

  interface QuestionCounts {
    [question: string]: {
      [answer: string]: number;
    };
  }

  const aggregateResponses = (questionnaires: docFormat): QuestionCounts => {
    const questionCounts: QuestionCounts = {};

    Object.keys(questionnaires).forEach(category => {
      // Filtere die Schlüssel, um 'personaData' auszuschließen
      const docKeys = Object.keys(questionnaires[category]).filter(key => key !== 'personaData');
      
      docKeys.forEach(doc => {
        const questionnaire = questionnaires[category][doc].doc.questionnaire;
        Object.keys(questionnaire).forEach(questionId => {
          const question = questionnaire[questionId].question;
          const answer = questionnaire[questionId].answer;
    
          if (!questionCounts[question]) {
            questionCounts[question] = {};
          }
          if (!questionCounts[question][answer]) {
            questionCounts[question][answer] = 0;
          }
          questionCounts[question][answer]++;
        });
      });
    });

    return questionCounts;
  };

  //Handlermethode für SET ID. Hier wird erst versucht die ID zu setzen und geprüft ob diese ID bereits existiert.
  const handleTrySetId = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/try-set-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /api/try-set-id');
      }
      const responseData = await response.json();

      if (!responseData.success && !responseData.idInUse) {
        setSnackbarMessage(responseData.message)
        setWarningSnackbar(true)
      } else if (!responseData.success && responseData.idInUse) {
        setOpenIDSnackbar(true);
      } else {
        const response = await fetch('http://localhost:3000/api/force-set-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          throw new Error('Fehler bei: /api/force-set-id');
        }
        setCurrentId(id);
        setSnackbarMessage("ID was set successfully")
        setOpenSuccessSnackbar(true)
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

    //Handlermethode für SET ID in der Snackbarmessage, falls die ID scon gesetzt ist der Nutzer diese ID aber trotzdem setzen will.
  const handleForceSetId = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/force-set-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /api/force-set-id');
      }
      //auf die response muss hier gewartet werden da sonst setCurrentId durch asynchronität nicht korrekt aufgerufen wird
      const responseData = await response.json();
      console.log('Force set ID response:', responseData);
      setCurrentId(id);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setOpenIDSnackbar(false);
    }
  };

  //Handlermethode für das Select Person Dropdown. Setzt die Persona für die ID.
  const handleSetPersona = async (personaName : string) => {
    try {
      const response = await fetch('http://localhost:3000/api/setPersona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedPersona : personaName }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /api/setPersona');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Handlerethode für das AI-Hosting dropdown. Entscheided ob die AI Lokal oder Serverseitig angesprochen wird.
  const switchAiSource = async (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;
    setAiSourceID(selectedValue);
    try {
      const response = await fetch('http://localhost:3000/setAiSource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiSource : selectedValue }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /setAiSource');
      }
      

    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Eventhandler Methode für den UNDO button wenn man ein Theme löscht. Stellt das Theme wieder her.
  const handleUndoDeleteTheme = async () => {
    try {
      const response = await fetch('http://localhost:3000/undoDeleteDoc', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /api/undoDeleteDoc');
      }

      fetchQuestionnaires();
    } catch (error) {
      console.error('Error:', error);
    }
  };

    //Eventhandler Methode für den UNDO button wenn man eine ID löscht. Stellt die ID mit allen themes wieder her.
  const handleUndoDeleteID = async () => {
    try {
      const response = await fetch('http://localhost:3000/undoDeleteID', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /api/undoDeleteID');
      }

      fetchQuestionnaires();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Eventhandler Methode für den SHOW button. Beim drüberhover zeigt es alle Fragen und Antworten an die benutzt wurden um den Theme zu generieren.
  const handleShowQuestionnaire = async (category: string, docName: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const response = await fetch('http://localhost:3000/getDoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, docName }),
      });
      if (!response.ok) {
        throw new Error('Fehler bei: /getDoc');
      } else {
        const data = await response.json();
        setJsonToShow(data.theme.questionnaire);
        setShowJsonToShowPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClosePopup = () => {
    setShowJsonToShowPopup(false);
    setJsonToShow({}); // Zurücksetzen des JSON im State
  };

  const questionCounts = aggregateResponses(questionnaires);

  const isHexColor = (str: string) => /^#[0-9A-F]{6}$/i.test(str);

  //Die komponente für das Personadropdown
  const PersonaDropdown = () => {
  
    const handleChange = (event: SelectChangeEvent<string>) => {
      setSelectedPersona(event.target.value);
      handleSetPersona(event.target.value);
    };
  
    return (
      <FormControl fullWidth style={{marginTop:'20px'}}>
          <InputLabel id="persona-select-label">Select Persona</InputLabel>
        <Select
          labelId="persona-select-label"
          id="persona-select"
          value={selectedPersona}
          onChange={handleChange}
          label="Select Persona"
        >
          {Personas.map((persona) => (
            <MenuItem key={persona.userId} value={persona.roles[0]}>
              {persona.roles[0]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Container maxWidth={false} style={{ padding: 0 }}>
      <Box display="flex" justifyContent="center" alignItems="center" style={{ width: '100%', height: '100vh' }}>
        <Box display="flex" flexDirection="column" gap={3} mt={4} style={{ width: '75%', height: '100vh' }}>
          <Box display="flex" flexDirection="column" gap={3} mt={4}>
            {/* Set ID and Hosting der KI section */}
            <Box display="flex" justifyContent="space-between" gap={3}>
              <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h4" gutterBottom style={{ marginBottom: '5px'}}>Set Tester-ID</Typography>
                    <IconWithCard cardContent="This is the ID under which the Questionnaire in the 'Questionnaire AI' Tab will be saved." showOnTop={false} />
                  </Box>
                  <TextField
                    label="ID"
                    variant="outlined"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    fullWidth
                  />
                <Typography style={{fontSize: '14px' }}>Current ID: {currentId}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTrySetId}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.palette.primary.dark}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.palette.primary.main}
                  onMouseDown={(e) => e.currentTarget.style.backgroundColor = theme.palette.primary.light}
                  onMouseUp={(e) => e.currentTarget.style.backgroundColor = theme.palette.primary.dark}
                >
                  Set ID
                </Button>
                <PersonaDropdown />
              </Box>
      
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h4" gutterBottom style={{ marginBottom: '5px'}}>AI Hosting</Typography>
                  <IconWithCard cardContent="Decide if you want to send a request to your local-hosted AI or to the AI on our server. Note: The AI you host locally should be run by ollama." showOnTop={false} />
                </Box>
                <Select style={{ width:'200px'}}
                  value={aiSourceID}
                  onChange={switchAiSource}
                  variant="outlined"
                >
                  <MenuItem value="local">Local-Hosting</MenuItem>
                  <MenuItem value="server">Server-Hosting</MenuItem>
                </Select>
              </Box>
            </Box>
            <Divider sx={{ borderBottomWidth: 3, borderColor: 'black', my: 1, widht:'2000px' }} />
      
            {/* Rest of the content */}
            <Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="h4" gutterBottom>Questionnaire Statistics</Typography>
                  <IconWithCard cardContent="The questions with the amount of times a answer has been picked." showOnTop={false} />
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderBottom: '5px solid rgba(224, 224, 224, 1)' }}>Question</TableCell>
                        <TableCell style={{ borderBottom: '5px solid rgba(224, 224, 224, 1)' }}>Answer</TableCell>
                        <TableCell style={{ borderBottom: '5px solid rgba(224, 224, 224, 1)' }}>Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(questionCounts).map(question => {
                        const answers = Object.entries(questionCounts[question]).sort((a, b) => b[1] - a[1]);
                        return (
                          <React.Fragment key={question}>
                            <TableRow style={{ borderTop: '3px solid rgba(224, 224, 224, 1)' }}>
                              <TableCell rowSpan={answers.length} style={{ fontWeight: 'bold' }}>
                                {question}
                              </TableCell>
                              <TableCell>
                                {answers[0][0]}
                                {isHexColor(answers[0][0]) && (
                                  <div style={{ width: '20px', height: '20px', backgroundColor: answers[0][0], display: 'inline-block', marginLeft: '10px',
                                  boxShadow: theme.shadows[1], borderRadius: theme.shape.borderRadius,
                                  position: 'relative', top: '4px' }}></div>
                                )}
                              </TableCell>
                              <TableCell>{answers[0][1]}</TableCell>
                            </TableRow>
                            {answers.slice(1).map(([answer, count]) => (
                              <TableRow style={{ borderBottom: '3px solid rgba(224, 224, 224, 1)' }} key={answer}>
                                <TableCell>
                                  {answer}
                                  {isHexColor(answer) && (
                                    <div style={{ width: '20px', height: '20px', backgroundColor: answer, display: 'inline-block', marginLeft: '10px',
                                    boxShadow: theme.shadows[1], borderRadius: theme.shape.borderRadius,
                                    position: 'relative', top: '4px' }}></div>
                                  )}
                                </TableCell>
                                <TableCell>{count}</TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Divider sx={{ borderBottomWidth: 3, borderColor: 'black', my: 3 }} />
              <Box display="flex" alignItems="center">
                <Typography variant="h4" gutterBottom>Saved Themes</Typography>
                <IconWithCard cardContent="The themes which had been saved under their ID. The themes you see here are saved locally." showOnTop={false} />
              </Box>
              {loading ? (
                <Backdrop open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : (
                <>
                  <List>
                    {Object.entries(questionnaires).map(([category, docs]) => {

                      return (
                      <Box key={category} mb={2}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h6">
                            {category.replace('O4S-ai-', '')}
                          </Typography>
                          <Typography variant="body2" style={{ color: 'gray', marginLeft:'12px'}}>
                             {docs.personaData.doc.personaName}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { handleDeleteID(category) }}
                            style={{ marginLeft: '10px', marginBottom: '6px' }}
                          >
                            Delete ID
                          </Button>
                        </Box>
                        <List>
                          {Object.keys(docs).length === 0 ? (
                            <ListItem divider>
                              <ListItemText primary="Keine Themes gespeichert" />
                            </ListItem>
                          ) : (
                            Object.entries(docs)
                              .filter(([docName]) => docName !== 'personaData') // Filter out 'personaData'
                              .map(([docName]) => (
                                <ListItem key={docName} divider style={{ marginTop: '20px' }}>
                                  <ListItemText primary={docName} />
                                  <ListItemSecondaryAction>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onMouseOver={(event) => handleShowQuestionnaire(category, docName, event)}
                                      onMouseOut={handleClosePopup}
                                      style={{ marginRight: '10px' }}
                                    >
                                      Show
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleApplyTheme(category, docName)}
                                      style={{ marginRight: '10px' }}
                                    >
                                      Apply
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleDeleteTheme(category, docName)}
                                    >
                                      Delete
                                    </Button>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              )))}
                        </List>
                        {showJsonToShowPopup && (
                                    <QuestionnairePopup
                                      onClose={handleClosePopup}
                                      questions={jsonToShow}
                                    />
                                  )}
                      </Box>
                      )
                            })}
                  </List>
                  <Box display="flex" justifyContent="flex-start">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => { setSnackbarMessage("Are you sure you want to delete ALL entries in the database?"); setOpenDeleteAllSnackbar(true) }}
                      style={{ marginRight: '16px' }}
                    >
                      Delete all Data
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={setDefaultTheme}
                    >
                      Apply Default Theme
                    </Button>
                  </Box>
                </>
              )}
            </Box>

          </Box>
          
          {/* Snackbars */}
          <Snackbar
            open={openSuccessSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSuccessSnackbar(false)}
          >
            <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success">
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={openWarningSnackbar} autoHideDuration={6000} onClose={() => setWarningSnackbar(false)}>
            <Alert onClose={() => setWarningSnackbar(false)} severity="warning">
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={openIDSnackbar} autoHideDuration={6000} onClose={() => setOpenIDSnackbar(false)}>
            <Alert onClose={() => setOpenIDSnackbar(false)} severity="warning">
              ID already in use. Do you want to force set this ID?
              <Button
                variant="contained"
                color="primary"
                onClick={handleForceSetId}
                style={{ marginLeft: '16px' }}
              >
                Force Set ID
              </Button>
            </Alert>
          </Snackbar>
          <Snackbar open={openDeleteAllSnackbar} autoHideDuration={6000} onClose={() => setOpenDeleteAllSnackbar(false)}>
            <Alert onClose={() => setOpenDeleteAllSnackbar(false)} severity="warning">
              {snackbarMessage}
              <Button
                variant="contained"
                color="primary"
                onClick={handleDeleteEverything}
                style={{ marginLeft: '16px' }}
              >
                DELETE
              </Button>
            </Alert>
          </Snackbar>
          <Snackbar open={openUndoDeleteThemeSnackbar} autoHideDuration={6000} onClose={() => setOpenUndoDeleteThemeSnackbar(false)}>
            <Alert onClose={() => setOpenUndoDeleteThemeSnackbar(false)} severity="warning">
              {snackbarMessage}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {handleUndoDeleteTheme(); setOpenUndoDeleteThemeSnackbar(false)}}
                style={{ marginLeft: '16px' }}
              >
                UNDO
              </Button>
            </Alert>
          </Snackbar>
          <Snackbar open={openUndoDeleteIDSnackbar} autoHideDuration={6000} onClose={() => setOpenUndoDeleteIDSnackbar(false)}>
            <Alert onClose={() => setOpenUndoDeleteIDSnackbar(false)} severity="warning">
              {snackbarMessage}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {handleUndoDeleteID(); setOpenUndoDeleteIDSnackbar(false)}}
                style={{ marginLeft: '16px' }}
              >
                UNDO
              </Button>
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Container>
  );
  
                }

export default Adminpanel;
