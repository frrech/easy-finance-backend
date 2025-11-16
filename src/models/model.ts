import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";

// -----------------------------------------
//                USUARIO
// -----------------------------------------

export interface UsuarioModel
  extends Model<
    InferAttributes<UsuarioModel>,
    InferCreationAttributes<UsuarioModel>
  > {
  usuarioID: CreationOptional<number>;
  nome: string;
  email: string;
  senha: string;

  correctPassword(typed: string): Promise<boolean>;
}

declare module "sequelize" {
  interface Model {
    correctPassword?(typed: string): Promise<boolean>;
  }
}

export const Usuario = sequelize.define<UsuarioModel>(
  "Usuario",
  {
    usuarioID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "usuario_id",
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    hooks: {
      async beforeCreate(user) {
        if (user.senha) {
          const plain = user.senha.trim();
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(plain, salt);
        }
      },
      async beforeUpdate(user) {
        if (user.changed("senha")) {
          const plain = user.senha.trim();
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(plain, salt);
        }
      },
    },
  }
);

Usuario.prototype.correctPassword = async function (
  this: UsuarioModel,
  typedPassword: string
) {
  return bcrypt.compare(typedPassword, this.senha);
};
// -----------------------------------------
//                CATEGORIA
// -----------------------------------------

export interface CategoriaModel
  extends Model<
    InferAttributes<CategoriaModel>,
    InferCreationAttributes<CategoriaModel>
  > {
  idCategoria: CreationOptional<number>;
  nome: string;
  tipo: "entrada" | "saida";
  usuarioId: number;
}

export const Categoria = sequelize.define<CategoriaModel>(
  "Categoria",
  {
    idCategoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_categoria",
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("entrada", "saida"),
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "usuario_id",
    },
  },
  {
    tableName: "categorias",
    timestamps: true,
  }
);

// -----------------------------------------
//            ARQUIVO MENSAL
// -----------------------------------------

export interface ArquivoMensalModel
  extends Model<
    InferAttributes<ArquivoMensalModel>,
    InferCreationAttributes<ArquivoMensalModel>
  > {
  idArquivoMensal: CreationOptional<number>;
  mes: number;
  ano: number;
  saldoFinal: number;
  caminhoArquivo?: string | null;
  creationDate: CreationOptional<Date>;
  usuarioId: number;
}

export type ArquivoMensalAttributes = InferAttributes<ArquivoMensalModel>;

export const ArquivoMensal = sequelize.define<ArquivoMensalModel>(
  "ArquivoMensal",
  {
    idArquivoMensal: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_arquivo_mensal",
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 12 },
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    saldoFinal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "saldo_final",
    },
    caminhoArquivo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "caminho_arquivo",
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "creation_date",
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "usuario_id",
    },
  },
  {
    tableName: "arquivos_mensais",
    timestamps: true,
  }
);

// -----------------------------------------
//               MOVIMENTACAO
// -----------------------------------------

export interface MovimentacaoModel
  extends Model<
    InferAttributes<MovimentacaoModel>,
    InferCreationAttributes<MovimentacaoModel>
  > {
  idMovimentacao: CreationOptional<number>;
  descricao: string;
  valor: number;
  dataMovimentacao: Date;
  tipo: "entrada" | "saida";
  categoriaId: number;
  usuarioId: number;
  arquivoMensalId?: number | null;
}

export const Movimentacao = sequelize.define<MovimentacaoModel>(
  "Movimentacao",
  {
    idMovimentacao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_movimentacao",
    },
    descricao: DataTypes.STRING,
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dataMovimentacao: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "data_movimentacao",
    },
    tipo: {
      type: DataTypes.ENUM("entrada", "saida"),
      allowNull: false,
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      field: "categoria_id",
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      field: "usuario_id",
    },
    arquivoMensalId: {
      type: DataTypes.INTEGER,
      field: "arquivo_mensal_id",
    },
  },
  {
    tableName: "movimentacoes",
    timestamps: true,
  }
);

// -----------------------------------------
//             ASSOCIATIONS
// -----------------------------------------

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
