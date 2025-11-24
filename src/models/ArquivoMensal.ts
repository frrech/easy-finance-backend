// src/models/ArquivoMensal.ts
import {
  Sequelize,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

export class ArquivoMensal extends Model<
  InferAttributes<ArquivoMensal>,
  InferCreationAttributes<ArquivoMensal>
> {
  declare id: CreationOptional<number>;
  declare usuarioId: number;
  declare ano: number;
  declare mes: number;
  declare conteudo: string; // JSON stored as TEXT
  declare saldoAcumulado: number | null;

  static initModel(sequelize: Sequelize) {
    ArquivoMensal.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        usuarioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "usuario_id",
        },
        ano: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        mes: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        conteudo: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        saldoAcumulado: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: true,
          field: "saldo_acumulado",
        },
      },
      {
        sequelize,
        tableName: "arquivos_mensais",
        timestamps: true,
      }
    );
  }
}
