import React, { useState, useEffect } from 'react';
import { Brain, Check, X } from 'lucide-react';
import Grid from './components/Grid';
import Menu from './components/Menu';
import Modal from './components/Modal';
import CountdownTimer from './components/CountdownTimer';
import TutorialOverlay from './components/TutorialOverlay';

function App() {
  const [level, setLevel] = useState(1);
  const [numbers, setNumbers] = useState<{ value: number; position: number }[]>([]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'memorizing' | 'playing' | 'checking' | 'finished'>('waiting');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFirstTimeOverlay, setShowFirstTimeOverlay] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState<number[]>([]);
  const [incorrectClicks, setIncorrectClicks] = useState<number[]>([]);
  const [hasError, setHasError] = useState(false);
  const [showIcon, setShowIcon] = useState<'success' | 'error' | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  // Modified to increase time with level
  const getMemorizationTime = () => {
    const baseTime = 5;
    const timeIncrease = 0.5;
    return baseTime + (level - 1) * timeIncrease;
  };

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('tutorialSeen');
    if (tutorialSeen) {
      setShowFirstTimeOverlay(false);
    }
  }, []);

  useEffect(() => {
    if (gameState === 'finished' && hasError) {
      const timer = setTimeout(() => {
        setShowGameOver(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState, hasError]);

  const generateNumbers = () => {
    const nums = [];
    const positions = new Set<number>();
    
    for (let i = 1; i <= Math.min(level + 2, 9); i++) {
      let position;
      do {
        position = Math.floor(Math.random() * 49);
      } while (positions.has(position));
      
      positions.add(position);
      nums.push({ value: i, position });
    }
    
    return nums;
  };

  const startGame = () => {
    setNumbers(generateNumbers());
    setShowNumbers(true);
    setGameState('memorizing');
    setClickedNumbers([]);
    setIncorrectClicks([]);
    setHasError(false);
    setShowIcon(null);
    setShowGameOver(false);
  };

  const handleMemorizationComplete = () => {
    setShowNumbers(false);
    setGameState('playing');
  };

  const handleCellClick = (position: number) => {
    if (gameState !== 'playing') return;

    if (clickedNumbers.includes(position)) {
      setClickedNumbers(prev => prev.filter(pos => pos !== position));
      return;
    }

    if (clickedNumbers.length >= numbers.length) return;

    setClickedNumbers(prev => [...prev, position]);
  };

  const handleSubmit = () => {
    if (clickedNumbers.length !== numbers.length) return;

    setGameState('checking');
    let hasErrors = false;
    const incorrect: number[] = [];

    clickedNumbers.forEach((position, index) => {
      const expectedNumber = numbers.find(n => n.value === index + 1);
      if (expectedNumber?.position !== position) {
        hasErrors = true;
        incorrect.push(position);
      }
    });

    setHasError(hasErrors);
    setIncorrectClicks(incorrect);
    setShowIcon(hasErrors ? 'error' : 'success');

    setTimeout(() => {
      setShowIcon(null);
      if (hasErrors) {
        setGameState('finished');
      } else {
        setGameState('waiting');
        setLevel(prev => prev + 1);
      }
    }, 1500);
  };

  const resetGame = () => {
    setLevel(1);
    setGameState('waiting');
    setShowResult(false);
    setClickedNumbers([]);
    setIncorrectClicks([]);
    setHasError(false);
    setShowIcon(null);
    setShowGameOver(false);
  };

  const shareResult = () => {
    const text = `I reached level ${level} in the Chimp Memory Game! Can you beat my score? 🐵`;
    if (navigator.share) {
      navigator.share({
        title: 'Chimp Memory Game',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handleDismissTutorial = () => {
    localStorage.setItem('tutorialSeen', 'true');
    setShowFirstTimeOverlay(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="text-blue-500" />
            <h1 className="text-xl font-bold">Chimp Memory</h1>
          </div>
          <Menu onShowHowToPlay={() => setShowTutorial(true)} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Level {level}</h2>
          <p className="text-gray-600">Time to memorize: {getMemorizationTime().toFixed(1)} seconds</p>
        </div>

        <div className="relative mb-8">
          <Grid
            numbers={numbers}
            showNumbers={showNumbers}
            onCellClick={handleCellClick}
            disabled={gameState !== 'playing'}
            clickedNumbers={clickedNumbers}
            showSolution={gameState === 'finished' && hasError}
            incorrectClicks={incorrectClicks}
          />
          
          {showIcon && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              {showIcon === 'success' ? (
                <Check className="w-24 h-24 text-green-500" />
              ) : (
                <X className="w-24 h-24 text-red-500" />
              )}
            </div>
          )}
        </div>

        {gameState === 'memorizing' && (
          <div className="mb-4">
            <CountdownTimer 
              seconds={getMemorizationTime()} 
              onComplete={handleMemorizationComplete}
            />
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-600">
                Selected: {clickedNumbers.length} / {numbers.length}
              </p>
              <button
                onClick={handleSubmit}
                disabled={clickedNumbers.length !== numbers.length}
                className={`px-6 py-2 rounded-lg ${
                  clickedNumbers.length === numbers.length
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {gameState === 'waiting' && (
          <button
            onClick={startGame}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Level
          </button>
        )}

        {gameState === 'finished' && !showGameOver && (
          <button
            onClick={resetGame}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
        )}

        {showFirstTimeOverlay && (
          <TutorialOverlay
            onClose={() => setShowFirstTimeOverlay(false)}
            onDismiss={handleDismissTutorial}
          />
        )}

        <Modal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          title="How to Play"
        >
          <div className="space-y-4">
            <p>Welcome to Chimp Memory! Here's how to play:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Numbers will appear on the grid</li>
              <li>Memorize their positions before they disappear</li>
              <li>Click the squares in the correct order</li>
              <li>Click Submit when you're ready to check your answer</li>
              <li>Click a square again to deselect it if you change your mind</li>
            </ol>
            <p>The game gets more challenging with each level:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>More numbers to remember</li>
              <li>More time given to memorize</li>
            </ul>
          </div>
        </Modal>

        <Modal
          isOpen={showGameOver}
          onClose={() => {
            setShowGameOver(false);
          }}
          title="Game Over!"
        >
          <div className="text-center space-y-4">
            <p className="text-xl mb-4">You reached Level {level}!</p>
            <button
              onClick={shareResult}
              className="block w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Share Result
            </button>
            <button
              onClick={() => {
                setShowGameOver(false);
                resetGame();
              }}
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Play Again
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default App;