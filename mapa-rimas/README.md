# 🎤 Mapa de Rimas

Um aplicativo interativo para treinamento de batalhas de rima, desenvolvido em React. O aplicativo apresenta palavras organizadas por temas que aparecem na tela em sequência, criando um ambiente dinâmico para praticar rimas.

## ✨ Funcionalidades

### 🎯 Modo Principal
- **Temas Organizados**: 6 temas diferentes com dezenas de palavras cada
- **Animação Dinâmica**: Palavras aparecem na tela em posições aleatórias
- **Controle de Velocidade**: Ajuste a velocidade de aparição das palavras
- **Navegação entre Temas**: Passe facilmente entre diferentes temas

### 🎨 Personalização
- **Cores Customizáveis**: Altere a cor da fonte e do fundo
- **Tamanho da Fonte**: Ajuste o tamanho das palavras para melhor visualização
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

### 📄 Exportação PDF
- **Impressão Otimizada**: Cada tema vira uma página A4
- **Layout Organizado**: Palavras dispostas em grid para fácil leitura
- **Seleção Flexível**: Exporte um tema específico ou todos os temas
- **Informações Detalhadas**: Inclui título do tema e contagem de palavras

## 🚀 Como Usar

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta do projeto
cd mapa-rimas

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Controles
- **▶️ Iniciar/Pausar**: Controla a animação das palavras
- **← Anterior/Próximo →**: Navega entre os temas
- **📄 Exportar PDF**: Gera arquivo PDF para impressão
- **Configurações**: Painel lateral com opções de personalização

## 🎨 Temas Disponíveis

1. **Amor e Paixão** - 24 palavras
2. **Vida e Morte** - 24 palavras  
3. **Dinheiro e Poder** - 24 palavras
4. **Família e Amigos** - 24 palavras
5. **Sonhos e Aspirações** - 24 palavras
6. **Cidade e Rua** - 24 palavras

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **jsPDF** - Geração de PDFs
- **html2canvas** - Captura de elementos HTML
- **CSS3** - Estilização moderna com animações

## 📱 Responsividade

O aplicativo foi desenvolvido com design responsivo, funcionando perfeitamente em:
- 💻 Desktop (1920x1080+)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 767px)

## 🎯 Objetivo

Este aplicativo foi criado para ajudar rimadores a treinarem para batalhas de rima, oferecendo:
- **Estímulo Visual**: Palavras aparecem dinamicamente na tela
- **Organização por Temas**: Facilita o treinamento focado
- **Material Impresso**: PDFs para estudo offline
- **Interface Intuitiva**: Fácil de usar durante o treino

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
src/
├── components/
│   ├── MapaRimas.jsx      # Componente principal
│   ├── MapaRimas.css      # Estilos do mapa
│   ├── ExportarPDF.jsx    # Modal de exportação
│   └── ExportarPDF.css    # Estilos do modal
├── data/
│   └── temas.js           # Dados mockados dos temas
├── App.jsx                # Componente raiz
└── App.css                # Estilos globais
```

### Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção

## 📄 Licença

Este projeto é de uso livre para fins educacionais e de treinamento.

---

**Desenvolvido com ❤️ para a comunidade de rimadores**