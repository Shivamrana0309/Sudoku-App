import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Option = {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const options: Option[] = [
  { id: '1', title: "I've never played Sudoku.", icon: 'bar-chart-outline' },
  { id: '2', title: "I've played Sudoku.", icon: 'bar-chart-outline' },
  { id: '3', title: "I often play Sudoku.", icon: 'bar-chart-outline' },
  { id: '4', title: "I'm not sure", subtitle: "Quick Level Check", icon: 'bar-chart-outline' },
];

export default function ExperienceLevelScreen({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Which of these statements{'\n'}best describes you?</Text>

        {options.map((option) => (
          <TouchableOpacity key={option.id} style={styles.card} activeOpacity={0.7} onPress={() => onSelect?.(option.id)}>
            <Ionicons name={option.icon} size={24} color="#A0AEC0" style={styles.leftIcon} />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              {option.subtitle && (
                <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FA',
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
    justifyContent: 'center', // Centers content vertically
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2D3748',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 16,
  },
  cardSubtitle: {
    color: '#A0AEC0',
    fontSize: 13,
    marginTop: 4,
  },
});
