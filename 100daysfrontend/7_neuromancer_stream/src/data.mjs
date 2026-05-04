// Mocked themes and words
// Cada tema contém um nome e dezenas de palavras relacionadas
// Mantido simples e 100% mockado

export const themes = [
  {
    id: 'cidade',
    name: 'Cidade',
    words: [
      'asfalto','trânsito','sirene','luz','ponte','muro','quebra-mola','poste','beco','bairro','metrô','ônibus','praça','trilho','fumaça','viela','avenida','semáforo','padaria','bueiro','viaduto','tráfego','cabine','obras','barulho','grafite','camelô','ponto','rodovia','túnel','portão','ferro','concreto','gueto','centro','periferia','rodoviária','táxi','viatura','museu','estátua','estádio','mercado','feira','vielas','asfalto','congestionamento'
    ]
  },
  {
    id: 'natureza',
    name: 'Natureza',
    words: [
      'vento','rio','cachoeira','folha','raiz','pedra','areia','grão','árvore','flor','floresta','nuvem','chuva','relâmpago','trovão','sol','lua','estrela','montanha','vale','trilha','lama','ninho','pássaro','borboleta','lago','maré','onda','oceano','coral','peixe','areal','cerrado','mangue','deserto','gelo','neve','geada','neblina','orvalho','sereno','rocha','cacto','cipó','capim','mato','campo','pomar','sementes','raios'
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    words: [
      'código','byte','algoritmo','rede','pacote','ping','bug','commit','deploy','nuvem','server','client','cache','token','senha','proxy','ransomware','kernel','driver','thread','socket','api','json','script','query','dados','cluster','gpu','cpu','shader','buffer','patch','branch','merge','git','log','build','release','hotfix','router','switch','dns','http','https','socket','firmware','iot','sensor','release'
    ]
  },
  {
    id: 'emoções',
    name: 'Emoções',
    words: [
      'amor','ódio','medo','coragem','raiva','paz','culpa','ciúme','orgulho','tristeza','alegria','ânsia','esperança','fé','desespero','sossego','euforia','ternura','solidão','empatia','dúvida','saudade','gratidão','alívio','anseio','tensão','satisfação','frustração','carinho','afeição','compaixão','inveja','ambição','calma','frieza','ardor','serenidade','melancolia','nostalgia','timidez','vaidade','zelo','zanga','entusiasmo','apreço','repulsa','harmonia','consolo','tormento'
    ]
  },
  {
    id: 'aleatório',
    name: 'Aleatório',
    words: [
      'telefone','abacaxi','janela','avião','diploma','bússola','fantasma','foguete','caneta','xadrez','pirata','tesouro','bruxo','castelo','boneco','guitarra','vitrola','geladeira','cafeína','calendário','relógio','escada','hambúrguer','espelho','trampolim','mochila','sapato','narguilé','picolé','sanduíche','controle','volante','parafuso','lâmpada','raquete','bicicleta','biscoito','caderno','bandeira','baralho','telescópio','planeta','cometa','asteroide','robô','portal','caverna','escudo','lanterna','batalha'
    ]
  }
];

export function getThemeById(id) {
  return themes.find(t => t.id === id) || themes[0];
}

