"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the snakes and ladders on the board
const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
}

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
}

// Player colors
const playerColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"]

export default function SnakeAndLadder() {
  const [players, setPlayers] = useState(2)
  const [positions, setPositions] = useState<number[]>([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [diceValue, setDiceValue] = useState(0)
  const [isRolling, setIsRolling] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [winner, setWinner] = useState<number | null>(null)
  const [gameMessage, setGameMessage] = useState("")

  // Initialize the game
  useEffect(() => {
    resetGame()
  }, [players])

  const resetGame = () => {
    setPositions(Array(players).fill(0))
    setCurrentPlayer(0)
    setDiceValue(0)
    setIsRolling(false)
    setGameStarted(false)
    setWinner(null)
    setGameMessage("Roll the dice to start the game!")
  }

  const rollDice = () => {
    if (winner !== null) return

    setIsRolling(true)
    setGameMessage("Rolling...")

    // Simulate dice rolling animation
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
    }, 100)

    // Stop rolling after 1 second and move player
    setTimeout(() => {
      clearInterval(rollInterval)
      setIsRolling(false)
      const value = Math.floor(Math.random() * 6) + 1
      setDiceValue(value)
      movePlayer(value)
      setGameStarted(true)
    }, 1000)
  }

  const movePlayer = (steps: number) => {
    const newPositions = [...positions]
    let newPosition = newPositions[currentPlayer] + steps

    // Check if player can move (not exceeding 100)
    if (newPosition > 100) {
      setGameMessage(`Player ${currentPlayer + 1} can't move beyond 100. Next player's turn.`)
      setCurrentPlayer((currentPlayer + 1) % players)
      return
    }

    // Check if player landed on a snake
    if (snakes[newPosition]) {
      newPosition = snakes[newPosition]
      setGameMessage(`Player ${currentPlayer + 1} landed on a snake! Moved down to ${newPosition}.`)
    }
    // Check if player landed on a ladder
    else if (ladders[newPosition]) {
      newPosition = ladders[newPosition]
      setGameMessage(`Player ${currentPlayer + 1} landed on a ladder! Climbed up to ${newPosition}.`)
    } else {
      setGameMessage(`Player ${currentPlayer + 1} moved to ${newPosition}.`)
    }

    newPositions[currentPlayer] = newPosition
    setPositions(newPositions)

    // Check if player won
    if (newPosition === 100) {
      setWinner(currentPlayer)
      setGameMessage(`Player ${currentPlayer + 1} wins!`)
    } else {
      // Next player's turn
      setCurrentPlayer((currentPlayer + 1) % players)
    }
  }

  // Generate the board cells (10x10 grid)
  const renderBoard = () => {
    const cells = []

    // Create cells in a snake pattern (1 starts at bottom left)
    for (let row = 9; row >= 0; row--) {
      const rowCells = []
      for (let col = 0; col < 10; col++) {
        const cellNumber = row % 2 === 0 ? row * 10 + col + 1 : row * 10 + (10 - col)

        // Check if any player is on this cell
        const playersOnCell = positions
          .map((pos, idx) => (pos === cellNumber ? idx : -1))
          .filter((idx) => idx !== -1)

        rowCells.push(
          <div
            key={cellNumber}
            className={cn(
              "relative flex h-8 w-8 items-center justify-center border border-gray-300 text-xs font-medium md:h-12 md:w-12 md:text-sm",
              cellNumber % 2 === 0 ? "bg-gray-100" : "bg-white",
            )}
          >
            {cellNumber}

            {/* Show animated snake or ladder image */}
            {snakes[cellNumber] && (
              <img
                src="/snake.png"
                alt="Snake"
                className="absolute inset-0 object-cover opacity-70 fade-in"
              />
            )}
            {ladders[cellNumber] && (
              <img
                src="/ladder.png"
                alt="Ladder"
                className="absolute inset-0 object-cover opacity-70 fade-in"
              />
            )}

            {/* Player tokens */}
            {playersOnCell.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 p-0.5">
                {playersOnCell.map((playerIdx) => (
                  <div key={playerIdx} className={cn("h-2 w-2 rounded-full md:h-3 md:w-3", playerColors[playerIdx])} />
                ))}
              </div>
            )}
          </div>
        )
      }
      cells.push(
        <div key={row} className="flex">
          {rowCells}
        </div>,
      )
    }

    return cells.reverse() // Reverse to start from 1 at bottom left
  }

  // Render dice based on current value
  const renderDice = () => {
    const diceIcons = [
      <Dice1 key={1} className="h-10 w-10" />,
      <Dice2 key={2} className="h-10 w-10" />,
      <Dice3 key={3} className="h-10 w-10" />,
      <Dice4 key={4} className="h-10 w-10" />,
      <Dice5 key={5} className="h-10 w-10" />,
      <Dice6 key={6} className="h-10 w-10" />,
    ]

    return diceValue > 0 ? diceIcons[diceValue - 1] : <div className="h-10 w-10" />
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 0.7;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="order-2 w-full lg:order-1 lg:w-3/4">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-auto">
                <div className="flex flex-col">{renderBoard()}</div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="mr-4 flex items-center gap-2">
                  <span className="text-sm font-medium">Legend:</span>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-red-200"></div>
                    <span className="text-xs">Snake</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-green-200"></div>
                    <span className="text-xs">Ladder</span>
                  </div>
                </div>

                {playerColors.slice(0, players).map((color, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div className={cn("h-3 w-3 rounded-full", color)}></div>
                    <span className="text-xs">Player {idx + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="order-1 w-full lg:order-2 lg:w-1/4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex flex-col items-center">
                <h2 className="mb-2 text-lg font-bold">Game Controls</h2>

                {!gameStarted && (
                  <div className="mb-4 w-full">
                    <h3 className="mb-2 text-sm font-medium">Number of Players:</h3>
                    <div className="flex gap-2">
                      {[2, 3, 4].map((num) => (
                        <Button
                          key={num}
                          variant={players === num ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPlayers(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4 flex flex-col items-center">
                  <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    {renderDice()}
                  </div>
                  <Button onClick={rollDice} disabled={isRolling || winner !== null} className="mt-2">
                    {isRolling ? "Rolling..." : "Roll Dice"}
                  </Button>
                </div>

                <div className="mb-4 w-full rounded-lg bg-gray-100 p-3 text-center">
                  <p className="text-sm">
                    {gameStarted ? (
                      <>
                        <span className="font-medium">Current Turn: </span>
                        <span className="font-bold" style={{ color: playerColors[currentPlayer].replace("bg-", "") }}>
                          Player {currentPlayer + 1}
                        </span>
                      </>
                    ) : (
                      "Start the game by rolling the dice!"
                    )}
                  </p>
                </div>

                <div className="w-full rounded-lg bg-gray-100 p-3 text-center">
                  <p className="text-sm">{gameMessage}</p>
                </div>

                {/* Restart Button always visible */}
                <Button onClick={resetGame} className="mt-4">
                  Restart Game
                </Button>

                {/* Optionally, you can still show a Play Again button when a winner is declared */}
                {winner !== null && (
                  <Button onClick={resetGame} className="mt-4">
                    Play Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

