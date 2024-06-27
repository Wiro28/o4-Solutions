import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface OptionWithTooltipProps {
  option: string;
  description: string;
  isChecked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionWithTooltip: React.FC<OptionWithTooltipProps> = ({ option, description, isChecked, handleChange }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const showTooltip = () => {
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '8px' }}>
      <input
        type="radio"
        value={option}
        checked={isChecked}
        onChange={handleChange}
        style={{
          cursor: 'pointer',
          marginRight: '10px'
        }}
      />
      <label
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          fontSize: '1.2rem',
          fontWeight: 'lighter',
          position: 'relative'
        }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {option}
        {isTooltipVisible && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: '0',
              backgroundColor: '#fff',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              padding: '10px',
              zIndex: 1000,
              width: '400px',
              marginTop: '5px'
            }}
          >
            <Typography dangerouslySetInnerHTML={{ __html: description }} />
          </Box>
        )}
      </label>
    </Box>
  );
};

export default OptionWithTooltip;
