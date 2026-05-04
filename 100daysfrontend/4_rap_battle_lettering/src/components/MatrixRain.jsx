import React, { useEffect, useRef } from 'react'

const MatrixRain = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Configurar canvas para ocupar toda a tela
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Caracteres do efeito Matrix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?'
    const charArray = chars.split('')
    
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = []
    
    // Inicializar gotas
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const draw = () => {
      // Fundo semi-transparente para efeito de rastro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff00'
      ctx.font = `${fontSize}px monospace`
      
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        
        // Resetar gota quando atinge o fundo
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain"
    />
  )
}

export default MatrixRain