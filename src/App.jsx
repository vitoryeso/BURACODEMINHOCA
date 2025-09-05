import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MatrixRain from './components/MatrixRain'
import WordNode from './components/WordNode'
import CentralWord from './components/CentralWord'
import ConnectionLine from './components/ConnectionLine'
import Controls from './components/Controls'

function App() {
  const [centralWord, setCentralWord] = useState('RAP')
  const [connectedWords, setConnectedWords] = useState([
    'FLOW', 'BEAT', 'RHYME', 'BARS', 'STYLE', 'SPIT', 'MIC', 'BATTLE', 'FREESTYLE'
  ])
  const [positions, setPositions] = useState({})
  const containerRef = useRef(null)

  // Calcular posições dos nós em um círculo ao redor da palavra central
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const centerX = container.offsetWidth / 2
      const centerY = container.offsetHeight / 2
      const radius = Math.min(container.offsetWidth, container.offsetHeight) * 0.3

      const newPositions = {}
      
      // Posição da palavra central
      newPositions.central = {
        x: centerX - 60, // Ajuste para centralizar
        y: centerY - 30
      }

      // Posições dos nós conectados em círculo
      connectedWords.forEach((word, index) => {
        const angle = (index * 2 * Math.PI) / connectedWords.length
        const x = centerX + radius * Math.cos(angle) - 40
        const y = centerY + radius * Math.sin(angle) - 15
        newPositions[word] = { x, y }
      })

      setPositions(newPositions)
    }
  }, [connectedWords])

  const addWord = (newWord) => {
    if (newWord && !connectedWords.includes(newWord.toUpperCase())) {
      setConnectedWords([...connectedWords, newWord.toUpperCase()])
    }
  }

  const removeWord = (wordToRemove) => {
    setConnectedWords(connectedWords.filter(word => word !== wordToRemove))
  }

  const updateCentralWord = (newWord) => {
    setCentralWord(newWord.toUpperCase())
  }

  return (
    <div className="App" ref={containerRef}>
      <div className="matrix-bg" />
      <MatrixRain />
      
      <Controls 
        centralWord={centralWord}
        connectedWords={connectedWords}
        onCentralWordChange={updateCentralWord}
        onAddWord={addWord}
        onRemoveWord={removeWord}
      />

      {/* Palavra Central */}
      {positions.central && (
        <CentralWord 
          word={centralWord}
          position={positions.central}
        />
      )}

      {/* Nós de palavras conectadas */}
      {Object.entries(positions).map(([word, position]) => {
        if (word === 'central') return null
        return (
          <WordNode
            key={word}
            word={word}
            position={position}
            onRemove={() => removeWord(word)}
          />
        )
      })}

      {/* Linhas de conexão */}
      {positions.central && Object.entries(positions).map(([word, position]) => {
        if (word === 'central') return null
        return (
          <ConnectionLine
            key={`line-${word}`}
            start={positions.central}
            end={position}
          />
        )
      })}
    </div>
  )
}

export default App