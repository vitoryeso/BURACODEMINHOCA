import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { temas } from '../data/temas';
import './ExportarPDF.css';

const ExportarPDF = ({ isOpen, onClose }) => {
  const [temaSelecionado, setTemaSelecionado] = useState('todos');
  const [isExportando, setIsExportando] = useState(false);

  const gerarPDF = async () => {
    setIsExportando(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      const temasParaExportar = temaSelecionado === 'todos' ? temas : [temas.find(t => t.id === parseInt(temaSelecionado))];

      for (let i = 0; i < temasParaExportar.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const tema = temasParaExportar[i];
        
        // Título do tema
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text(tema.nome, margin, margin + 20);

        // Linha separadora
        pdf.setDrawColor(100, 100, 100);
        pdf.line(margin, margin + 30, pageWidth - margin, margin + 30);

        // Palavras organizadas em grid
        const palavrasPorLinha = 4;
        const espacamentoVertical = 8;
        const espacamentoHorizontal = contentWidth / palavrasPorLinha;
        let linhaAtual = 0;
        let colunaAtual = 0;

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');

        tema.palavras.forEach((palavra, index) => {
          const x = margin + (colunaAtual * espacamentoHorizontal);
          const y = margin + 50 + (linhaAtual * espacamentoVertical);

          // Verificar se cabe na página
          if (y > pageHeight - margin) {
            pdf.addPage();
            linhaAtual = 0;
            colunaAtual = 0;
            const newY = margin + 50 + (linhaAtual * espacamentoVertical);
            pdf.text(palavra, margin + (colunaAtual * espacamentoHorizontal), newY);
          } else {
            pdf.text(palavra, x, y);
          }

          colunaAtual++;
          if (colunaAtual >= palavrasPorLinha) {
            colunaAtual = 0;
            linhaAtual++;
          }
        });

        // Rodapé com informações
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Mapa de Rimas - ${tema.nome}`, margin, pageHeight - 10);
        pdf.text(`Total de palavras: ${tema.palavras.length}`, pageWidth - margin - 50, pageHeight - 10);
      }

      // Salvar o PDF
      const nomeArquivo = temaSelecionado === 'todos' 
        ? `Mapa_Rimas_Completo_${new Date().toISOString().split('T')[0]}.pdf`
        : `Mapa_Rimas_${temasParaExportar[0].nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(nomeArquivo);
      
      setIsExportando(false);
      onClose();
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setIsExportando(false);
      alert('Erro ao gerar o PDF. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Exportar Mapa de Rimas para PDF</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="tema-select">Selecione o tema para exportar:</label>
            <select
              id="tema-select"
              value={temaSelecionado}
              onChange={(e) => setTemaSelecionado(e.target.value)}
              className="select-input"
            >
              <option value="todos">Todos os temas</option>
              {temas.map((tema) => (
                <option key={tema.id} value={tema.id}>
                  {tema.nome} ({tema.palavras.length} palavras)
                </option>
              ))}
            </select>
          </div>
          
          <div className="info-box">
            <h3>Informações sobre a exportação:</h3>
            <ul>
              <li>• Cada tema será uma página separada no PDF</li>
              <li>• Formato otimizado para impressão em A4</li>
              <li>• Palavras organizadas em grid para melhor visualização</li>
              <li>• Inclui título do tema e contagem de palavras</li>
            </ul>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isExportando}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-primary" 
            onClick={gerarPDF}
            disabled={isExportando}
          >
            {isExportando ? 'Gerando PDF...' : 'Exportar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportarPDF;