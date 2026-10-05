import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VictoryScreen() {
  const router = useRouter();
  const { difficulty = 'Beginner', time = '00:00', score = '0', mistakes = '0' } = useLocalSearchParams();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Right Star Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.topRightStarBtn}>
            <Ionicons name="star-outline" size={20} color="#4A5568" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Stars Graphic */}
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={60} color="#F6E05E" style={{ transform: [{ rotate: '-15deg' }], marginTop: 20 }} />
            <Ionicons name="star" size={80} color="#ECC94B" style={{ zIndex: 10, marginHorizontal: -15 }} />
            <Ionicons name="star" size={60} color="#E2E8F0" style={{ transform: [{ rotate: '15deg' }], marginTop: 20 }} />
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Speed Demon!</Text>
            <Text style={styles.subtitle}>Every number in its place — brilliant!</Text>

            <View style={styles.statsList}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Difficulty</Text>
                <Text style={styles.statValue}>{difficulty}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Time</Text>
                <Text style={styles.statValue}>{time}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Score</Text>
                <Text style={styles.statValue}>{score}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Weekly Best Time</Text>
                <Text style={styles.statValue}>{time}</Text>
              </View>
            </View>

            {/* Bottom pills */}
            <View style={styles.pillsContainer}>
              <View style={styles.pill}>
                <MaterialCommunityIcons name="target" size={16} color="#4A5568" />
                <Text style={styles.pillText}>100%</Text>
              </View>
              <View style={styles.pillDivider} />
              <View style={styles.pill}>
                <Ionicons name="close" size={16} color="#4A5568" />
                <Text style={styles.pillText}>{mistakes}</Text>
              </View>
              <View style={styles.pillDivider} />
              <View style={styles.pill}>
                <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color="#0061E0" />
                <Text style={styles.pillText}>0</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.statsBtn}>
            <Text style={styles.statsBtnText}>Statistics</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.newGameBtn} onPress={() => router.push('/main')}>
            <Text style={styles.newGameBtnText}>New Game</Text>
          </TouchableOpacity>

          <View style={styles.bottomLinks}>
            <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/main')}>
              <Ionicons name="home-outline" size={20} color="#0061E0" />
              <Text style={styles.linkText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkBtn}>
              <Ionicons name="share-outline" size={20} color="#0061E0" />
              <Text style={styles.linkText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#D6E4F0',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  topRightStarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 10,
    marginBottom: -20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 32,
  },
  statsList: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  pillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  pillDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  statsBtn: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  statsBtnText: {
    color: '#0061E0',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  newGameBtn: {
    backgroundColor: '#0061E0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  newGameBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkText: {
    color: '#0061E0',
    fontSize: 16,
    fontWeight: '500',
  }
});
