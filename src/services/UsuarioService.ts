import bcrypt from "bcrypt";
import * as UsuarioRepository from "../repository/UsuarioRepository.js";
import {
  UsuarioCreateDTO,
  UsuarioLoginDTO,
  UsuarioResponseDTO
} from "../dtos/UsuarioDTO.js";

// Local-only update type (does NOT need to exist in DTO folder)
type UsuarioUpdateFields = {
  nome?: string;
  email?: string;
  senha?: string;
};

function validateUsuarioInput(data: UsuarioCreateDTO) {
  return (
    data &&
    typeof data.nome === "string" &&
    data.nome.trim() !== "" &&
    typeof data.email === "string" &&
    data.email.trim() !== "" &&
    typeof data.senha === "string" &&
    data.senha.trim() !== ""
  );
}

function validateUpdateInput(data: UsuarioUpdateFields) {
  return (
    (!data.nome || typeof data.nome === "string") &&
    (!data.email || typeof data.email === "string") &&
    (!data.senha || typeof data.senha === "string")
  );
}

export async function createUsuario(
  data: UsuarioCreateDTO
): Promise<UsuarioResponseDTO> {

  if (!validateUsuarioInput(data)) {
    throw { status: 400, message: "Campos inválidos" };
  }

  const normalized = {
    nome: data.nome.trim(),
    email: data.email.trim().toLowerCase(),
    senha: data.senha.trim()
  };

  const created = await UsuarioRepository.createUsuario(normalized);

  return {
    usuarioID: created.usuarioID,
    nome: created.nome,
    email: created.email
  };
}

export async function loginUsuario(
  credentials: UsuarioLoginDTO
): Promise<UsuarioResponseDTO> {

  const usuario = await UsuarioRepository.findUsuarioByEmail(
    credentials.email.toLowerCase()
  );

  if (!usuario) throw { status: 404, message: "Usuário não encontrado" };

  const senhaOk = await usuario.correctPassword(String(credentials.senha));
  if (!senhaOk) throw { status: 401, message: "Senha incorreta" };

  return {
    usuarioID: usuario.usuarioID,
    nome: usuario.nome,
    email: usuario.email
  };
}

export async function listUsuarioByID(id: number) {
  const usuario = await UsuarioRepository.findById(id);
  if (!usuario) {
    throw { status: 404, message: "Usuário não encontrado" };
  }

  return {
    usuarioID: usuario.usuarioID,
    nome: usuario.nome,
    email: usuario.email
  };
}

export async function updateUsuario(id: number, data: UsuarioUpdateFields) {
  if (!validateUpdateInput(data)) {
    throw { status: 400, message: "Campos inválidos" };
  }

  const usuario = await UsuarioRepository.findById(id);
  if (!usuario) {
    throw { status: 404, message: "Usuário não encontrado" };
  }

  const payload: UsuarioUpdateFields = {};

  if (data.nome) payload.nome = data.nome.trim();
  if (data.email) payload.email = data.email.trim().toLowerCase();
  if (data.senha) payload.senha = data.senha.trim();

  const updated = await UsuarioRepository.updateUsuario(id, payload);

  return {
    usuarioID: updated.usuarioID,
    nome: updated.nome,
    email: updated.email
  };
}

export async function deleteUsuario(id: number) {
  const usuario = await UsuarioRepository.findById(id);
  if (!usuario) {
    throw { status: 404, message: "Usuário não encontrado" };
  }
  return UsuarioRepository.deleteUsuario(id);
}
