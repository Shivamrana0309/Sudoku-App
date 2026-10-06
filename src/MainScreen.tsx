import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, PanResponder, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

import NewGameModal from './components/NewGameModal';

export default function MainScreen() {
  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Header - Coin and Streak */}
          <View style={styles.header}>
            <View style={styles.statPill}>
              <Text style={styles.coinIcon}>🟡</Text>
              <Text style={styles.statText}>0</Text>
              <View style={styles.notificationDot} />
            </View>
            <View style={styles.statPill}>
              <Text style={styles.fireIcon}>🔥</Text>
              <Text style={styles.statText}>0</Text>
            </View>
          </View>

          {/* Daily Challenge Card */}
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={['#E6F7FF', '#BAE3FF']}
              style={styles.dailyCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View>
                <Text style={styles.cardSubtitle}>Daily Challenge</Text>
                <Text style={styles.cardTitle}>Oct 4</Text>
              </View>

              <View style={styles.trophyContainer}>
                <Text style={{ fontSize: 65 }}>🏆</Text>
              </View>

              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Middle Section */}
          <View style={styles.middleSection}>
            <Text style={styles.mainTitle}>Classic Sudoku</Text>
            <TouchableOpacity
              style={styles.howToPlayBtn}
              onPress={() => router.push('/tutorial')}
            >
              <Ionicons name="help-circle-outline" size={18} color="#0061E0" />
              <Text style={styles.howToPlayText}>How to Play</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          {/* New Game Button */}
          <View style={styles.newGameContainer}>
            <TouchableOpacity style={styles.newGameBtn} onPress={openModal}>
              <Text style={styles.newGameBtnText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#0061E0" />
            <Text style={[styles.navText, { color: '#0061E0' }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="flash-outline" size={24} color="#A0AEC0" />
            <Text style={styles.navText}>Battle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="compass-outline" size={24} color="#A0AEC0" />
            <Text style={styles.navText}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/profile')}>
            <Ionicons name="person-outline" size={24} color="#A0AEC0" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <NewGameModal 
        isVisible={isModalVisible} 
        onClose={closeModal} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 45, // Pushed down further from the top
    gap: 12,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  coinIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  fireIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53E3E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cardContainer: {
    marginTop: 30,
    flexDirection: 'row',
  },
  dailyCard: {
    width: 160,
    height: 220,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 2,
  },
  trophyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  playButtonText: {
    color: '#0061E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  middleSection: {
    marginTop: 100,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 20,
  },
  howToPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    gap: 8,
  },
  howToPlayText: {
    color: '#0061E0',
    fontSize: 15,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  newGameContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  newGameBtn: {
    backgroundColor: '#0061E0',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0061E0',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  newGameBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#A0AEC0',
    fontWeight: '500',
  },

  /* Modal Styles */
  absoluteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 9999,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40, // Increased just enough to cover safe area without inflating height
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  sheetContent: {
    flexDirection: 'column',
    gap: 10,
  },
  levelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  levelBtnLocked: {
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  levelEmoji: {
    fontSize: 24,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  levelTitleLocked: {
    color: '#A0AEC0',
  },
  levelSubtitle: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  extraLevelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  levelBtnHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
});
