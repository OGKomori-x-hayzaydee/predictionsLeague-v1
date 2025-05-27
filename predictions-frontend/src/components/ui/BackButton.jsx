import React from 'react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { NavigationButton } from './buttons';

const BackButton = ({ onClick, text }) => {
  return (
    <NavigationButton
      onClick={onClick}
      variant="back"
      className="flex items-center text-white/70 hover:text-white"
    >
      <ArrowLeftIcon className="mr-1.5 w-4 h-4" />
      {text}
    </NavigationButton>
  );
};

export default BackButton;