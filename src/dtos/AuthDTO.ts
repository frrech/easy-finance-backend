// src/dtos/AuthDTO.ts

import { UsuarioResponseDTO } from "./UsuarioDTO.js";

export interface AuthResponseDTO {
  token: string;
  usuario: UsuarioResponseDTO;
}
