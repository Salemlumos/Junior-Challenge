interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    race: 'elfos' | 'anões' | 'homens' | 'sauron'; // Enum values from your database
    historico: Historico[] | null;
  }