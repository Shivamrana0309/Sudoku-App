import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';

const WelcomeScreen = ({ onAccept }: { onAccept?: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome to{'\n'}Classic Sudoku</Text>
      </View>

      <Image
        source={require('../assets/sudoku-hero.png')}
        style={styles.heroImage}
      />

      <View>
        <Text style={styles.termsText}>
          Please read our{' '}
          <Text style={styles.linkText} onPress={() => {}}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.linkText} onPress={() => {}}>
            Privacy Policy
          </Text>
          . If you agree, please click "Accept" to use the App.
        </Text>

        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FA',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2D3748',
    marginTop: 160,
  },
  heroImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
  },
  termsText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    color: '#4A5568',
    paddingHorizontal: 30,
    marginBottom: 20, // some spacing before the button
  },
  linkText: {
    color: '#0061E0',
  },
  button: {
    width: '85%',
    alignSelf: 'center',
    paddingVertical: 16,
    backgroundColor: '#0061E0',
    borderRadius: 12,
    marginBottom: 120,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
