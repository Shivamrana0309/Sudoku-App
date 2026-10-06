import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type LevelOption = {
  id: string;
  title: string;
  emoji: string;
  isLocked: boolean;
  unlockRequirement?: string;
};

export const LEVELS: LevelOption[] = [
  { id: 'beginner', title: 'Beginner', emoji: '☺️', isLocked: false },
  { id: 'easy', title: 'Easy', emoji: '🙂', isLocked: false },
  { id: 'medium', title: 'Medium', emoji: '😐', isLocked: false },
  { id: 'hard', title: 'Hard', emoji: '😲', isLocked: true, unlockRequirement: 'Complete 3 medium games to unlock' },
  { id: 'expert', title: 'Expert', emoji: '😰', isLocked: true, unlockRequirement: 'Complete 5 hard games to unlock' },
  { id: 'extreme', title: 'Extreme', emoji: '😱', isLocked: true, unlockRequirement: 'Complete 10 expert games to unlock' },
];

export const EXTRA_LEVELS: LevelOption[] = [
  { id: 'fast', title: 'Fast', emoji: '🥳', isLocked: false },
  { id: '16x16', title: '16x16', emoji: '🤯', isLocked: true },
];

interface NewGameModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function NewGameModal({ isVisible, onClose }: NewGameModalProps) {
  const router = useRouter();
  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

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
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
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

  return (
    <Animated.View 
      pointerEvents={isVisible ? 'auto' : 'none'}
      style={[
        styles.absoluteOverlay,
        { opacity: overlayOpacity }
      ]}
    >
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />

      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle} />
        <Text style={styles.sheetTitle}>New Game</Text>

        <View style={styles.sheetContent}>
          {LEVELS.map(level => (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelBtn, level.isLocked && styles.levelBtnLocked]}
              activeOpacity={0.7}
              disabled={level.isLocked}
              onPress={() => {
                onClose();
                // We use replace to prevent pushing multiple game screens on top of each other
                router.replace({ pathname: '/game', params: { level: level.id, title: level.title } });
              }}
            >
              <View style={styles.levelLeft}>
                <Text style={styles.levelEmoji}>{level.emoji}</Text>
                <View>
                  <Text style={[styles.levelTitle, level.isLocked && styles.levelTitleLocked]}>{level.title}</Text>
                  {level.unlockRequirement && (
                    <Text style={styles.levelSubtitle}>{level.unlockRequirement}</Text>
                  )}
                </View>
              </View>
              {level.isLocked && <Ionicons name="lock-closed" size={20} color="#A0AEC0" />}
            </TouchableOpacity>
          ))}

          <View style={styles.extraLevelsRow}>
            {EXTRA_LEVELS.map(level => (
              <TouchableOpacity
                key={level.id}
                style={[styles.levelBtnHalf, level.isLocked && styles.levelBtnLocked]}
                activeOpacity={0.7}
                disabled={level.isLocked}
                onPress={() => {
                  onClose();
                  router.replace({ pathname: '/game', params: { level: level.id, title: level.title } });
                }}
              >
                <View style={styles.levelLeft}>
                  <Text style={styles.levelEmoji}>{level.emoji}</Text>
                  <Text style={[styles.levelTitle, level.isLocked && styles.levelTitleLocked]}>{level.title}</Text>
                </View>
                {level.isLocked && <Ionicons name="lock-closed" size={20} color="#A0AEC0" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  absoluteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40, 
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
