import React, { useState, useEffect } from 'react';
import { IconButton, IIconProps } from '@fluentui/react';

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  let synthesis: SpeechSynthesis | undefined;

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthesis = window.speechSynthesis;
      setSpeechSynthesisSupported(true);
      console.log('SpeechSynthesis is supported in this browser.');
    } else {
      console.log('SpeechSynthesis is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    console.log(synthesis)
    if (speechSynthesisSupported && synthesis && !speaking) {

      synthesis.cancel();
      speakText(text);
    }
  }, [text, speechSynthesisSupported, synthesis, speaking]);

  const speakText = (textToSpeak: string) => {
    if (!speechSynthesisSupported || speaking || textToSpeak.trim() === '') {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    setSpeaking(true);

    utterance.onend = () => {
      setSpeaking(false);
    };

    if (synthesis) {
      synthesis.speak(utterance);
    }
  };

  const handleSpeak = () => {
    speakText(text);
  };

  const handleStop = () => {
    if (speechSynthesisSupported && speaking && synthesis) {
      synthesis.cancel();
      setSpeaking(false);
    }
  };

  const playIcon: IIconProps = { iconName: 'Play' };
  const stopIcon: IIconProps = { iconName: 'Stop' };

  return (
    <div>
      <IconButton
        iconProps={speaking ? stopIcon : playIcon}
        onClick={speaking ? handleStop : handleSpeak}
        disabled={!speechSynthesisSupported}
        ariaLabel={speaking ? 'Stop' : 'Speak'}
      />
    </div>
  );
};

export default TextToSpeech;
