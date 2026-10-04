import { useRouter } from 'expo-router';
import ExperienceLevelScreen from '../ExperienceLevelScreen';

export default function ExperienceLevelRoute() {
  const router = useRouter();

  const handleSelect = (id: string) => {
    if (id === '1') {
      router.push('/tutorial' as any);
    } else if (id === '2' || id === '3') {
      router.push('/main' as any);
    } else {
      // Navigate to the main tabs when a level is selected
      router.replace('/(tabs)');
    }
  };

  return <ExperienceLevelScreen onSelect={handleSelect} />;
}
