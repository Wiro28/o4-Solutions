const jsonCode = `
{
  "palette": {
    "mode": "light",
    "primary": {
      "main": "#3f51b5",
      "light": "#757de8",
      "dark": "#002984",
      "contrastText": "#ffffff"
    },
    "secondary": {
      "main": "#f50057",
      "light": "#ff5983",
      "dark": "#bb002f",
      "contrastText": "#ffffff"
    },
    "background": {
      "default": "#ffffff",
      "paper": "#f5f5f5"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#212121"
    },
    "action": {
      "active": "#212121",
      "hover": "#e0e0e0",
      "hoverOpacity": 0.08,
      "selected": "#e0e0e0",
      "selectedOpacity": 0.08,
      "disabled": "#bdbdbd",
      "disabledBackground": "#e0e0e0",
      "disabledOpacity": 0.38,
      "focus": "#e0e0e0",
      "focusOpacity": 0.12,
      "activatedOpacity": 0.12
    }
  },
  "spacing": 10,
  "typography": {
    "htmlFontSize": 16,
    "fontFamily": "Arial, Helvetica, sans-serif",
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700
  },
  "shape": {
    "borderRadius": 4
  },
  "components": { 
    "MuiBox": {
      "styleOverrides": {
        "root": {
          "display": "flex",
          "flexDirection": "column",
          "alignItems": "center",
          "justifyContent": "center"
        }
      }
    },
    "MuiDataGrid": {
      "styleOverrides": {
        "root": {
          "display": "flex",
          "flexDirection": "column"
        },
        "toolbar": {
          "display": "flex",
          "justifyContent": "space-between"
        }
      }
    },
    "MuiGrid": {
      "styleOverrides": {
        "root": {
          "display": "flex"
        },
        "container": {
          "display": "flex",
          "justifyContent": "center",
          "alignItems": "center",
          "flexDirection": "column-reverse",
          "flexWrap": "wrap"
        },
        "item": {
          "display": "flex",
          "flexDirection": "row",
          "alignItems": "center",
          "justifyContent": "center"
        }
      }
    },
    "MuiGrid2": {
      "styleOverrides": {
        "root": {
          "flexDirection": "row-reverse",
          "justifyContent": "space-between",
          "alignItems": "flex-start"
        }
      }
    },
    "MuiContainer": {
      "styleOverrides": {
        "root": {
          "display": "flex",
          "flexDirection": "column",
          "maxWidth": "1200px"
        }
      }
    },
    "MuiPaper": {
      "styleOverrides": {
        "root": {
          "display": "flex",
          "flexDirection": "column",
          "boxShadow": "0 4px 8px rgba(0, 0, 0, 0.1)"
        }
      }
    },
    "MuiCard": {
      "styleOverrides": {
        "root": {
          "display": "flex",
          "flexDirection": "column",
          "boxShadow": "0 4px 8px rgba(0, 0, 0, 0.1)",
          "borderRadius": "8px"
        }
      }
    },
    "MuiCardActions": {
      "styleOverrides": {
        "root": {
          "display": "flex",
          "justifyContent": "flex-end"
        }
      }
    },
    "MuiCardContent": {
      "styleOverrides": {
        "root": {
          "display": "flex",
          "flexDirection": "column",
          "alignItems": "center"
        }
      }
    }
  }
}`;

interface Preference {
  question: string;
  answer: string;
}

interface Preferences {
  [key: string]: Preference;
}

const fontMapping: { [key: string]: string[] } = {
  playful: ['Pacifico', 'Grandstander', 'Caveat', 'Indie Flower', 'Happy Monkey', 'Twinkle Star'],
  simple: ['Open Sans', 'Lato', 'Montserrat', 'Raleway', 'Josefin Sans', 'Work Sans'],
  mechanical: ['Roboto Mono', 'Source Code Pro', 'Fira Code', 'Inconsolata', 'Space Mono', 'DM Mono', 'Courier Prime', 'Press Start 2P', 'Silkscreen'],
  rounded: ['Nunito', 'Dongle', 'Comic Neue', 'Comfortaa', 'M PLUS Rounded 1c', 'Dosis'],
  elegant: ['Didact Gothic', 'Questrial', 'Average Sans', 'Libre Franklin', 'Metropolis', 'Urbanist', 'Lexend Zetta'],
  dramatic: ['Bebas Neue', 'Righteous', 'Bungee', 'Anton', 'Staatliches', 'Monoton', 'Krona One', 'Fredoka Variable', 'Abril Fatface'],
  factual: ['Cormorant Garamond', 'Spectral', 'Quattrocento', 'Old Standard TT', 'Noto Serif JP', 'Bodoni Moda', 'Roboto', 'Inter', 'Ubuntu', 'Noto Sans', 'Manrope']
};

