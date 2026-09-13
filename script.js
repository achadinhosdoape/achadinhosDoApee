const grid=document.getElementById('productGrid');
const search=document.getElementById('search');
const clear=document.getElementById('clearSearch');
const count=document.getElementById('resultCount');
const empty=document.getElementById('emptyState');
let products=[], selected='Todos';

fetch('products.json').then(r=>r.json()).then(data=>{products=data;render()})
.catch(()=>{count.textContent='Erro ao carregar produtos';});

function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function filtered(){
 const term=search.value.trim().toLowerCase();
 return products.filter(p=>{
   const cat=selected==='Todos'||p.category.toLowerCase()===selected.toLowerCase();
   const text=!term||p.name.toLowerCase().includes(term)||p.id.toLowerCase().includes(term)||p.category.toLowerCase().includes(term);
   return cat&&text;
 });
}
function render(){
 const list=filtered();
 count.textContent=`${list.length} ${list.length===1?'achadinho':'achadinhos'}`;
 empty.classList.toggle('hidden',!!list.length);
 grid.innerHTML=list.map(p=>`
 <article class="card" data-id="${esc(p.id)}">
  <div class="card-photo"><img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.parentElement.innerHTML='<div class=&quot;placeholder&quot;>Adicione a foto:<br>${esc(p.image)}</div>'"></div>
  <div class="card-body"><span class="tag">${esc(p.category)}</span><h3>${esc(p.name)}</h3><p>ID: ${esc(p.id)}</p><button>Ver produto →</button></div>
 </article>`).join('');
 document.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>openModal(products.find(p=>p.id===c.dataset.id))));
}
document.querySelectorAll('.category').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));
 b.classList.add('active');selected=b.dataset.category;render();
}));
search.addEventListener('input',()=>{clear.style.display=search.value?'block':'none';render()});
clear.addEventListener('click',()=>{search.value='';clear.style.display='none';search.focus();render()});

const modal=document.getElementById('modal');
function openModal(p){
 document.getElementById('modalImage').src=p.image;
 document.getElementById('modalImage').alt=p.name;
 document.getElementById('modalCategory').textContent=p.category;
 document.getElementById('modalTitle').textContent=p.name;
 document.getElementById('modalId').textContent='ID: '+p.id;
 document.getElementById('modalLink').href=p.link;
 modal.classList.remove('hidden');document.body.style.overflow='hidden';
}
function closeModal(){modal.classList.add('hidden');document.body.style.overflow=''}
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
