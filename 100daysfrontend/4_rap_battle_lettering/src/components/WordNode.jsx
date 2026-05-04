import React, { useState } from 'react'
import { motion } from 'framer-motion'

const WordNode = ({ word, position, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="word-node connected-word"
      style={{
        left: position.x,
        top: position.y,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.random() * 0.5 }}
      whileHover={{ 
        scale: 1.2,
        textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff"
      }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {word}
      {isHovered && (
        <motion.button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: '#ff0000',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </motion.button>
      )}
    </motion.div>
  )
}

export default WordNode