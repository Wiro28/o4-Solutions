import React from 'react';
import Box from '@mui/material/Box';
import OptionWithTooltip from './OptionWithTooltip';

interface OptionsProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  question: { id: number; text: string; options?: string[], tooltips?: string[] };
  response: { question: string; answer: string };
}

const OptionsQuestion: React.FC<OptionsProps> = ({ handleInputChange, question, response }) => {
  return (
    <Box 
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', bgcolor: 'background.paper', p: 2 }}
    >
      {question.options?.map((option, index) => (
        <OptionWithTooltip
          key={index}
          option={option}
          description={question.tooltips ? question.tooltips[index] : 'No explanation available'}
          isChecked={response.answer === option}
          handleChange={(e) => handleInputChange(e, question.id)}
        />
      ))}
    </Box>
  );
};

export default OptionsQuestion;
