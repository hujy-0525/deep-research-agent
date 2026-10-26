'use strict';
const baseRender=render;
render=function(){
  baseRender();
  if(!job)return;
  const agents=document.querySelector('#agents');
  const quality=document.querySelector('#quality');
  agents.innerHTML=(job.agents||[]).map((a,i)=>`<article class="agent ${esc(a.status)}"><span>${String(i+1).padStart(2,'0')}</span><div><b>${esc(a.name)}</b><small>${esc(a.role)}</small><em>${esc(a.message||'等待执行')}</em></div><i>${a.status==='completed'?'✓':a.status==='running'?'●':'○'}</i></article>`).join('')||'<p class="muted">等待建立 Agent 协作状态…</p>';
  const q=job.planQuality;
  quality.innerHTML=q?`<div class="quality"><b>计划质量门</b><span>覆盖 ${q.coverage==='passed'?'✓':'!'}</span><span>逻辑 ${q.logic==='passed'?'✓':'!'}</span><span>查询 ${q.queryQuality==='passed'?'✓':'△'}</span></div>`:'';
};
