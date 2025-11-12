import bcrypt from "bcrypt";
import * as UsuarioRepository from "../repository/UsuarioRepository.js";

/**
 * Validate user input (more permissive for senha)
 */
function validateUsuario(usuario) {
  if (!usuario) return false;

  const nomeValido = typeof usuario.nome === "string" && usuario.nome.trim() !== "";
  const emailValido = typeof usuario.email === "string" && usuario.email.trim() !== "";

  const senhaValida =
    (typeof usuario.senha === "string" && usuario.senha.trim() !== "") ||
    (typeof usuario.senha === "number" && usuario.senha.toString().trim() !== "");

  return nomeValido && emailValido && senhaValida;
}

/**
 * Create user
 */
export async function createUsuario(usuario) {
  if (!validateUsuario(usuario)) {
    throw { status: 400, message: "Campos vazios ou inválidos!" };
  }

  // Normalize
  usuario.nome = usuario.nome.trim();
  usuario.email = usuario.email.trim().toLowerCase();
  usuario.senha = String(usuario.senha).trim();

  // ✅ Let model hooks handle hashing
  return await UsuarioRepository.createUsuario(usuario);
}

/**
 * Get user by ID
 */
export async function listUsuarioByID(id) {
  if (!id || id < 0) throw { status: 400, message: "ID inválido" };

  const user = await UsuarioRepository.listUsuarioByID(id);
  if (!user) throw { status: 404, message: "Usuário não encontrado" };

  return user;
}

/**
 * Update user
 */
export async function updateUsuario(id, usuario) {
  if (!id || id < 0) throw { status: 400, message: "ID inválido" };
  if (!validateUsuario(usuario)) throw { status: 400, message: "Campos de usuário inválidos" };

  usuario.nome = usuario.nome.trim();
  usuario.email = usuario.email.trim().toLowerCase();
  usuario.senha = String(usuario.senha).trim();

  return await UsuarioRepository.updateUsuario(id, usuario);
}

/**
 * Delete user
 */
export async function deleteUsuario(id) {
  if (!id || id < 0) throw { status: 400, message: "ID inválido" };
  const usuario = await UsuarioRepository.deleteUsuario(id);
  if (!usuario) throw { status: 404, message: "Usuário não encontrado" };
  return usuario;
}

/**
 * Login user (verify password)
 */
export async function loginUsuario(email, senha) {
  if (!email || !senha) throw { status: 400, message: "Email e senha obrigatórios!" };

  const usuario = await UsuarioRepository.findUsuarioByEmail(email.toLowerCase());
  if (!usuario) throw { status: 404, message: "Usuário não encontrado!" };

  const senhaCorreta = await usuario.correctPassword(String(senha));
  if (!senhaCorreta) throw { status: 401, message: "Senha incorreta!" };

  return usuario;
}