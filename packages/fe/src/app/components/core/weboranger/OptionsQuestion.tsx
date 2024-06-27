import React from 'react';
import OptionWithTooltip from './OptionWithTooltip';

interface OptionsProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  question: { id: number; text: string; options?: string[], tooltips?: string[] };
  response: { question: string; answer: string };
}

const OptionsQuestion: React.FC<OptionsProps> = ({ handleInputChange, question, response }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      {question.options?.map((option, index) => (
        <OptionWithTooltip
          key={index}
          option={option}
          description={question.tooltips ? question.tooltips[index] : 'No explanaition available'}
          isChecked={response.answer === option}
          handleChange={(e) => handleInputChange(e, question.id)}
        />
      ))}
    </div>
  );
};

export default OptionsQuestion;
