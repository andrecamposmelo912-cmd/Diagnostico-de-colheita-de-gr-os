import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

BLUE = "#0038DC"
CYAN = "#00B4FC"
GRAY = "#52514E"
LIGHT_GRAY = "#D9D9D6"
GREEN = "#1E7A34"
AMBER = "#8A5A00"
RED = "#A32E23"
BG = "#F6F8FB"

plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['text.color'] = "#0B0B0B"
plt.rcParams['axes.edgecolor'] = LIGHT_GRAY
plt.rcParams['font.size'] = 13

OUT = "./output"

# ---------- 1. Gauge de Disponibilidade Mecânica (DM%) ----------
def make_gauge(value, path, label):
    fig, ax = plt.subplots(figsize=(4.4, 3.6), subplot_kw={'aspect': 'equal'})
    ax.pie([1], radius=1, colors=[LIGHT_GRAY],
           wedgeprops=dict(width=0.30, edgecolor='white'))
    ax.pie([value, 100 - value], radius=1, colors=[BLUE, 'none'], startangle=90, counterclock=False,
           wedgeprops=dict(width=0.30, edgecolor='white'))
    ax.text(0, 0.05, f"{value:.0f}%", ha='center', va='center', fontsize=30, fontweight='bold', color=BLUE)
    ax.text(0, -1.38, label, ha='center', va='center', fontsize=16, color=GRAY)
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.6, 1.2)
    plt.axis('off')
    plt.savefig(path, dpi=200, bbox_inches='tight', transparent=True)
    plt.close()

make_gauge(85, f"{OUT}/chart_dm_gauge.png", "Disponibilidade Mecânica")

# ---------- 2. Donut de paradas por causa ----------
causas = ["Climática", "Aguardando\ntransbordo", "Mecânica", "Abastecimento", "Descarregamento"]
minutos = [40, 20, 15, 15, 8]
cores = [CYAN, BLUE, RED, AMBER, "#7A8AA0"]

fig, ax = plt.subplots(figsize=(7.4, 3.6))
wedges, texts, autotexts = ax.pie(
    minutos, colors=cores, startangle=90, counterclock=False,
    wedgeprops=dict(width=0.4, edgecolor='white'),
    autopct=lambda p: f'{p:.0f}%', pctdistance=0.8,
    textprops={'fontsize': 13, 'color': 'white', 'fontweight': 'bold'}
)
ax.text(0, 0, f"{sum(minutos)}\nmin", ha='center', va='center', fontsize=20, fontweight='bold', color="#0B0B0B")
ax.legend(wedges, [f"{c} ({m} min)" for c, m in zip(causas, minutos)],
          loc='center left', bbox_to_anchor=(1.05, 0.5), fontsize=13, frameon=False,
          handletextpad=0.6, labelspacing=0.9)
plt.title("Paradas por causa", fontsize=17, fontweight='bold', color="#0B0B0B", loc='left', pad=14)
plt.subplots_adjust(right=0.55)
plt.savefig(f"{OUT}/chart_paradas_donut.png", dpi=200, bbox_inches='tight', transparent=True)
plt.close()

# ---------- 3. Barras: % produtivo por ciclo ----------
ciclos = ["Ciclo 1", "Ciclo 2", "Ciclo 3", "Ciclo 4", "Ciclo 5"]
pct = [85.7, 84.5, 89.3, 80.6, 85.4]

fig, ax = plt.subplots(figsize=(7.6, 3.8))
bars = ax.bar(ciclos, pct, color=BLUE, width=0.55, zorder=3)
media = sum(pct)/len(pct)
ax.axhline(media, color=CYAN, linestyle='--', linewidth=1.8, zorder=2)
ax.text(1.02, media, f"média {media:.1f}%", color="#0B0B0B", fontsize=13, ha='left', va='center',
        transform=ax.get_yaxis_transform())
for b, v in zip(bars, pct):
    ax.text(b.get_x()+b.get_width()/2, v+2.5, f"{v:.1f}%", ha='center', fontsize=13, color="#0B0B0B")
ax.set_ylim(0, 105)
ax.set_ylabel("% tempo produtivo", fontsize=14, color=GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color(LIGHT_GRAY)
ax.spines['bottom'].set_color(LIGHT_GRAY)
ax.tick_params(colors=GRAY, labelsize=13)
ax.grid(axis='y', color=LIGHT_GRAY, linewidth=0.6, zorder=0)
plt.title("Tempo produtivo por ciclo", fontsize=17, fontweight='bold', color="#0B0B0B", loc='center', pad=14)
plt.tight_layout()
plt.savefig(f"{OUT}/chart_ciclos_bar.png", dpi=200, bbox_inches='tight', transparent=True)
plt.close()

# ---------- 4. Barras: duração da descarga do trator por repetição ----------
reps = ["Rep. 1", "Rep. 2", "Rep. 3", "Rep. 4", "Rep. 5"]
segs = [105, 112, 98, 110, 101]
labels = ["1:45", "1:52", "1:38", "1:50", "1:41"]

fig, ax = plt.subplots(figsize=(7.6, 3.8))
bars = ax.bar(reps, segs, color=CYAN, width=0.55, zorder=3)
avg = sum(segs)/len(segs)
ax.axhline(avg, color=BLUE, linestyle='--', linewidth=1.8, zorder=2)
ax.text(1.02, avg, "média 1:45", color="#0B0B0B", fontsize=13, ha='left', va='center',
        transform=ax.get_yaxis_transform())
for b, lab in zip(bars, labels):
    ax.text(b.get_x()+b.get_width()/2, b.get_height()+4, lab, ha='center', fontsize=13, color="#0B0B0B")
ax.set_ylabel("Duração (segundos)", fontsize=14, color=GRAY)
ax.set_ylim(0, 140)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color(LIGHT_GRAY)
ax.spines['bottom'].set_color(LIGHT_GRAY)
ax.tick_params(colors=GRAY, labelsize=13)
ax.grid(axis='y', color=LIGHT_GRAY, linewidth=0.6, zorder=0)
plt.title("Tempo de descarga do trator (bazuca)", fontsize=17, fontweight='bold', color="#0B0B0B", loc='center', pad=14)
plt.tight_layout()
plt.savefig(f"{OUT}/chart_descarga_bar.png", dpi=200, bbox_inches='tight', transparent=True)
plt.close()

print("charts done")
