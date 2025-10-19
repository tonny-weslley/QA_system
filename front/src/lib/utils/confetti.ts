// Confetti animation utility
export const triggerConfetti = () => {
  // Criar elementos de confete
  const colors = ['#6B21A8', '#F97316', '#10B981', '#EF4444', '#FFD700'];
  const confettiCount = 50;
  const container = document.body;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
      z-index: 9999;
      pointer-events: none;
    `;

    container.appendChild(confetti);

    // Remover após animação
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
};

// Adicionar CSS para animação de confete
export const injectConfettiStyles = () => {
  if (document.getElementById('confetti-styles')) return;

  const style = document.createElement('style');
  style.id = 'confetti-styles';
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        top: -10px;
        opacity: 1;
      }
      100% {
        top: 100vh;
        opacity: 0;
        transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
      }
    }
  `;
  document.head.appendChild(style);
};

// Inicializar estilos de confete
if (typeof window !== 'undefined') {
  injectConfettiStyles();
}
