import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;
const CELL_SIZE = BOARD_SIZE / 9;

export default function SudokuTutorialScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [targetLayout, setTargetLayout] = useState<{ x: number; y: number } | null>(null);
  const [targetBtnLayout, setTargetBtnLayout] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<View>(null);
  const targetCellRef = useRef<any>(null);
  const targetBtnRef = useRef<any>(null);

  const handAnim = useRef(new Animated.ValueXY({ x: -100, y: -100 })).current; // Off-screen initially
  const handOpacity = useRef(new Animated.Value(0)).current;
  const tickAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  const measurePositions = useCallback(() => {
    if (targetCellRef.current && targetBtnRef.current && containerRef.current) {
      targetCellRef.current.measureLayout(
        containerRef.current,
        (left: number, top: number, w: number, h: number) => {
          setTargetLayout({ x: left + w / 2, y: top + h / 2 });
        },
        () => console.warn('Measure target cell failed')
      );
      targetBtnRef.current.measureLayout(
        containerRef.current,
        (left: number, top: number, w: number, h: number) => {
          setTargetBtnLayout({ x: left + w / 2, y: top + h / 2 });
        },
        () => console.warn('Measure button failed')
      );
    }
  }, [phase]);

  useEffect(() => {
    const timer = setTimeout(measurePositions, 500);
    return () => clearTimeout(timer);
  }, [measurePositions, phase]);

  useEffect(() => {
    // Transition to Phase 2
    if (phase === 1 && step === 3) {
      const timer = setTimeout(() => {
        setTargetLayout(null);
        setTargetBtnLayout(null);
        tickAnim.setValue(0);
        handOpacity.setValue(0);
        setPhase(2);
        setStep(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
    // Transition to Phase 3
    if (phase === 2 && step === 3) {
      const timer = setTimeout(() => {
        setTargetLayout(null);
        setTargetBtnLayout(null);
        tickAnim.setValue(0);
        handOpacity.setValue(0);
        setPhase(3);
        setStep(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
    // Finish Tutorial
    if (phase === 3 && step === 3) {
      const timer = setTimeout(() => {
        router.push({
          pathname: "/game",
          params: { title: "Easy", fromTutorial: "true" }
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, step, tickAnim, handOpacity, router]);

  useEffect(() => {
    if (step === 1 && targetLayout) {
      handAnim.setValue({
        x: targetLayout.x - 20,
        y: targetLayout.y + 10,
      });
      Animated.timing(handOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: -15,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [step, targetLayout, handAnim, handOpacity, floatingAnim]);

  useEffect(() => {
    if (step === 2 && targetBtnLayout) {
      floatingAnim.stopAnimation();
      floatingAnim.setValue(0);

      Animated.timing(handAnim, {
        toValue: {
          x: targetBtnLayout.x - 20,
          y: targetBtnLayout.y + 5,
        },
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatingAnim, {
              toValue: -15,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(floatingAnim, {
              toValue: 0,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [step, targetBtnLayout, handAnim, floatingAnim]);

  useEffect(() => {
    if (step === 3) {
      Animated.timing(handOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.spring(tickAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [step, handOpacity, tickAnim]);

  const handleCellPress = (r: number, c: number) => {
    if (step === 1) {
      if (phase === 1 && r === 4 && c === 4) setStep(2);
      if (phase === 2 && r === 4 && c === 7) setStep(2);
      if (phase === 3 && r === 6 && c === 7) setStep(2);
    }
  };

  const handleNumPress = (num: number) => {
    if (step === 2) {
      if (phase === 1 && num === 5) setStep(3);
      if (phase === 2 && num === 9) setStep(3);
      if (phase === 3 && num === 8) setStep(3);
    }
  };

  const renderGrid = () => {
    const rows = [];
    for (let r = 0; r < 9; r++) {
      const cols = [];
      for (let c = 0; c < 9; c++) {
        const isCenterBlock = r >= 3 && r <= 5 && c >= 3 && c <= 5;
        let value: number | null = null;
        
        // Base numbers for Phase 1
        if (r === 3 && c === 3) value = 7;
        if (r === 3 && c === 4) value = 6;
        if (r === 3 && c === 5) value = 1;
        if (r === 4 && c === 3) value = 8;
        if (r === 4 && c === 5) value = 3;
        if (r === 5 && c === 3) value = 9;
        if (r === 5 && c === 4) value = 2;
        if (r === 5 && c === 5) value = 4;

        // Carry over from Phase 1
        if (phase >= 2 && r === 4 && c === 4) value = 5;

        // Phase 2 extra row numbers
        if (phase >= 2) {
          if (r === 4 && c === 0) value = 4;
          if (r === 4 && c === 1) value = 2;
          if (r === 4 && c === 2) value = 6;
          if (r === 4 && c === 6) value = 7;
          if (r === 4 && c === 8) value = 1;
        }

        // Carry over from Phase 2
        if (phase >= 3 && r === 4 && c === 7) value = 9;

        // Phase 3 extra column numbers
        if (phase >= 3) {
          if (r === 0 && c === 7) value = 1;
          if (r === 1 && c === 7) value = 4;
          if (r === 2 && c === 7) value = 6;
          if (r === 3 && c === 7) value = 2;
          if (r === 5 && c === 7) value = 5;
          if (r === 7 && c === 7) value = 3;
          if (r === 8 && c === 7) value = 7;
        }

        const isTarget = 
          phase === 1 ? (r === 4 && c === 4) : 
          phase === 2 ? (r === 4 && c === 7) : 
                        (r === 6 && c === 7);

        let displayValue = value;
        if (isTarget && step === 3) {
          if (phase === 1) displayValue = 5;
          else if (phase === 2) displayValue = 9;
          else if (phase === 3) displayValue = 8;
        }

        let isWhiteCell = isCenterBlock;
        if (phase >= 2 && r === 4) isWhiteCell = true;
        if (phase >= 3 && c === 7) isWhiteCell = true;

        let backgroundColor = isWhiteCell ? '#FFFFFF' : '#E2E8F0';
        let borderColor = isWhiteCell ? '#2D3748' : '#CBD5E1';

        // Outer borders for blocks
        let borderTopWidth = r % 3 === 0 ? 2 : 0.5;
        let borderLeftWidth = c % 3 === 0 ? 2 : 0.5;
        let borderRightWidth = c === 8 ? 2 : 0.5;
        let borderBottomWidth = r === 8 ? 2 : 0.5;

        // Bold borders for the center 3x3 matrix from all sides
        if (isCenterBlock) {
          borderColor = '#2D3748';
          if (r === 3) borderTopWidth = 2.5;
          if (r === 5) borderBottomWidth = 2.5;
          if (c === 3) borderLeftWidth = 2.5;
          if (c === 5) borderRightWidth = 2.5;
        }

        // Bold borders for the row in phase 2
        if (phase === 2 && r === 4) {
          borderColor = '#2D3748';
          borderTopWidth = 2.5;
          borderBottomWidth = 2.5;
          if (c === 0) borderLeftWidth = 2.5;
          if (c === 8) borderRightWidth = 2.5;
        }

        // Bold borders for the column in phase 3
        if (phase === 3 && c === 7) {
          borderColor = '#2D3748';
          borderLeftWidth = 2.5;
          borderRightWidth = 2.5;
          if (r === 0) borderTopWidth = 2.5;
          if (r === 8) borderBottomWidth = 2.5;
        }

        if (isTarget && step >= 2) {
          backgroundColor = '#EBF8FF';
          borderColor = '#3182CE';
          borderTopWidth = 2.5;
          borderLeftWidth = 2.5;
          borderRightWidth = 2.5;
          borderBottomWidth = 2.5;
        }

        cols.push(
          <TouchableOpacity
            key={`${r}-${c}`}
            ref={isTarget ? (targetCellRef as any) : null}
            activeOpacity={isTarget && step === 1 ? 0.7 : 1}
            onPress={() => handleCellPress(r, c)}
            style={[
              styles.cell,
              {
                borderTopWidth,
                borderLeftWidth,
                borderBottomWidth,
                borderRightWidth,
                backgroundColor,
                borderColor,
                zIndex: isTarget && step >= 2 ? 10 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.cellText,
                { color: isTarget && step === 3 ? '#0061E0' : '#2D3748' },
              ]}
            >
              {displayValue}
            </Text>
            {/* Tick Mark Animation always aligned at r=1, c=4 */}
            {r === 1 && c === 4 && (
              <Animated.View
                style={[
                  styles.tickContainer,
                  {
                    opacity: tickAnim,
                    transform: [{ scale: tickAnim }],
                  },
                ]}
              >
                <Text style={styles.tickText}>✔</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        );
      }
      rows.push(
        <View key={r} style={styles.row}>
          {cols}
        </View>
      );
    }
    return rows;
  };

  const getHelperText = () => {
    if (step === 1) return 'Click the cell';
    if (step === 2) return 'Select the missing number';
    if (phase === 1) return 'Block complete!';
    if (phase === 2) return 'Row complete!';
    return 'Column complete!';
  };

  const targetNum = 
    phase === 1 ? 5 : 
    phase === 2 ? 9 : 
                  8;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} ref={containerRef}>
        {/* Board Area */}
        <View style={styles.boardContainer}>
          {/* Header */}
          <Text style={styles.headerTitle}>
            {phase === 1 && 'The rules are simple'}
            {phase === 2 && 'Rows work the same way'}
            {phase === 3 && 'Columns are no different'}
          </Text>

          <View style={styles.grid}>{renderGrid()}</View>

          {/* Helper Text */}
          <View style={styles.helperTextContainer}>
            <Text style={styles.helperText}>{getHelperText()}</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {/* Rules Footer Text */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {phase === 1 && (
                <>
                  Each <Text style={styles.boldText}>3x3 Block</Text> must contain all digits
                  from 1–9. <Text style={styles.boldText}>Finish the Block in the grid.</Text>
                </>
              )}
              {phase === 2 && (
                <>
                  Each <Text style={styles.boldText}>Row</Text> must contain the digits 1–9.{' '}
                  <Text style={styles.boldText}>Finish the Row.</Text>
                </>
              )}
              {phase === 3 && (
                <>
                  Each <Text style={styles.boldText}>Column</Text> must contain the digits 1–9.{' '}
                  <Text style={styles.boldText}>Finish the Column.</Text>
                </>
              )}
            </Text>
          </View>

          {/* Bottom Number Pad */}
          <View style={styles.numberPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchableOpacity
                key={num}
                ref={num === targetNum ? (targetBtnRef as any) : null}
                style={[
                  styles.numberButton,
                  step === 2 && num === targetNum && styles.numberButtonHighlight,
                ]}
                activeOpacity={0.7}
                onPress={() => handleNumPress(num)}
              >
                <Text style={styles.numberButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Floating Hand Icon */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.handContainer,
            {
              opacity: handOpacity,
              transform: [
                { translateX: handAnim.x },
                { translateY: Animated.add(handAnim.y, floatingAnim) },
              ],
            },
          ]}
        >
          <Text style={styles.handIcon}>👆</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  boardContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#CBD5E1',
    borderWidth: 2,
    borderColor: '#2D3748',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: width > 380 ? 22 : 18,
    fontWeight: '600',
  },
  helperTextContainer: {
    marginTop: 24,
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  helperText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  tickContainer: {
    position: 'absolute',
    zIndex: 20,
    backgroundColor: '#48BB78', // Green color
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2, // Perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tickText: {
    fontSize: CELL_SIZE * 0.5,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomSection: {
    marginTop: 20,
  },
  footerContainer: {
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#4A5568',
  },
  numberPad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  numberButton: {
    width: width * 0.095,
    height: width * 0.13,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  numberButtonHighlight: {
    borderColor: '#3182CE',
    borderWidth: 2,
    backgroundColor: '#EBF8FF',
  },
  numberButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0061E0',
  },
  handContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  handIcon: {
    fontSize: 40,
    lineHeight: 45,
    width: 40,
    textAlign: 'center',
  },
});
