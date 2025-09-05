import React from 'react'
import { motion } from 'framer-motion'

const ConnectionLine = ({ start, end }) => {
  const length = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  )
  
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI)

  return (
    <motion.div
      className="connection-line"
      style={{
        left: start.x + 60, // Ajuste para centralizar com a palavra
        top: start.y + 30,
        width: length,
        transform: `rotate(${angle}deg)`,
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
  )
}

export default ConnectionLine