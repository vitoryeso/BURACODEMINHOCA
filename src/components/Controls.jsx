import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Controls = ({ 
  centralWord, 
  connectedWords, 
  onCentralWordChange, 
  onAddWord, 
  onRemoveWord 
}) => {
  const [newWord, setNewWord] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAddWord = () => {
    if (newWord.trim()) {
      onAddWord(newWord.trim())
      setNewWord('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddWord()
    }
  }

  return (
    <motion.div 
      className="controls"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: isExpanded ? 0 : -250, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'absolute',
          right: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#00ff00',
          color: '#000',
          border: 'none',
          padding: '10px',
          borderRadius: '0 5px 5px 0',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isExpanded ? '◀' : '▶'}
      </motion.button>

      <h3>BATTLE RAP CREATOR</h3>
      
      <div>
        <label>Palavra Central:</label>
        <input
          type="text"
          value={centralWord}
          onChange={(e) => onCentralWordChange(e.target.value)}
          placeholder="Digite a palavra central"
        />
      </div>

      <div>
        <label>Adicionar Palavra:</label>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nova palavra conectada"
        />
        <button onClick={handleAddWord}>+</button>
      </div>

      <div>
        <label>Palavras Conectadas ({connectedWords.length}):</label>
        <div style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          marginTop: '10px',
          border: '1px solid #00ff00',
          borderRadius: '5px',
          padding: '10px'
        }}>
          {connectedWords.map((word, index) => (
            <motion.div
              key={word}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 0',
                borderBottom: '1px solid rgba(0, 255, 0, 0.2)'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span style={{ color: '#00ffff' }}>{word}</span>
              <button
                onClick={() => onRemoveWord(word)}
                style={{
                  background: '#ff0000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#00ff00' }}>
        <p>• Clique e arraste para mover</p>
        <p>• Hover para ver opções</p>
        <p>• Máximo 9 palavras conectadas</p>
      </div>
    </motion.div>
  )
}

export default Controls