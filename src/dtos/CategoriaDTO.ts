// src/dtos/CategoriaDTO.ts

export interface CategoriaCreateDTO {
  nome: string;
  tipo: "entrada" | "saida";
}

export interface CategoriaUpdateDTO {
  nome?: string;
  tipo?: "entrada" | "saida";
}

export interface CategoriaResponseDTO {
  idCategoria: number;
  nome: string;
  tipo: "entrada" | "saida";
  usuarioId: number;
  createdAt: string;
  updatedAt: string;
}