const themeMapping: { [key: string]: string } = {
  'Serious': 'darker colors, light background, black lettering, corners, no bright colors, only the colors red, blue, black and white may be used be used (with their gradations), it is factual and only the most the most important is displayed without decoration possible user description: neat and factual',
  'Energetic': 'bright colors, black only in the font, but the font can also be can also be colorful, modern design, corners are rounded, organic shapes rounded, organic shapes, color transitions, especially working with yellow, red and orange tones possible user description: powerful and colorful',
  'Cheerful': 'bold colors, playful font, no corners possible user description: cheerful and radiant design',
  'Nature-oriented': 'green and brown tones, background is in light colors, organic shapes, colors appear in different opacity possible user description: simple and organic',
  'Technical': 'rather work with blue gray and tones, everything angular no roundings, looks machine-made possible user description: highly organized and mechanical',
  'Minimalistic': 'colors don`t matter, focus on the essentials, no transitions, black text on a white background possible user description: simple and reduced',
  'Premium': 'minimalistic, it is factual and only the most important things are important things are changed, warm colors and black and white tones are used corners are rounded off possible user description: simple, but special'
};

function generateFontList(preferences: Preferences): string[] {
  console.log("User theme preference:", preferences[4].answer);
  if (preferences[4].answer && fontMapping[preferences[4].answer.toLowerCase()]) {
    return fontMapping[preferences[4].answer.toLowerCase()];
  }
  console.log("Theme not found, defaulting to Roboto.");
  return ['Roboto'];
}

function cleanJsonString(jsonString: string): string {
  // Kommentare entfernen
  const commentPattern = /\/\*[\s\S]*?\*\/|\/\/.*/g;
  return jsonString.replace(commentPattern, '');
}

function generateAIPrompt(preferences: Preferences, previousResponse: string | null = null): string {
  const fontList = generateFontList(preferences);
  const themeDescription = themeMapping[preferences[4].answer] || 'default';

  console.log('Available fonts:', fontList);
  console.log('User preferences:\n', preferences);

  const cleanJsonCode = cleanJsonString(jsonCode);

  return JSON.stringify({
    messages: [
      { role: 'system', content: 'You are an AI designed to generate MUI theme configurations based on a given template. Change the given template and generate a new MUI theme configuration.' },
      { role: 'user', content: `Interpret the user preferences into UI/UX guidelines and generate a MUI theme configuration based on those guidelines. User preferences: ${JSON.stringify(preferences, null, 2)}` },
      { role: 'user', content: `The selected color is the primary color. Choose a befitting secondary color that fits the primary color. The background color should be a light color that fits the primary and secondary colors. The text color should be dark`},
      { role: 'user', content: `The "Farbgewichtung" parameter means: a higher number means to use only the selected color and maybe a second color. A lower number means to use as many colors as you wish to combine. For a high color weight, use primarily the primary color and at most one other color. For a low color weight, use a wider range of colors and combine them as you wish) that fit into the color scheme for the background, primary, and secondary colors.` },
      { role: 'user', content: `Also, consider light and dark mode changes. The default is light mode, but the theme configuration JSON colors should reflect the change when switching to dark mode.` },
      { role: 'user', content: `Template for the MUI Theme Configuration JSON (Be sure to use this only as a reference, don't keep the default options given here): ${cleanJsonCode}` },
      { role: 'user', content: `The current theme chosen is "${preferences[4].answer}", which should be interpreted as "${themeDescription}". The chosen theme in the user preferences should be interpreted and UI/UX guidelines should be generated. Ensure distinct and visible changes between themes.` },
      { role: 'user', content: `The font theme means not a specific theme but rather a vibe which the theme should have. Choose a specific theme you see fit. But don't use a standard font, choose something that fits the chosen vibe and also is very distinct and not default. The available fonts for this theme are: ${fontList.join(', ')}` },
      { role: 'user', content: `Use fancy CSS to make it more appealing. Like color gradients and shadows.`},
      { role: 'user', content: `Everything should be filled out in a way that makes sense and with good UI/UX.` },
      { role: 'user', content: `Pay special attention to color contrast: ensure that if there is a light background, the text is dark, and if there is a dark background, the text is light.` },
      { role: 'user', content: `Be sure to *always* change the layout of the website (Through Flexdirection, display and similar stuff) as well. So that it drastically improves the UX. Don't change stuff like margin too much or content will be unreadable` },
      { role: 'user', content: `Change the layout/positioning and most importantly order of components noticeably. Like reverse it or change from column to row and stuff.` },
      { role: 'user', content: `Never leave the default options or empty strings or null and never leave any placeholders.` },
      { role: 'user', content: `Check if there are any invalid/illegal functions or things in the MUI Theme Config JSON.` },
      { role: 'user', content: `Ensure that there are no errors in the JSON code and that it is valid. Also there shouldn't be any comments, it should be pure JSON` },
      { role: 'user', content: `Ensure that your contrastText, default, and paper properties are strings, not arrays. For example, choose a single color for each mode` }
    ]
  });
}

export { generateAIPrompt };