import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { generateSudoku } from './utils/sudoku';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = SCREEN_WIDTH - 40; // 20 padding on each side

type CellData = {
  row: number;
  col: number;
  value: number;
  isInitial: boolean;
  isError: boolean;
};

export default function GameScreen() {
  const router = useRouter();
  const { level, title } = useLocalSearchParams();

  // State
  const [board, setBoard] = useState<CellData[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
  const [history, setHistory] = useState<{r: number, c: number, prevVal: number}[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  const cellAnims = React.useRef(
    Array.from({length: 9}, () => Array.from({length: 9}, () => new Animated.Value(0)))
  ).current;

  const [errorToast, setErrorToast] = useState<{title: string, subtitle: string, type: 'row' | 'col' | 'box' | 'wrong', num: number} | null>(null);
  const toastAnim = React.useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    // Determine difficulty
    let emptyCount = 30; // default Beginner
    if (level === '1') emptyCount = 20;
    else if (level === '2') emptyCount = 30;
    else if (level === '3') emptyCount = 40;
    else if (level === '4') emptyCount = 50;
    else if (level === '5') emptyCount = 55;
    else if (level === '6') emptyCount = 60;
    else if (level === '7') emptyCount = 60; // fallback

    const { puzzle, solution } = generateSudoku(emptyCount);
    
    const newBoard = puzzle.map((r, rowIndex) => 
      r.map((val, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        value: val,
        isInitial: val !== 0,
        isError: false,
      }))
    );
    setBoard(newBoard);
    setSolution(solution);
  }, [level]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCellPress = (r: number, c: number) => {
    setSelectedCell({r, c});
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const cell = board[r][c];

    // Don't modify initial cells
    if (cell.isInitial) return;
    
    // Save history
    setHistory([...history, { r, c, prevVal: cell.value }]);

    const newBoard = [...board];
    const isCorrect = solution[r][c] === num;
    
    newBoard[r][c] = {
      ...cell,
      value: num,
      isError: !isCorrect
    };
    
    if (!isCorrect) {
      setMistakes(m => m + 1);

      // Determine mistake reason
      let reason: 'row' | 'col' | 'box' | 'wrong' = 'wrong';
      let title = 'Incorrect number!';
      let subtitle = "This number doesn't belong here.";

      if (board[r].some(cell => cell.value === num && cell.col !== c)) {
        reason = 'row';
        title = 'Duplicate in row!';
        subtitle = 'Fill each row with 1-9, no repeats.';
      } else if (board.some(row => row[c].value === num && row[c].row !== r)) {
        reason = 'col';
        title = 'Duplicate in column!';
        subtitle = 'Fill each column with 1-9, no repeats.';
      } else {
        const boxStartRow = Math.floor(r / 3) * 3;
        const boxStartCol = Math.floor(c / 3) * 3;
        let foundBox = false;
        for (let i = boxStartRow; i < boxStartRow + 3; i++) {
          for (let j = boxStartCol; j < boxStartCol + 3; j++) {
            if (board[i][j].value === num && (i !== r || j !== c)) {
              foundBox = true;
              break;
            }
          }
        }
        if (foundBox) {
          reason = 'box';
          title = 'Duplicate in box!';
          subtitle = 'Fill each 3x3 box with 1-9, no repeats.';
        }
      }

      setErrorToast({ title, subtitle, type: reason, num });
      toastAnim.setValue(-150);
      Animated.sequence([
        Animated.timing(toastAnim, { toValue: 50, duration: 300, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(toastAnim, { toValue: -150, duration: 300, useNativeDriver: true })
      ]).start(() => setErrorToast(null));

    } else if (cell.value !== num) {
      setScore(s => s + 50); // Give some score for correct placement
    }
    
    setBoard(newBoard);

    if (isCorrect) {
      // Check for completions
      const isRowComplete = newBoard[r].every(c => c.value !== 0 && !c.isError);
      const isColComplete = newBoard.every(row => row[c].value !== 0 && !row[c].isError);
      
      const boxStartRow = Math.floor(r / 3) * 3;
      const boxStartCol = Math.floor(c / 3) * 3;
      let isBoxComplete = true;
      for (let i = boxStartRow; i < boxStartRow + 3; i++) {
        for (let j = boxStartCol; j < boxStartCol + 3; j++) {
          if (newBoard[i][j].value === 0 || newBoard[i][j].isError) {
            isBoxComplete = false;
          }
        }
      }
      
      const cellsToAnimate = new Set<string>();
      if (isRowComplete) {
        for (let j = 0; j < 9; j++) cellsToAnimate.add(`${r},${j}`);
      }
      if (isColComplete) {
        for (let i = 0; i < 9; i++) cellsToAnimate.add(`${i},${c}`);
      }
      if (isBoxComplete) {
        for (let i = boxStartRow; i < boxStartRow + 3; i++) {
          for (let j = boxStartCol; j < boxStartCol + 3; j++) {
            cellsToAnimate.add(`${i},${j}`);
          }
        }
      }
      
      if (cellsToAnimate.size > 0) {
        const byDistance: { [dist: number]: {i: number, j: number}[] } = {};
        cellsToAnimate.forEach(key => {
          const [i, j] = key.split(',').map(Number);
          const dist = Math.abs(i - r) + Math.abs(j - c);
          if (!byDistance[dist]) byDistance[dist] = [];
          byDistance[dist].push({i, j});
        });

        const maxDist = Math.max(...Object.keys(byDistance).map(Number));
        const animations: Animated.CompositeAnimation[] = [];
        
        for (let d = 0; d <= maxDist; d++) {
          if (!byDistance[d]) continue;
          const cellAnimsForDist = byDistance[d].map(({i, j}) => {
            cellAnims[i][j].setValue(0);
            return Animated.sequence([
              Animated.timing(cellAnims[i][j], { toValue: 1, duration: 150, useNativeDriver: true }),
              Animated.delay(400),
              Animated.timing(cellAnims[i][j], { toValue: 0, duration: 300, useNativeDriver: true })
            ]);
          });
          animations.push(Animated.parallel(cellAnimsForDist));
        }
        
        Animated.stagger(80, animations).start();
      }
    }

    // Check completion
    const isCompleted = newBoard.every(row => row.every(c => c.value !== 0 && !c.isError));
    if (isCompleted) {
      setTimeout(() => {
        router.push({
          pathname: '/victory',
          params: {
            difficulty: title || 'Beginner',
            time: formatTime(time),
            score: score + (cell.value !== num && isCorrect ? 50 : 0),
            mistakes: mistakes + (!isCorrect ? 1 : 0),
          }
        });
      }, 500);
    }
  };

  const handleErase = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (board[r][c].isInitial || board[r][c].value === 0) return;
    
    setHistory([...history, { r, c, prevVal: board[r][c].value }]);
    
    const newBoard = [...board];
    newBoard[r][c] = {
      ...board[r][c],
      value: 0,
      isError: false
    };
    setBoard(newBoard);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    
    const newBoard = [...board];
    newBoard[last.r][last.c] = {
      ...newBoard[last.r][last.c],
      value: last.prevVal,
      isError: last.prevVal !== 0 && solution[last.r][last.c] !== last.prevVal
    };
    setBoard(newBoard);
  };

  // Count remaining numbers
  const numberCounts = Array(10).fill(9);
  board.forEach(row => {
    row.forEach(cell => {
      if (cell.value !== 0 && !cell.isError) {
        numberCounts[cell.value]--;
      }
    });
  });

  return (
    <View style={styles.root}>
      {/* Toast Notification */}
      {errorToast && (
        <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastAnim }] }]}>
          <View style={styles.toastIconBox}>
            {errorToast.type === 'col' && (
              <View style={styles.colErrorShape}>
                <Text style={[styles.errorNum, {color: '#E53E3E', marginTop: -2}]}>{errorToast.num}</Text>
                <Text style={[styles.errorNum, {color: '#2D3748', marginBottom: -2}]}>{errorToast.num}</Text>
              </View>
            )}
            {errorToast.type === 'row' && (
              <View style={styles.rowErrorShape}>
                <Text style={[styles.errorNum, {color: '#E53E3E'}]}>{errorToast.num}</Text>
                <Text style={[styles.errorNum, {color: '#2D3748', marginLeft: 6}]}>{errorToast.num}</Text>
              </View>
            )}
            {errorToast.type === 'box' && (
              <View style={styles.blockErrorShape}>
                <Text style={[styles.errorNum, {color: '#E53E3E', position: 'absolute', top: 0, left: 3}]}>{errorToast.num}</Text>
                <Text style={[styles.errorNum, {color: '#2D3748', position: 'absolute', bottom: 0, right: 3}]}>{errorToast.num}</Text>
              </View>
            )}
            {errorToast.type === 'wrong' && (
              <Ionicons name="close" size={24} color="#E53E3E" />
            )}
          </View>
          <View style={styles.toastTexts}>
            <Text style={styles.toastTitle}>{errorToast.title}</Text>
            <Text style={styles.toastSubtitle}>{errorToast.subtitle}</Text>
          </View>
        </Animated.View>
      )}

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#4A5568" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="star-outline" size={24} color="#4A5568" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="share-outline" size={24} color="#4A5568" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="color-palette-outline" size={24} color="#4A5568" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="settings-outline" size={24} color="#4A5568" /></TouchableOpacity>
          </View>
        </View>

        {/* Subheader */}
        <View style={styles.subheader}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <View style={styles.subheaderInfo}>
            <Text style={styles.infoText}>Mistakes: {mistakes}/3</Text>
            <Text style={styles.infoText}>{title || 'Beginner'}</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.infoText}>{formatTime(time)}</Text>
              <Ionicons name="pause-circle-outline" size={18} color="#718096" style={{marginLeft: 4}} />
            </View>
          </View>
        </View>

        {/* Board */}
        <View style={styles.boardContainer}>
          <View style={styles.grid}>
            {board.map((row, r) => (
              <View key={`row-${r}`} style={styles.row}>
                {row.map((cell, c) => {
                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const isSameGroup = selectedCell && (selectedCell.r === r || selectedCell.c === c || 
                    (Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(selectedCell.c / 3) === Math.floor(c / 3)));
                  const isSameNumber = selectedCell && board[selectedCell.r][selectedCell.c].value !== 0 && board[selectedCell.r][selectedCell.c].value === cell.value;
                  
                  return (
                    <TouchableOpacity
                      key={`cell-${r}-${c}`}
                      activeOpacity={1}
                      onPress={() => handleCellPress(r, c)}
                      style={[
                        styles.cell,
                        (r + 1) % 3 === 0 && r !== 8 && styles.borderBottomThick,
                        (c + 1) % 3 === 0 && c !== 8 && styles.borderRightThick,
                        isSameGroup && styles.cellSameGroup,
                        isSelected && styles.cellSelected,
                        isSameNumber && !isSelected && styles.cellSameNumber
                      ]}
                    >
                      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#62A4F5', opacity: cellAnims[r][c] }]} pointerEvents="none" />
                      <Text style={[
                        styles.cellText,
                        !cell.isInitial && styles.cellTextUser,
                        cell.isError && styles.cellTextError
                      ]}>
                        {cell.value !== 0 ? cell.value : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Action Tools */}
        <View style={styles.toolsContainer}>
          <TouchableOpacity style={styles.toolBtn} onPress={handleUndo}>
            <MaterialCommunityIcons name="undo-variant" size={24} color="#4A5568" />
            <Text style={styles.toolText}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={handleErase}>
            <MaterialCommunityIcons name="eraser" size={24} color="#4A5568" />
            <Text style={styles.toolText}>Erase</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <MaterialCommunityIcons name="pencil-outline" size={24} color="#4A5568" />
            <Text style={styles.toolText}>Pencil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <View style={styles.hintIconContainer}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#4A5568" />
              <View style={styles.hintBadge}><Text style={styles.hintBadgeText}>3</Text></View>
            </View>
            <Text style={styles.toolText}>Smart Hint</Text>
          </TouchableOpacity>
        </View>

        {/* Numpad */}
        <View style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <TouchableOpacity 
              key={num} 
              style={styles.numpadBtn} 
              onPress={() => handleNumberInput(num)}
            >
              <Text style={styles.numpadNum}>{num}</Text>
              <Text style={styles.numpadCount}>{numberCounts[num] > 0 ? numberCounts[num] : ''}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    zIndex: 100,
  },
  toastIconBox: {
    width: 52,
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  colErrorShape: {
    width: 20,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#E53E3E',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  rowErrorShape: {
    width: 38,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#E53E3E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockErrorShape: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E53E3E',
  },
  errorNum: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
  toastTexts: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  toastSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 45,
  },
  iconBtn: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  subheader: {
    paddingHorizontal: 20,
    marginTop: 80,
    marginBottom: 20,
  },
  scoreText: {
    textAlign: 'center',
    color: '#0061E0',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  subheaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '500',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  grid: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 2,
    borderColor: '#4A5568',
    backgroundColor: '#FFFFFF',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderBottomThick: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A5568',
  },
  borderRightThick: {
    borderRightWidth: 2,
    borderRightColor: '#4A5568',
  },
  cellSameGroup: {
    backgroundColor: '#F1F5F9', // light gray for same row/col/box
  },
  cellSelected: {
    backgroundColor: '#D1E3F6', // light blue for selected cell
  },
  cellSameNumber: {
    backgroundColor: '#C3DDF7', // slightly darker blue for same number matching
  },
  cellText: {
    fontSize: 24,
    color: '#2D3748', // Blackish for initial
    fontWeight: '500',
  },
  cellTextUser: {
    color: '#0061E0', // Blue for user input
    fontWeight: '500',
  },
  cellTextError: {
    color: '#E53E3E', // Red for errors
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  toolBtn: {
    alignItems: 'center',
  },
  toolText: {
    marginTop: 6,
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  hintIconContainer: {
    position: 'relative',
  },
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#0061E0',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  hintBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  numpad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 80,
  },
  numpadBtn: {
    width: (SCREEN_WIDTH - 40 - 8 * 4) / 9,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numpadNum: {
    fontSize: 24,
    color: '#0061E0',
    fontWeight: '400',
  },
  numpadCount: {
    fontSize: 10,
    color: '#A0AEC0',
    marginTop: -2,
  }
});
