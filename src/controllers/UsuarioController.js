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

export async function createUsuario(req, res, next) {
  try {
    console.log("📩 Incoming body:", req.body);

    const { nome, email, senha } = req.body;
    if (!nome || !email || senha === undefined || senha === null) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ message: "Campos vazios ou inválidos!" });
    }

    const senhaString = String(senha).trim();
    if (senhaString.length === 0) {
      console.log("⚠️ Empty password");
      return res.status(400).json({ message: "Senha inválida!" });
    }

    const novoUsuario = await UsuarioRepository.createUsuario({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senhaString, // plain string, will be hashed by hook
    });

    console.log("✅ User created:", novoUsuario);
    return res.status(201).json(novoUsuario);
  } catch (err) {
    console.error("❌ Error in createUsuario:", err);
    next(err);
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
//       { idUsuario: user.idUsuario, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRATION || "1h" }
//     );

//     res.status(200).json({
//       message: "Login bem-sucedido!",
//       token,
//       usuario: {
//         idUsuario: user.idUsuario,
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

    const user = await UsuarioRepository.findByEmail(email);
    console.log("🔍 User from DB:", user);

    if (!user) {
      console.log("⚠️ Usuário não encontrado");
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // ✅ Always treat password as string to avoid numeric vs string mismatches
    const typedPassword = String(senha).trim();

    console.log("🔐 Comparing password...");
    const validPassword = await bcrypt.compare(typedPassword, user.senha);
    console.log("✅ Password match result:", validPassword);

    if (!validPassword) {
      console.log("❌ Senha incorreta");
      return res.status(401).json({ message: "Senha incorreta" });
    }

    console.log("🪪 Generating JWT...");
    const token = jwt.sign(
      { idUsuario: user.idUsuario, email: user.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );

    console.log("✅ Token generated:", token);

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      usuario: {
        idUsuario: user.idUsuario,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Error in loginUsuario:", err);
    res.status(500).json({ message: "Erro interno no login" });
  }
}

export async function getCurrentUsuario(req, res) {
  try {
    console.log("📥 getCurrentUsuario called. req.user:", req.user);

    const { idUsuario } = req.user;
    const usuario = await UsuarioRepository.findById(idUsuario);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({
      idUsuario: usuario.idUsuario,
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
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Update basic fields
    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;

    // If password was provided, update it (hooks will hash automatically)
    if (senha) usuario.senha = senha;

    await usuario.save(); // ✅ triggers beforeUpdate hook automatically

    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      usuario: {
        idUsuario: usuario.idUsuario,
        nome: usuario.nome,
        email: usuario.email,
        updatedAt: usuario.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ Erro ao atualizar usuário:", err);
    res.status(500).json({ message: "Erro interno ao atualizar usuário" });
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