const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, ImageRun, VerticalAlign, PageBreak, Footer
} = require("docx");
const fs = require("fs");

const BLUE = "0038DC";
const DARK = "0B0B0B";
const GRAY = "52514E";
const GREEN = "1E7A34";
const GREEN_BG = "DFF3E3";
const AMBER = "8A5A00";
const AMBER_BG = "FBF0DA";
const RED = "A32E23";
const RED_BG = "FBE0DE";
const NA_BG = "F0F0EE";
const NA_COLOR = "898781";

const FONT = "Arial";
const logoBuffer = fs.readFileSync("./assets/logo_header.png");
const fotoMotor = fs.readFileSync("./assets/foto_motor.jpg");
const fotoPneu = fs.readFileSync("./assets/foto_pneu.jpg");
const chartStatusDonut = fs.readFileSync("./output/chart_status_donut.png");
const chartCategoriasBar = fs.readFileSync("./output/chart_categorias_bar.png");

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
function metricCard(label, value, width, color) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: "F6F8FB" },
    margins: { top: 140, bottom: 140, left: 140, right: 140 },
    children: [
      new Paragraph({ children: [new TextRun({ text: label, size: 19, color: GRAY, font: FONT })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: value, size: 34, bold: true, color: color || BLUE, font: FONT })] }),
    ],
  });
}
function metricsRow(items) {
  const w = Math.floor(9000 / items.length);
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    rows: [new TableRow({ children: items.map(([l, v, c]) => metricCard(l, v, w, c)) })],
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
function statusBadgeCell(status, width) {
  const map = {
    "Conforme": [GREEN_BG, GREEN],
    "Não conforme": [AMBER_BG, AMBER],
    "Crítico": [RED_BG, RED],
    "Não se aplica": [NA_BG, NA_COLOR],
  };
  const [bg, fg] = map[status] || [NA_BG, NA_COLOR];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: bg },
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text: status, size: 20, color: fg, font: FONT, bold: true })] })],
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
function checklistTable(rows, widths) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: ["Categoria", "Item", "Status"].map((h, i) => tableHeaderCell(h, widths[i])) }),
      ...rows.map((r, ri) => new TableRow({
        children: [
          tableCell(r[0], widths[0], ri % 2 === 1 ? { fill: "F6F8FB" } : {}),
          tableCell(r[1], widths[1], ri % 2 === 1 ? { fill: "F6F8FB" } : {}),
          statusBadgeCell(r[2], widths[2]),
        ],
      })),
    ],
  });
}
function criticosTable(rows, widths) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: ["Categoria", "Item", "Status", "Observação"].map((h, i) => tableHeaderCell(h, widths[i])) }),
      ...rows.map((r) => new TableRow({
        children: [
          tableCell(r[0], widths[0]),
          tableCell(r[1], widths[1]),
          statusBadgeCell(r[2], widths[2]),
          tableCell(r[3], widths[3]),
        ],
      })),
    ],
  });
}
function spacer(h = 160) { return new Paragraph({ text: "", spacing: { after: h } }); }
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
      new Paragraph({
        children: [new ImageRun({ data: logoBuffer, transformation: { width: 200, height: 85 }, type: "png" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "RELATÓRIO DE CHECKLIST DE MANUTENÇÃO", bold: true, size: 30, color: BLUE, font: FONT })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Colhedora Frota 12 · John Deere S540 · Inspeção em 04/08/2026", size: 20, color: GRAY, font: FONT })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 260 },
      }),

      h1("1. Identificação da máquina e da inspeção"),
      infoTable([
        ["Tipo de máquina", "Colhedora de grãos"],
        ["Fabricante", "John Deere"],
        ["Modelo / Frota", "S540 — Frota 12"],
        ["Horímetro do motor", "3.412,5 h"],
        ["Data da inspeção", "04/08/2026"],
        ["Local", "Oficina Fazenda Santa Rita"],
        ["Responsável", "Carlos Mendes"],
        ["Localização (GPS)", "-22.078941, -54.792130"],
      ]),
      spacer(),

      h1("2. Resumo da inspeção"),
      metricsRow([
        ["Conformes", "24", GREEN],
        ["Não conformes", "2", AMBER],
        ["Críticos", "1", RED],
        ["Não se aplica", "3", NA_COLOR],
      ]),
      spacer(),

      h1("3. Painel visual"),
      imagePairRow(chartStatusDonut, chartCategoriasBar, 320, 198, 300, 220),
      spacer(300),
      new Paragraph({ children: [new PageBreak()] }),

      h1("4. Itens críticos e não conformes"),
      criticosTable(
        [
          ["Rodados", "Desgaste dos pneus ou esteiras", "Crítico", "Pneu traseiro direito com desgaste irregular e corte visível na banda de rodagem — risco de estouro."],
          ["Sistema hidráulico", "Mangueiras e conexões", "Não conforme", "Pequeno vazamento na conexão do cilindro da plataforma, sem gotejamento constante."],
          ["Motor", "Filtro de ar", "Não conforme", "Filtro com acúmulo de poeira acima do recomendado, ainda dentro do prazo de troca."],
        ],
        [1800, 3400, 1600, 4200]
      ),
      spacer(),

      h1("5. Fotos registradas"),
      new Table({
        width: { size: 9000, type: WidthType.DXA },
        columnWidths: [4500, 4500],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4500, type: WidthType.DXA },
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                children: [
                  new Paragraph({ children: [new ImageRun({ data: fotoMotor, transformation: { width: 260, height: 195 }, type: "jpg" })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [new TextRun({ text: "Motor — Nível de óleo (Conforme)", size: 16, color: GRAY, font: FONT })], alignment: AlignmentType.CENTER, spacing: { before: 60 } }),
                ],
              }),
              new TableCell({
                width: { size: 4500, type: WidthType.DXA },
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                children: [
                  new Paragraph({ children: [new ImageRun({ data: fotoPneu, transformation: { width: 260, height: 195 }, type: "jpg" })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [new TextRun({ text: "Rodados — Desgaste do pneu (Crítico)", size: 16, color: GRAY, font: FONT })], alignment: AlignmentType.CENTER, spacing: { before: 60 } }),
                ],
              }),
            ],
          }),
        ],
      }),
      spacer(),

      h1("6. Checklist completo"),
      checklistTable(
        [
          ["Motor", "Nível de óleo do motor", "Conforme"],
          ["Motor", "Filtro de óleo", "Conforme"],
          ["Motor", "Filtro de ar", "Não conforme"],
          ["Motor", "Correias", "Conforme"],
          ["Motor", "Radiador / arrefecimento", "Conforme"],
          ["Motor", "Vazamentos aparentes", "Conforme"],
          ["Sistema hidráulico", "Nível de fluido hidráulico", "Conforme"],
          ["Sistema hidráulico", "Mangueiras e conexões", "Não conforme"],
          ["Sistema hidráulico", "Cilindros hidráulicos", "Conforme"],
          ["Sistema hidráulico", "Vazamentos", "Conforme"],
          ["Plataforma de corte", "Facas / navalhas de corte", "Conforme"],
          ["Plataforma de corte", "Molinete", "Conforme"],
          ["Rodados", "Pressão / estado dos pneus", "Conforme"],
          ["Rodados", "Desgaste dos pneus ou esteiras", "Crítico"],
          ["Rodados", "Rolamentos e cubos", "Conforme"],
          ["Cabine", "Cintos de segurança", "Conforme"],
          ["Cabine", "Extintor de incêndio", "Conforme"],
          ["Segurança", "Buzina de ré", "Conforme"],
        ],
        [2400, 4200, 2400]
      ),
      spacer(200),

      new Paragraph({
        children: [new TextRun({ text: "Relatório gerado automaticamente pelo sistema Nempa Tech de Checklist de Manutenção.", italics: true, size: 16, color: GRAY, font: FONT })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("./output/Exemplo_Relatorio_Manutencao.docx", buffer);
  console.log("done");
});
