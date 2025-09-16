// 과거력 추가
document.getElementById('addPastBtn')?.addEventListener('click', ()=>{
  const list = document.getElementById('pastHistoryList');
  const t = document.createElement('textarea');
  t.placeholder = "예) DM, HTN";
  list.appendChild(t);
  t.focus();
});

// 상태 토글 (+/-)
['pain','td','swelling','bruise','extWound'].forEach(id=>{
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.dataset.state = "-";
  btn.addEventListener('click', ()=>{
    btn.dataset.state = (btn.dataset.state==="-")?"+":"-";
    const label = btn.textContent.split(':')[0];
    btn.textContent = `${label}: ${btn.dataset.state}`;
  });
});

// 보고서 생성 (빈값일 때 괄호/불필요 문자열 출력 안 함)
function makeReport(){
  const v = id => (document.getElementById(id)?.value || '').trim();
  const joinIf = (label, val) => val ? `${label}${val}\n` : '';
  const pasts = [...document.querySelectorAll('#pastHistoryList textarea')]
                  .map(t=>t.value.trim()).filter(Boolean);
  const states = ['pain','td','swelling','bruise','extWound']
      .map(id => document.getElementById(id)?.textContent)
      .filter(Boolean).join(' / ');

  let out = '';
  if (v('sexAgeName')) out += v('sexAgeName') + (v('regNum')? ` (${v('regNum')})` : '') + '\n';
  if (pasts.length) out += `과거력: ${pasts.join(', ')}\n`;
  out += joinIf('복용약: ', v('meds'));
  out += joinIf('Charnley: ', v('charnley'));
  if (v('traumaTime') || v('traumaMechanism')) out += `${v('traumaTime')} ${v('traumaMechanism')}\n`;
  out += joinIf('내원 주소: ', v('chiefComplaint'));
  if (v('fractureSide') || v('fractureSite') || v('aoType')){
    out += `골절 부위: ${[v('fractureSide'), v('fractureSite'), v('aoType')].filter(Boolean).join(' ')}\n`;
  }
  if (states) out += `상태: ${states}\n`;
  if (v('distalCms') || v('labAbnormal') || v('patientStatus')){
    out += `Distal CMS: ${v('distalCms')} / Lab: ${v('labAbnormal')} / Status: ${v('patientStatus')}\n`;
  }
  out += joinIf('기타: ', v('profReport'));

  document.getElementById('reportArea').textContent = out.trim();
}

// 복사
document.getElementById('btnCopy')?.addEventListener('click', async ()=>{
  const text = document.getElementById('reportArea').textContent;
  try{ await navigator.clipboard.writeText(text); alert('복사 완료'); }
  catch{ alert('복사 실패: 길게 눌러 복사하세요'); }
});

// 초기화
document.getElementById('btnClear')?.addEventListener('click', ()=>{
  document.querySelectorAll('input, textarea').forEach(el=> el.value = '');
  document.getElementById('reportArea').textContent = '';
  ['pain','td','swelling','bruise','extWound'].forEach(id=>{
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.dataset.state = '-';
    const label = btn.textContent.split(':')[0];
    btn.textContent = `${label}: -`;
  });
});
