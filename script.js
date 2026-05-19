(function(){
  const displayEl = document.getElementById('display');
  const previewEl = document.getElementById('preview');
  const keys = document.querySelector('.keys');

  let expr = '';

  function sanitizeExpression(s){
    return s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
  }

  function update(){
    previewEl.textContent = expr || '';
    try{
      const v = expr ? eval(sanitizeExpression(expr)) : '';
      displayEl.textContent = (v===undefined || v===null || v==='') ? '0' : String(Number.isFinite(v) ? v : 'Error');
    }catch(e){
      displayEl.textContent = 'Error';
    }
  }

  function append(char){
    if(/[0-9.]/.test(char)){
      // prevent multiple dots in same number
      const parts = expr.split(/[^0-9.]/);
      const last = parts[parts.length-1];
      if(char === '.' && last.includes('.')) return;
      expr += char;
    } else if(/[+\-*/]/.test(char)){
      if(expr === '') return;
      if(/[+\-*/]$/.test(expr)){
        expr = expr.slice(0,-1) + char;
      } else {
        expr += char;
      }
    }
    update();
  }

  keys.addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value || btn.textContent.trim();

    if(action === 'clear'){
      expr=''; update();
      return;
    }
    if(action === 'back'){
      expr = expr.slice(0,-1); update(); return;
    }
    if(action === 'equals'){
      try{
        const res = eval(sanitizeExpression(expr));
        expr = String(res);
        update();
      }catch(e){ displayEl.textContent='Error'; }
      return;
    }

    if(action === 'op'){
      append(value);
      return;
    }

    // default: number or dot
    append(value);
  });

  // Keyboard support
  window.addEventListener('keydown', (e)=>{
    if(e.key >= '0' && e.key <= '9') { append(e.key); e.preventDefault(); return; }
    if(e.key === '.') { append('.'); e.preventDefault(); return; }
    if(e.key === 'Enter' || e.key === '='){
      e.preventDefault();
      try{ const res = eval(sanitizeExpression(expr)); expr = String(res); update(); } catch(_) { displayEl.textContent='Error' }
      return;
    }
    if(e.key === 'Backspace'){ expr = expr.slice(0,-1); update(); e.preventDefault(); return; }
    if(e.key === 'Escape'){ expr=''; update(); e.preventDefault(); return; }
    if(['+','-','*','/'].includes(e.key)) { append(e.key); e.preventDefault(); return; }
  });

  update();
})();
