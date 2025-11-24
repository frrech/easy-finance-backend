// src/utils/arquivoMensalPdf.ts
import PDFDocument from "pdfkit";
import { Readable } from "stream";

// Convert a readable stream into a Buffer (replacement for deprecated getStream.buffer)
function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export async function generatePdfBuffer(rel: any): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  // Title
  doc.fontSize(18).text(
    `Relatório Mensal — ${rel.ano}/${String(rel.mes).padStart(2, "0")}`,
    { align: "center" }
  );

  doc.moveDown();

  // Summary
  doc.fontSize(12).text(`Receitas: R$ ${Number(rel.receitas).toFixed(2)}`);
  doc.text(`Despesas: R$ ${Number(rel.despesas).toFixed(2)}`);
  doc.text(`Saldo do mês: R$ ${Number(rel.saldoMes).toFixed(2)}`);
  doc.text(`Saldo acumulado: R$ ${Number(rel.saldoAcumulado).toFixed(2)}`);

  doc.moveDown();

  // Categories
  doc.fontSize(14).text("Despesas por Categoria:");
  doc.moveDown(0.5);

  Object.entries(rel.porCategoria || {}).forEach(([k, v]) => {
    doc.fontSize(12).text(`${k}: R$ ${Number(v).toFixed(2)}`);
  });

  doc.moveDown();
  doc.fontSize(14).text("Movimentações:");
  doc.moveDown(0.5);

  // Movements (table-like)
  (rel.movimentacoes || []).forEach((m: any) => {
    const date = new Date(m.dataMovimentacao).toLocaleDateString();
    const cat = m.categoria ? m.categoria.nome : "-";

    doc
      .fontSize(10)
      .text(
        `${date} — ${m.descricao} — ${m.tipo.toUpperCase()} — ${cat} — R$ ${Number(m.valor).toFixed(2)}`
      );
  });

  doc.end();

  // Convert stream to Buffer
  const pdfBuffer = await streamToBuffer(doc as unknown as Readable);
  return pdfBuffer;
}
