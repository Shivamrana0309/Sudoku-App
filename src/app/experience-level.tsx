import { useRouter } from 'expo-router';
import ExperienceLevelScreen from '../ExperienceLevelScreen';

export default function ExperienceLevelRoute() {
  const router = useRouter();

  const handleSelect = (id: string) => {
    // Navigate to the main tabs when a level is selected
    router.replace('/(tabs)');
  };

  return <ExperienceLevelScreen onSelect={handleSelect} />;
}
