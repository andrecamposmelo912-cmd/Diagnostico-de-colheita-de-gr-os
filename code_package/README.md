# Geração de relatórios — Nempa Tech

Estes scripts geram os relatórios em Word (.docx), com gráficos incluídos, a partir de dados de exemplo. Servem de base para depois conectar aos dados reais dos apps.

## O que tem aqui

```
assets/
  logo_header.png       ← logo da Nempa Tech usado no cabeçalho
  foto_motor.jpg        ← foto de exemplo (relatório de manutenção)
  foto_pneu.jpg         ← foto de exemplo (relatório de manutenção)

make_charts_eficiencia.py     ← gera os gráficos (PNG) do relatório de Eficiência
make_charts_manutencao.py     ← gera os gráficos (PNG) do relatório de Manutenção
build_eficiencia_report.js    ← monta o Word do relatório de Eficiência
build_manutencao_report.js    ← monta o Word do relatório de Manutenção

output/                        ← pasta onde os gráficos e os .docx finais são salvos
```

## Pré-requisitos

- **Python 3** com as bibliotecas `matplotlib` e `Pillow`:
  ```
  pip install matplotlib pillow
  ```
- **Node.js** com a biblioteca `docx`:
  ```
  npm install docx
  ```

## Como rodar

Na pasta onde estão esses arquivos:

```bash
# 1. Gerar os gráficos (precisa rodar antes dos scripts de Word)
python3 make_charts_eficiencia.py
python3 make_charts_manutencao.py

# 2. Montar os documentos Word
node build_eficiencia_report.js
node build_manutencao_report.js
```

Os arquivos finais aparecem em `output/`:
- `Exemplo_Relatorio_Eficiencia.docx`
- `Exemplo_Relatorio_Manutencao.docx`

## Dados de exemplo

Hoje os dois scripts `build_*.js` têm os dados **fixos no código** (uma fazenda, uma inspeção fictícia) — é assim que criamos os exemplos que você já viu. O próximo passo (ainda pendente) é conectar isso aos dados reais que os apps coletam, para gerar o relatório automaticamente a partir do que a equipe preencheu.

## Cores e fonte da marca usadas

- Azul principal: `#0038DC`
- Azul secundário (gradiente): `#00B4FC`
- Fonte: Arial (nos documentos Word, por compatibilidade — a Montserrat oficial é usada nos apps web)

## Observação sobre o relatório de Manutenção

O relatório de **Eficiência** já recebeu os últimos ajustes visuais (cabeçalho centralizado, rodapé com data, gráficos centralizados e proporcionais). O de **Manutenção** ainda está na versão anterior a esses ajustes — está na fila para receber as mesmas melhorias.
