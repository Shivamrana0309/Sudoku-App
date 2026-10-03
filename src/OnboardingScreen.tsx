import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ onAccept }: { onAccept?: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>welcom to Sudoku</Text>

        {/* Fading Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg' }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Gradient Overlay for fading effect */}
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.8)', '#ffffff']}
            locations={[0.4, 0.8, 1]}
            style={styles.gradient}
          />
        </View>

        {/* Terms Text */}
        <Text style={styles.termsText}>
          plesae reade{' '}
          <Text style={styles.linkText}>
            terms of service
          </Text>{' '}
          and{' '}
          <Text style={styles.linkText}>
            privacy policy
          </Text>{' '}
          , if you agree please click accept to use the app{' '}
        </Text>
      </View>

      {/* Accept Button pinned to bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onAccept}>
          <Text style={styles.buttonText}>ACCEPT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 40,
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    position: 'relative',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12, // slightly rounded edges for the image
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  linkText: {
    color: '#007AFF', // Standard iOS blue
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Adding subtle shadow for a modern look
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // for Android
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1, // Adds a slight premium feel to the bold uppercase text
  },
});

export default OnboardingScreen;
