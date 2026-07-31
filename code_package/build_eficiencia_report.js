const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, ImageRun, VerticalAlign, PageBreak, Footer
} = require("docx");
const fs = require("fs");

const CYAN = "00B4FC";
const BLUE = "0038DC";
const DARK = "0B0B0B";
const GRAY = "52514E";
const LIGHT_BLUE = "E6F3FF";
const GREEN = "1E7A34";
const GREEN_BG = "DFF3E3";
const AMBER = "8A5A00";
const AMBER_BG = "FBF0DA";
const RED = "A32E23";
const RED_BG = "FBE0DE";

const FONT = "Arial";
const logoBuffer = fs.readFileSync("./assets/logo_header.png");
const chartDmGauge = fs.readFileSync("./output/chart_dm_gauge.png");
const chartParadasDonut = fs.readFileSync("./output/chart_paradas_donut.png");
const chartCiclosBar = fs.readFileSync("./output/chart_ciclos_bar.png");
const chartDescargaBar = fs.readFileSync("./output/chart_descarga_bar.png");

function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 30, color: BLUE, font: FONT })],
    spacing: { before: 320, after: 160 },
    border: { bottom: { color: BLUE, space: 4, style: BorderStyle.SINGLE, size: 4 } },
  });
}
function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 25, color: DARK, font: FONT })],
    spacing: { before: 200, after: 100 },
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22, color: DARK, ...opts })],
    spacing: { after: 100 },
  });
}
function labelValueRow(label, value, w1, w2) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: w1, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "F6F8FB" },
        margins: { top: 70, bottom: 70, left: 110, right: 110 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 19, color: GRAY, font: FONT })] })],
      }),
      new TableCell({
        width: { size: w2, type: WidthType.DXA },
        margins: { top: 70, bottom: 70, left: 110, right: 110 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 21, color: DARK, font: FONT })] })],
      }),
    ],
  });
}
function infoTable(pairs) {
  const w1 = 2400, w2 = 6600;
  return new Table({
    width: { size: w1 + w2, type: WidthType.DXA },
    columnWidths: [w1, w2],
    rows: pairs.map(([l, v]) => labelValueRow(l, v, w1, w2)),
  });
}
function metricCard(label, value, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: "F6F8FB" },
    margins: { top: 140, bottom: 140, left: 140, right: 140 },
    children: [
      new Paragraph({ children: [new TextRun({ text: label, size: 19, color: GRAY, font: FONT })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: value, size: 34, bold: true, color: BLUE, font: FONT })] }),
    ],
  });
}
function metricsRow(items) {
  const w = Math.floor(9000 / items.length);
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    rows: [new TableRow({ children: items.map(([l, v]) => metricCard(l, v, w)) })],
  });
}
function tableHeaderCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: BLUE },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 19, color: "FFFFFF", font: FONT })] })],
  });
}
function tableCell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, color: opts.color || DARK, font: FONT, bold: !!opts.bold })] })],
  });
}
function dataTable(headers, rows, widths) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => tableHeaderCell(h, widths[i])) }),
      ...rows.map((r, ri) => new TableRow({
        children: r.map((c, i) => tableCell(c, widths[i], ri % 2 === 1 ? { fill: "F6F8FB" } : {})),
      })),
    ],
  });
}
function spacer(h = 160) { return new Paragraph({ text: "", spacing: { after: h } }); }
function singleImageCentered(buf, w, h) {
  return new Paragraph({
    children: [new ImageRun({ data: buf, transformation: { width: w, height: h }, type: "png" })],
    alignment: AlignmentType.CENTER,
  });
}
function imagePairRow(buf1, buf2, w1, h1, w2, h2) {
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [4500, 4500],
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
    },
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 4500, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        children: [new Paragraph({ children: [new ImageRun({ data: buf1, transformation: { width: w1, height: h1 }, type: "png" })], alignment: AlignmentType.CENTER })],
      }),
      new TableCell({
        width: { size: 4500, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        children: buf2 ? [new Paragraph({ children: [new ImageRun({ data: buf2, transformation: { width: w2, height: h2 }, type: "png" })], alignment: AlignmentType.CENTER })] : [new Paragraph({ text: "" })],
      }),
    ] })],
  });
}

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 21 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: `NEMPATECH — Relatório de ensaio · ${new Date().toLocaleDateString('pt-BR')}`,
              size: 16, color: GRAY, font: FONT,
            })],
          }),
        ],
      }),
    },
    children: [
      // Cabeçalho com logo, centralizado
      new Paragraph({
        children: [new ImageRun({ data: logoBuffer, transformation: { width: 200, height: 85 }, type: "png" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "RELATÓRIO DE EFICIÊNCIA DA COLHEITA", bold: true, size: 30, color: BLUE, font: FONT })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Fazenda Santa Rita · Talhão 4 · Coleta em 05/08/2026 · Linha de base", size: 20, color: GRAY, font: FONT })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 260 },
      }),

      h1("1. Identificação"),
      infoTable([
        ["Fazenda", "Fazenda Santa Rita"],
        ["Cidade / UF", "Itaporã/MS"],
        ["Pipeline", "Subtropical"],
        ["Talhão", "Talhão 4  ·  Área: 42 ha"],
        ["Cultivar", "DKB 390"],
        ["Data de plantio", "28/02/2026"],
        ["Data da coleta", "05/08/2026"],
        ["Momento", "Linha de base"],
        ["Colhedora", "John Deere S540 — Frota 12"],
        ["Operador", "João da Silva"],
        ["Equipe responsável", "Equipe de campo 1"],
      ]),
      spacer(),

      h1("2. Painel visual"),
      imagePairRow(chartDmGauge, chartParadasDonut, 205, 201, 370, 201),
      spacer(300),
      new Paragraph({ children: [new PageBreak()] }),

      h1("3. Eficiência operacional, disponibilidade e consumo"),
      metricsRow([
        ["Disponibilidade Mecânica", "85,0%"],
        ["MTTR", "15,0 min"],
        ["Velocidade média", "15,0 km/h"],
      ]),
      spacer(120),
      metricsRow([
        ["Consumo", "1,43 L/ha"],
        ["Capacidade teórica", "13,65 ha/h"],
        ["Plataforma", "9,1 m"],
      ]),
      spacer(),
      h2("Registro de paradas"),
      dataTable(
        ["Causa", "Início", "Fim", "Duração"],
        [
          ["Mecânica", "08:10", "08:25", "15 min"],
          ["Abastecimento", "10:00", "10:15", "15 min"],
          ["Descarregamento", "11:30", "11:38", "8 min"],
          ["Aguardando transbordo", "13:00", "13:20", "20 min"],
          ["Climática", "15:00", "15:40", "40 min"],
        ],
        [3000, 2000, 2000, 2000]
      ),
      spacer(),

      h1("4. Estudo de tempos e movimentos"),
      dataTable(
        ["Ciclo", "Produtivo (s)", "Manobra (s)", "Espera (s)", "% Produtivo"],
        [
          ["1", "240", "30", "10", "85,7%"],
          ["2", "235", "28", "15", "84,5%"],
          ["3", "250", "25", "5", "89,3%"],
          ["4", "228", "35", "20", "80,6%"],
          ["5", "245", "30", "12", "85,4%"],
        ],
        [1400, 2100, 2100, 2100, 1500]
      ),
      spacer(120),
      metricsRow([["% Tempo produtivo (média)", "85,1%"]]),
      spacer(120),
      singleImageCentered(chartCiclosBar, 460, 221),
      spacer(),

      h1("5. Eficiência do trator — descarga com bazuca"),
      dataTable(
        ["Repetição", "Trator", "Início", "Fim", "Duração"],
        [
          ["1", "Trator 3", "09:12:00", "09:13:45", "1:45"],
          ["2", "Trator 3", "10:40:10", "10:42:02", "1:52"],
          ["3", "Trator 3", "12:05:20", "12:06:58", "1:38"],
          ["4", "Trator 3", "13:50:00", "13:51:50", "1:50"],
          ["5", "Trator 3", "15:30:15", "15:31:56", "1:41"],
        ],
        [1400, 1900, 1900, 1900, 1900]
      ),
      spacer(120),
      metricsRow([
        ["Tempo médio de descarga", "1:45"],
        ["Mais rápida", "1:38"],
        ["Mais lenta", "1:52"],
      ]),
      spacer(120),
      singleImageCentered(chartDescargaBar, 460, 221),
      spacer(),

      h1("6. Observações"),
      p("Linha de base coletada em condição real de operação, sem chuva no período. Parada climática registrada refere-se a orvalho intenso no início da manhã, retomada às 15h40. Nenhuma ocorrência de segurança registrada."),
      spacer(200),

      new Paragraph({
        children: [new TextRun({ text: "Relatório gerado automaticamente pelo sistema Nempa Tech de Eficiência da Colheita.", italics: true, size: 16, color: GRAY, font: FONT })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("./output/Exemplo_Relatorio_Eficiencia.docx", buffer);
  console.log("done");
});
