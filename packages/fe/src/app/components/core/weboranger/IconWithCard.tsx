import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

interface IconWithCardProps {
  cardContent: string;
  showOnTop: boolean;
}

const IconWithCard: React.FC<IconWithCardProps> = ({ cardContent, showOnTop }) => {
  const [isCardVisible, setCardVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const verticalPosition = showOnTop ? '-140px' : '20px';

  const showCard = () => {
    setCardVisible(true);
  };

  const hideCard = () => {
    setCardVisible(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setCardVisible(false);
    };

    if (isCardVisible) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isCardVisible]);

  return (
    <Box sx={{ position: 'relative', bottom:'9px', left:'4px'}}>
      <Typography
        ref={iconRef}
        sx={{
          cursor: 'pointer',
          fontSize: '1.5em',
          verticalAlign: 'middle'
        }}
        onMouseEnter={showCard}
        onMouseLeave={hideCard}
      >
        ℹ️
      </Typography>
      {isCardVisible && (
        <Box
          ref={cardRef}
          sx={{
            position: 'absolute',
            top: verticalPosition,
            left: '0',
            backgroundColor: '#fff',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            padding: '10px 10px 10px 10px',
            zIndex: 1000,
            width: '200px'
          }}
          onMouseEnter={showCard}
          onMouseLeave={hideCard}
        >

          <Typography>{cardContent}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default IconWithCard;
