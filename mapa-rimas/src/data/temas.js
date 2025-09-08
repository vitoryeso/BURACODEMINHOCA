// Dados mockados dos temas e palavras para o mapa de rimas
export const temas = [
  {
    id: 1,
    nome: "Amor e Paixão",
    palavras: [
      "coração", "paixão", "emoção", "união", "canção", "ilusão", "perdição",
      "traição", "devoção", "sedução", "obsessão", "confusão", "decisão",
      "visão", "missão", "expressão", "impressão", "sessão", "profissão",
      "confissão", "admissão", "comissão", "permissão", "submissão"
    ]
  },
  {
    id: 2,
    nome: "Vida e Morte",
    palavras: [
      "vida", "morte", "sorte", "porte", "forte", "corte", "porte", "norte",
      "suporte", "transporte", "importe", "exporte", "reporte", "deporte",
      "comporte", "desporte", "resporte", "absorte", "consorte", "distorte",
      "extorte", "retorte", "contorte", "desorte"
    ]
  },
  {
    id: 3,
    nome: "Dinheiro e Poder",
    palavras: [
      "dinheiro", "poder", "querer", "valer", "trazer", "fazer", "dizer",
      "conhecer", "merecer", "obedecer", "descer", "crescer", "descer",
      "nascer", "morrer", "correr", "escorrer", "percorrer", "socorrer",
      "encorrer", "descorrer", "acorrer", "decorrer", "transcorrer"
    ]
  },
  {
    id: 4,
    nome: "Família e Amigos",
    palavras: [
      "família", "filha", "filho", "milho", "bilho", "vilho", "silho",
      "rilho", "quilho", "pilho", "dilho", "cilho", "gilho", "hilho",
      "jilho", "kilho", "lilho", "nilho", "oilho", "pilho", "quilho",
      "rilho", "silho", "tilho"
    ]
  },
  {
    id: 5,
    nome: "Sonhos e Aspirações",
    palavras: [
      "sonho", "sonho", "bonho", "conho", "donho", "fonho", "gonho",
      "honho", "jonho", "konho", "lonho", "monho", "nonho", "onho",
      "ponho", "qonho", "ronho", "sonho", "tonho", "uonho", "vonho",
      "wonho", "xonho", "yonho", "zonho"
    ]
  },
  {
    id: 6,
    nome: "Cidade e Rua",
    palavras: [
      "cidade", "idade", "sidade", "tidade", "uidade", "vidade", "widade",
      "xidade", "yidade", "zidade", "aidade", "bidade", "cidade", "didade",
      "eidade", "fidade", "gidade", "hidade", "iidade", "jidade", "kidade",
      "lidade", "midade", "nidade", "oidade"
    ]
  }
];

export const getTemaById = (id) => {
  return temas.find(tema => tema.id === id);
};

export const getTodasPalavras = () => {
  return temas.flatMap(tema => tema.palavras);
};