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
  declare mes: number;
  declare ano: number;
  declare saldoFinal: number;
  declare caminhoArquivo: string | null;
  declare creationDate: CreationOptional<Date>;
  declare usuarioId: number;

  static initModel(sequelize: Sequelize) {
    ArquivoMensal.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        mes: DataTypes.INTEGER,
        ano: DataTypes.INTEGER,
        saldoFinal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: "saldo_final",
        },
        caminhoArquivo: {
          type: DataTypes.STRING,
          field: "caminho_arquivo",
        },
        creationDate: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "creation_date",
        },
        usuarioId: {
          type: DataTypes.INTEGER,
          field: "usuario_id",
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
