import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";

// === Usuario ===
const Usuario = sequelize.define("Usuario", {
  idUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_usuario"
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "usuarios",
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.senha) {
        const plain = String(user.senha).trim(); // ✅ always normalize
        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(plain, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed("senha")) {
        const plain = String(user.senha).trim(); // ✅ always normalize
        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(plain, salt);
      }
    }
  }
});

Usuario.prototype.correctPassword = async function (typedPassword) {
  return bcrypt.compare(typedPassword, this.senha);
};

// === Categoria ===
const Categoria = sequelize.define("Categoria", {
  idCategoria: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_categoria"
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM("entrada", "saida"),
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "usuario_id",
    references: { model: "usuarios", key: "id_usuario" }
  }
}, {
  tableName: "categorias",
  timestamps: true
});

// === ArquivoMensal ===
const ArquivoMensal = sequelize.define("ArquivoMensal", {
  idArquivoMensal: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_arquivo_mensal"
  },
  mes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 12 }
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  saldoFinal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: "saldo_final"
  },
  caminhoArquivo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "caminho_arquivo"
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: "creation_date"
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "usuario_id",
    references: { model: "usuarios", key: "id_usuario" }
  }
}, {
  tableName: "arquivos_mensais",
  timestamps: true
});

// === Movimentacao ===
const Movimentacao = sequelize.define("Movimentacao", {
  idMovimentacao: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_movimentacao"
  },
  descricao: DataTypes.STRING,
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataMovimentacao: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "data_movimentacao"
  },
  tipo: {
    type: DataTypes.ENUM("entrada", "saida"),
    allowNull: false
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    field: "categoria_id",
    references: { model: "categorias", key: "id_categoria" }
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    field: "usuario_id",
    references: { model: "usuarios", key: "id_usuario" }
  },
  arquivoMensalId: {
    type: DataTypes.INTEGER,
    field: "arquivo_mensal_id",
    references: { model: "arquivos_mensais", key: "id_arquivo_mensal" }
  }
}, {
  tableName: "movimentacoes",
  timestamps: true
});

// === Associations ===
Usuario.hasMany(Categoria, { foreignKey: "usuarioId" });
Categoria.belongsTo(Usuario, { foreignKey: "usuarioId" });

Usuario.hasMany(Movimentacao, { foreignKey: "usuarioId" });
Movimentacao.belongsTo(Usuario, { foreignKey: "usuarioId" });

Categoria.hasMany(Movimentacao, { foreignKey: "categoriaId" });
Movimentacao.belongsTo(Categoria, { foreignKey: "categoriaId" });

Usuario.hasMany(ArquivoMensal, { foreignKey: "usuarioId" });
ArquivoMensal.belongsTo(Usuario, { foreignKey: "usuarioId" });

ArquivoMensal.hasMany(Movimentacao, { foreignKey: "arquivoMensalId" });
Movimentacao.belongsTo(ArquivoMensal, { foreignKey: "arquivoMensalId" });

export { Usuario, Categoria, ArquivoMensal, Movimentacao };
