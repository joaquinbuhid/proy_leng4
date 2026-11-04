import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

export const COLORS = { primary: '#7C5CFF', accent: '#2EE6A8', amber: '#FFB547', pink: '#FF6B9A', sky: '#4CC9F0' };

export function baseOptions(theme) {
  const text = theme === 'dark' ? '#A3ACC2' : '#5B6478';
  const grid = theme === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  return {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 1200, easing: 'easeOutQuart' },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { color: text, usePointStyle: true, boxWidth: 8, font: { family: 'Inter' } } },
      tooltip: { backgroundColor: '#121829', borderColor: 'rgba(124,92,255,.4)', borderWidth: 1, padding: 10, titleFont: { family: 'Space Grotesk' } },
    },
    scales: {
      x: { ticks: { color: text, maxTicksLimit: 8 }, grid: { display: false } },
      y: { ticks: { color: text, precision: 0 }, grid: { color: grid }, beginAtZero: true },
    },
  };
}

export const gradientFill = (color) => (ctx) => {
  const { chart } = ctx;
  if (!chart.chartArea) return color + '33';
  const g = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom);
  g.addColorStop(0, color + '66');
  g.addColorStop(1, color + '00');
  return g;
};
