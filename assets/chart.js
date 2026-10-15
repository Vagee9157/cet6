/* 图表作文用的小图：柱状图 + 饼图，输出 SVG 字符串。颜色走 class（.ch-c0…），站内跟主题、打印用灰阶。 */
window.writingChart = (c) => {
  const esc = (t) => String(t).replace(/[&<>"']/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
  const parts = [];
  if (c.bar) {
    const d = c.bar.data, W = 300, H = 210, L = 34, B = 30, T = c.bar.unit ? 44 : 30, max = Math.ceil(Math.max(...d.map((x) => x[1])) / 2) * 2;
    const bw = (W - L - 20) / d.length * 0.55, gap = (W - L - 20) / d.length;
    const y = (v) => H - B - (v / max) * (H - B - T);
    let g = `<text class="ch-t" x="${W / 2}" y="16" text-anchor="middle">${esc(c.bar.title)}</text>`;
    for (let v = 0; v <= max; v += max / 4) g += `<line class="ch-grid" x1="${L}" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}"/><text class="ch-ax" x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${+v.toFixed(1)}</text>`;
    d.forEach(([k, v], i) => { const x = L + gap * i + (gap - bw) / 2; g += `<rect class="ch-c0" x="${x}" y="${y(v)}" width="${bw}" height="${y(0) - y(v)}" rx="2"/><text class="ch-v" x="${x + bw / 2}" y="${y(v) - 5}" text-anchor="middle">${v}</text><text class="ch-ax" x="${x + bw / 2}" y="${H - B + 16}" text-anchor="middle">${esc(k)}</text>`; });
    // 单位放在纵轴上方、标题下面一行，不再跟标题和顶部刻度挤在一起
    if (c.bar.unit) g += `<text class="ch-ax ch-unit" x="${L - 6}" y="${T - 14}" text-anchor="start">(${esc(c.bar.unit)})</text>`;
    parts.push(`<svg class="wchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.bar.title)}">${g}</svg>`);
  }
  if (c.pie) {
    const d = c.pie.data, tot = d.reduce((a, x) => a + x[1], 0), cx = 92, cy = 112, r = 70;
    let a0 = -Math.PI / 2, g = `<text class="ch-t" x="150" y="16" text-anchor="middle">${esc(c.pie.title)}</text>`;
    d.forEach(([k, v], i) => {
      const a1 = a0 + (v / tot) * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
      const p = (a) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`, m = (a0 + a1) / 2;
      g += `<path class="ch-c${i % 4}" d="M${cx} ${cy} L${p(a0)} A${r} ${r} 0 ${big} 1 ${p(a1)} Z"/>`;
      g += `<text class="ch-pv" x="${cx + r * 0.62 * Math.cos(m)}" y="${cy + r * 0.62 * Math.sin(m) + 4}" text-anchor="middle">${v}%</text>`;
      g += `<rect class="ch-c${i % 4}" x="180" y="${62 + i * 24}" width="12" height="12" rx="2"/><text class="ch-ax" x="198" y="${72 + i * 24}">${esc(k)}</text>`;
      a0 = a1;
    });
    parts.push(`<svg class="wchart" viewBox="0 0 300 210" role="img" aria-label="${esc(c.pie.title)}">${g}</svg>`);
  }
  return `<div class="wcharts">${parts.join('')}</div>`;
};
