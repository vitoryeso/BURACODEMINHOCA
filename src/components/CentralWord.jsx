import React from 'react'
import { motion } from 'framer-motion'

const CentralWord = ({ word, position }) => {
  return (
    <motion.div
      className="word-node central-word"
      style={{
        left: position.x,
        top: position.y,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{ 
        scale: 1.1,
        textShadow: "0 0 30px #00ff00, 0 0 60px #00ff00, 0 0 90px #00ff00"
      }}
      whileTap={{ scale: 0.95 }}
    >
      {word}
    </motion.div>
  )
}

export default CentralWord