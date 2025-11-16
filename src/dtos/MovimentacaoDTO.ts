// src/dtos/MovimentacaoDTO.ts

export interface MovimentacaoCreateDTO {
  descricao: string;
  valor: number;
  dataMovimentacao: string;      // ISO 8601 date
  tipo: "entrada" | "saida";
  categoriaId: number;
  usuarioId: number;             // injected by middleware
}

export interface MovimentacaoUpdateDTO {
  descricao?: string;
  valor?: number;
  dataMovimentacao?: string;
  tipo?: "entrada" | "saida";
  categoriaId?: number;
  usuarioId: number;             // always required to enforce ownership
}

export interface MovimentacaoResponseDTO {
  idMovimentacao: number;
  descricao: string;
  valor: number;
  dataMovimentacao: string;
  tipo: "entrada" | "saida";
  categoriaId: number;
  usuarioId: number;
  createdAt: string;
  updatedAt: string;

  // Optional: because includes can load the relation
  Categoria?: {
    idCategoria: number;
    nome: string;
    tipo: "entrada" | "saida";
  };
}
