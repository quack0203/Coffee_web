document.addEventListener('DOMContentLoaded', function() {
    const detailsList = document.querySelectorAll('details.inline-detail');
  
    detailsList.forEach(detail => {
      const summary = detail.querySelector('summary');
  
      // 移除 native focus outline
      summary.style.outline = 'none';
  
      // 攔截原生 toggle
      summary.addEventListener('click', ev => {
        ev.preventDefault();
  
        const willOpen = !detail.hasAttribute('open');
  
        // 如果要打開，就先把其他關掉
        if (willOpen) {
          detailsList.forEach(other => {
            if (other !== detail && other.hasAttribute('open')) {
              other.removeAttribute('open');
            }
          });
        }
  
        // 切換自己
        if (willOpen) detail.setAttribute('open', '');
        else detail.removeAttribute('open');
      });
    });
  });
  