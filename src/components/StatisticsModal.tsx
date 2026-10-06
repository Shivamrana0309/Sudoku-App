import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StatisticsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const DIFFICULTIES = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];

export default function StatisticsModal({ isVisible, onClose }: StatisticsModalProps) {
  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  
  const [selectedDifficulty, setSelectedDifficulty] = useState('Beginner');

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(panY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(panY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  return (
    <Animated.View 
      pointerEvents="auto"
      style={[
        styles.absoluteOverlay,
        { opacity: overlayOpacity }
      ]}
    >
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />

      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY: panY }] }]}
      >
        <View {...panResponder.panHandlers} style={styles.headerDraggable}>
          <View style={styles.dragHandle} />
          <Text style={styles.sheetTitle}>Statistics</Text>
        </View>

        {/* Difficulty Tabs - using react-native-gesture-handler ScrollView */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
          style={styles.tabsContainer}
          nestedScrollEnabled={true}
        >
          {DIFFICULTIES.map(diff => (
            <TouchableOpacity
              key={diff}
              style={[styles.tabBtn, selectedDifficulty === diff && styles.tabBtnActive]}
              onPress={() => setSelectedDifficulty(diff)}
            >
              <Text style={[styles.tabText, selectedDifficulty === diff && styles.tabTextActive]}>
                {diff}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Content */}
        <View style={styles.statsContent}>
          
          <View style={styles.statCard}>
            <View style={styles.statLeft}>
              <MaterialCommunityIcons name="grid" size={24} color="#0061E0" />
              <Text style={styles.statLabel}>Games Won</Text>
            </View>
            <Text style={styles.statValue}>1</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statLeft}>
              <Ionicons name="thumbs-up-outline" size={24} color="#0061E0" />
              <Text style={styles.statLabel}>Perfect Wins</Text>
            </View>
            <Text style={styles.statValue}>0</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statLeft}>
              <Ionicons name="flag-outline" size={24} color="#0061E0" />
              <Text style={styles.statLabel}>Best Win Streak</Text>
            </View>
            <Text style={styles.statValue}>1</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statLeft}>
              <Ionicons name="time-outline" size={24} color="#0061E0" />
              <Text style={styles.statLabel}>Best Time</Text>
            </View>
            <Text style={styles.statValue}>03:06</Text>
            
            {/* Top 30% Badge */}
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeTextTop}>TOP</Text>
                <Text style={styles.badgeTextBottom}>30%</Text>
              </View>
              <View style={styles.badgeTail} />
            </View>
          </View>

        </View>

        {/* Share Button */}
        <View style={styles.shareContainer}>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={18} color="#718096" />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  absoluteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  bottomSheet: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 30,
  },
  headerDraggable: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
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
  tabsContainer: {
    flexGrow: 0,
    marginBottom: 20,
  },
  tabsScroll: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  tabBtnActive: {
    backgroundColor: '#E6F7FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A0AEC0',
  },
  tabTextActive: {
    color: '#0061E0',
  },
  statsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  statLeft: {
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: 20,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#9F7AEA',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
  },
  badgeTextTop: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  badgeTextBottom: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 6,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#9F7AEA',
  },
  shareContainer: {
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  }
});
