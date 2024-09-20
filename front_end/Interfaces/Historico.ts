interface Historico {
    id: number;
    action: 'imgChanged' | 'statusChanged'; 
    date: string;
    anel: {
      id: number;
      nome: string;
      poder: string;
      imagem: string;
      descricao: string;
    };
  }