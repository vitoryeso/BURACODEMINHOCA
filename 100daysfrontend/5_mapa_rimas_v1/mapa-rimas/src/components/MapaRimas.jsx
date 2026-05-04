import React, { useState, useEffect, useRef } from 'react';
import { temas } from '../data/temas';
import ExportarPDF from './ExportarPDF';
import './MapaRimas.css';

const MapaRimas = () => {
  const [temaAtual, setTemaAtual] = useState(0);
  const [palavrasVisiveis, setPalavrasVisiveis] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [velocidade, setVelocidade] = useState(2000); // ms entre palavras
  const [tamanhoFonte, setTamanhoFonte] = useState(24);
  const [corFonte, setCorFonte] = useState('#ffffff');
  const [corFundo, setCorFundo] = useState('#1a1a2e');
  const [showExportModal, setShowExportModal] = useState(false);
  const intervalRef = useRef(null);
  const palavraIndexRef = useRef(0);

  const tema = temas[temaAtual];

  // Função para iniciar a animação das palavras
  const iniciarAnimacao = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsPlaying(true);
    palavraIndexRef.current = 0;
    setPalavrasVisiveis([]);

    intervalRef.current = setInterval(() => {
      if (palavraIndexRef.current < tema.palavras.length) {
        const novaPalavra = {
          id: Date.now() + Math.random(),
          texto: tema.palavras[palavraIndexRef.current],
          posicao: {
            x: Math.random() * (window.innerWidth - 200),
            y: Math.random() * (window.innerHeight - 100)
          }
        };
        
        setPalavrasVisiveis(prev => [...prev, novaPalavra]);
        palavraIndexRef.current++;
      } else {
        // Reinicia o tema quando todas as palavras foram mostradas
        palavraIndexRef.current = 0;
        setPalavrasVisiveis([]);
      }
    }, velocidade);
  };

  // Função para parar a animação
  const pararAnimacao = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  // Função para pausar/retomar
  const togglePlayPause = () => {
    if (isPlaying) {
      pararAnimacao();
    } else {
      iniciarAnimacao();
    }
  };

  // Função para mudar de tema
  const proximoTema = () => {
    pararAnimacao();
    setTemaAtual((prev) => (prev + 1) % temas.length);
    setPalavrasVisiveis([]);
  };

  const temaAnterior = () => {
    pararAnimacao();
    setTemaAtual((prev) => (prev - 1 + temas.length) % temas.length);
    setPalavrasVisiveis([]);
  };

  // Limpar interval ao desmontar componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Limpar palavras antigas
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPalavrasVisiveis(prev => prev.slice(-10)); // Manter apenas as últimas 10 palavras
    }, 5000);

    return () => clearTimeout(timeout);
  }, [palavrasVisiveis]);

  return (
    <div className="mapa-rimas" style={{ backgroundColor: corFundo }}>
      {/* Header com controles */}
      <div className="header">
        <div className="tema-info">
          <h1>{tema.nome}</h1>
          <p>Tema {temaAtual + 1} de {temas.length}</p>
        </div>
        
        <div className="controles">
          <button onClick={temaAnterior} className="btn btn-secondary">
            ← Anterior
          </button>
          
          <button onClick={togglePlayPause} className="btn btn-primary">
            {isPlaying ? '⏸️ Pausar' : '▶️ Iniciar'}
          </button>
          
          <button onClick={proximoTema} className="btn btn-secondary">
            Próximo →
          </button>
          
          <button onClick={() => setShowExportModal(true)} className="btn btn-export">
            📄 Exportar PDF
          </button>
        </div>
      </div>

      {/* Configurações */}
      <div className="configuracoes">
        <div className="config-item">
          <label>Velocidade (ms):</label>
          <input
            type="range"
            min="500"
            max="5000"
            step="250"
            value={velocidade}
            onChange={(e) => setVelocidade(Number(e.target.value))}
            disabled={isPlaying}
          />
          <span>{velocidade}ms</span>
        </div>
        
        <div className="config-item">
          <label>Tamanho da fonte:</label>
          <input
            type="range"
            min="16"
            max="48"
            step="2"
            value={tamanhoFonte}
            onChange={(e) => setTamanhoFonte(Number(e.target.value))}
          />
          <span>{tamanhoFonte}px</span>
        </div>
        
        <div className="config-item">
          <label>Cor da fonte:</label>
          <input
            type="color"
            value={corFonte}
            onChange={(e) => setCorFonte(e.target.value)}
          />
        </div>
        
        <div className="config-item">
          <label>Cor de fundo:</label>
          <input
            type="color"
            value={corFundo}
            onChange={(e) => setCorFundo(e.target.value)}
          />
        </div>
      </div>

      {/* Área das palavras animadas */}
      <div className="area-palavras">
        {palavrasVisiveis.map((palavra) => (
          <div
            key={palavra.id}
            className="palavra-animada"
            style={{
              left: palavra.posicao.x,
              top: palavra.posicao.y,
              fontSize: `${tamanhoFonte}px`,
              color: corFonte,
              animation: 'fadeInOut 3s ease-in-out forwards'
            }}
          >
            {palavra.texto}
          </div>
        ))}
      </div>

      {/* Informações do tema atual */}
      <div className="info-tema">
        <p>Total de palavras: {tema.palavras.length}</p>
        <p>Palavras mostradas: {palavrasVisiveis.length}</p>
      </div>

      {/* Modal de exportação PDF */}
      <ExportarPDF 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
};

export default MapaRimas;