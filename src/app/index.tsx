import React from 'react';
import { useRouter } from 'expo-router';
import WelcomeScreen from '../WelcomeScreen';

export default function Index() {
  const router = useRouter();

  const handleAccept = () => {
    // Navigate to the experience level screen
    router.push('/experience-level');
  };

  return <WelcomeScreen onAccept={handleAccept} />;
}
