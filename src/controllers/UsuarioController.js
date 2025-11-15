import * as UsuarioService from "../services/UsuarioService.js";
import bcrypt from "bcrypt";
import * as UsuarioRepository from "../repository/UsuarioRepository.js";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/model.js";

// export async function createUsuario(req, res) {
//   try {
//     const newUsuario = await UsuarioService.createUsuario(req.body.usuario);
//     res.status(201).json(newUsuario);
//   } catch (err) {
//     res
//       .status(err.status || 500)
//       .json({ message: err.message || "Erro interno do servidor" });
//   }
// }

export async function createUsuario(req, res) {
  try {
    console.log("📩 Incoming body:", req.body);

    const usuario = await Usuario.create(req.body);

    console.log("✅ User created:", usuario);

    // REMOVE SENHA BEFORE SENDING BACK
    const { senha, ...safeUser } = usuario.toJSON();

    return res.status(201).json(safeUser);

  } catch (err) {
    return res.status(500).json({ message: "Erro ao criar usuário" });
  }
}


export async function listUsuarioByID(req, res) {
  try {
    const id = parseInt(req.params.id);
    const usuario = await UsuarioService.listUsuarioByID(id);
    res.status(200).json(usuario);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
}

// export async function loginUsuario(req, res) {
//   try {
//     const { email, senha } = req.body;
//     const user = await UsuarioRepository.findByEmail(email);

//     if (!user) {
//       return res.status(404).json({ message: "Usuário não encontrado" });
//     }

//     const validPassword = await bcrypt.compare(String(senha), user.senha);
//     if (!validPassword) {
//       return res.status(401).json({ message: "Senha incorreta" });
//     }

//     const token = jwt.sign(
//       { usuarioID: user.usuarioID, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRATION || "1h" }
//     );

//     res.status(200).json({
//       message: "Login bem-sucedido!",
//       token,
//       usuario: {
//         usuarioID: user.usuarioID,
//         nome: user.nome,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Error in loginUsuario:", err);
//     res.status(500).json({ message: "Erro interno no login" });
//   }
// }

export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;
    console.log("📥 Login request:", { email, senha });

    const usuario = await Usuario.findOne({ where: { email } });
    console.log("🔍 User from DB:", usuario);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    console.log("🔐 Comparing password...");
    const passwordMatch = await bcrypt.compare(senha, usuario.senha);
    console.log("✅ Password match result:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign(
      { usuarioID: usuario.usuarioID, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      usuario: {
        usuarioID: usuario.usuarioID,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (err) {
    console.error("❌ Erro no loginUsuario:", err);
    res.status(500).json({ message: "Erro interno no login" });
  }
}

export async function getCurrentUsuario(req, res) {
  try {
    console.log("📥 getCurrentUsuario called. req.user:", req.user);

    const { usuarioID } = req.user;
    const usuario = await UsuarioRepository.findById(usuarioID);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({
      usuarioID: usuario.usuarioID,
      nome: usuario.nome,
      email: usuario.email,
      createdAt: usuario.createdAt,
    });
  } catch (err) {
    console.error("❌ Error in getCurrentUsuario:", err);
    res.status(500).json({ message: "Erro interno ao buscar o usuário atual" });
  }
}


export async function updateUsuario(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    const [affected] = await Usuario.update(req.body, {
      where: { usuarioID: id }
    });

    if (affected === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const updatedUser = await Usuario.findByPk(id);

    // Remove password before sending
    const { senha, ...safeUser } = updatedUser.toJSON();

    return res.status(200).json(safeUser);

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}


export async function deleteUsuario(req, res) {
  try {
    const id = parseInt(req.params.id);
    await UsuarioService.deleteUsuario(id);
    res.status(204).send();
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
}