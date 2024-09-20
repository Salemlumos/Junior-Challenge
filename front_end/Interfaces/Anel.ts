interface Anel {
    id: number;
    nome: string;
    poder: string;
    imagem: string; 
    descricao: string;
    portador: Usuario;
    forjadoPor: Usuario;
    historico: Historico[];
  }