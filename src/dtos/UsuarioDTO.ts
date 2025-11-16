// src/dtos/UsuarioDTO.ts

export interface UsuarioCreateDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface UsuarioLoginDTO {
  email: string;
  senha: string;
}

export interface UsuarioResponseDTO {
  usuarioID: number;
  nome: string;
  email: string;
}
