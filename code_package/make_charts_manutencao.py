import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

BLUE = "#0038DC"
CYAN = "#00B4FC"
GRAY = "#52514E"
LIGHT_GRAY = "#D9D9D6"
GREEN = "#1E7A34"
AMBER = "#8A5A00"
RED = "#A32E23"
NA = "#B7B5AC"

plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['text.color'] = "#0B0B0B"
plt.rcParams['font.size'] = 13

OUT = "./output"

# ---------- 1. Donut de status geral ----------
labels = ["Conforme", "Não conforme", "Crítico", "Não se aplica"]
values = [24, 2, 1, 3]
colors = [GREEN, AMBER, RED, NA]

fig, ax = plt.subplots(figsize=(7.4, 3.6))
wedges, texts, autotexts = ax.pie(
    values, colors=colors, startangle=90, counterclock=False,
    wedgeprops=dict(width=0.4, edgecolor='white'),
    autopct=lambda p: f'{p:.0f}%' if p > 4 else '', pctdistance=0.8,
    textprops={'fontsize': 13, 'color': 'white', 'fontweight': 'bold'}
)
ax.text(0, 0, f"{sum(values)}\nitens", ha='center', va='center', fontsize=20, fontweight='bold', color="#0B0B0B")
ax.legend(wedges, [f"{l} ({v})" for l, v in zip(labels, values)],
          loc='center left', bbox_to_anchor=(1.05, 0.5), fontsize=13, frameon=False,
          handletextpad=0.6, labelspacing=0.9)
plt.title("Status geral da inspeção", fontsize=17, fontweight='bold', color="#0B0B0B", loc='center', pad=14)
plt.subplots_adjust(right=0.55)
plt.savefig(f"{OUT}/chart_status_donut.png", dpi=200, bbox_inches='tight', transparent=True)
plt.close()

# ---------- 2. Barras horizontais: itens por categoria, coloridas por pior status ----------
categorias = ["Segurança", "Cabine", "Sistema elétrico", "Elevadores e roscas",
              "Sistema de limpeza", "Trilha e separação", "Plataforma de corte",
              "Rodados", "Sistema hidráulico", "Motor"]
totais =     [3, 4, 3, 3, 2, 3, 4, 3, 4, 6]
pior_status = ["ok", "ok", "ok", "ok", "ok", "ok", "ok", "crit", "nconf", "nconf"]
cor_map = {"ok": GREEN, "nconf": AMBER, "crit": RED}
cores_barras = [cor_map[s] for s in pior_status]

fig, ax = plt.subplots(figsize=(8.2, 6.2))
bars = ax.barh(categorias, totais, color=cores_barras, height=0.6, zorder=3)
for b, v in zip(bars, totais):
    ax.text(v + 0.15, b.get_y() + b.get_height()/2, str(v), va='center', fontsize=13, color="#0B0B0B")
ax.set_xlabel("Itens verificados", fontsize=14, color=GRAY)
ax.set_xlim(0, 7.6)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color(LIGHT_GRAY)
ax.spines['bottom'].set_color(LIGHT_GRAY)
ax.tick_params(colors=GRAY, labelsize=13)
ax.grid(axis='x', color=LIGHT_GRAY, linewidth=0.6, zorder=0)
plt.title("Itens verificados por categoria", fontsize=17, fontweight='bold', color="#0B0B0B", loc='center', pad=14)

# legenda manual de cores — colocada ABAIXO do gráfico para não sobrepor as barras
from matplotlib.patches import Patch
legend_elems = [
    Patch(facecolor=GREEN, label='Sem pendências'),
    Patch(facecolor=AMBER, label='Não conformidade'),
    Patch(facecolor=RED, label='Item crítico'),
]
ax.legend(handles=legend_elems, loc='upper center', bbox_to_anchor=(0.5, -0.12),
          ncol=3, fontsize=12, frameon=False)
plt.tight_layout()
plt.savefig(f"{OUT}/chart_categorias_bar.png", dpi=200, bbox_inches='tight', transparent=True)
plt.close()

print("charts done")
