const notesGrid=document.getElementById('notesGrid');
const createNoteForm=document.getElementById('createNoteForm');
const chatForm=document.getElementById('chatForm');
const chatMessages=document.getElementById('chatMessages');
const userMessage=document.getElementById('userMessage');

const noteModal=document.getElementById('noteModal');
const modalTitle=document.getElementById('modalTitle');
const modalContent=document.getElementById('modalContent');
const modalDate=document.getElementById('modalDate');
const closeModal=document.getElementById('closeModal');

function formatText(text){
text=text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
text=text.replace(/\n/g,'<br>');
return text;
}

function getTitle(text){
const firstLine=text.split('\n')[0];
return firstLine.replace(/\*\*/g,'').substring(0,50)+(firstLine.length>50?'...':'');
}

function getContent(text){
const lines=text.split('\n');
return lines.slice(1).join('\n').trim();
}

function formatDate(date){
const options={year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'};
return new Date(date).toLocaleDateString('en-US',options);
}

async function fetchNotes(){
try{
const response=await fetch('http://localhost:5000/api/notes');
if(!response.ok)throw new Error('Failed to fetch notes');
const notes=await response.json();
displayNotes(notes);
}catch(error){
console.error(error);
showError('Failed to load notes');
}
}

function displayNotes(notes){
if(!notes||notes.length===0){
notesGrid.innerHTML=`<div class="empty-state"><p>No notes yet. Create your first note!</p></div>`;
return;
}

notesGrid.innerHTML=notes.map(note=>{
const title=getTitle(note.text);
const content=getContent(note.text);

return `
<div class="note-card" data-text="${escapeHtml(note.text)}" data-date="${note.createdAt}">
<h3 class="note-title">${escapeHtml(title)}</h3>
<div class="note-content">${formatText(escapeHtml(content||note.text))}</div>
<div class="note-date">${formatDate(note.createdAt)}</div>
<button class="delete-note-btn" data-note-id="${note._id}">
<i class="fas fa-trash"></i>
</button>
</div>`;
}).join('');

const deleteButtons=notesGrid.querySelectorAll('.delete-note-btn');
deleteButtons.forEach(button=>{
button.addEventListener('click',async e=>{
e.stopPropagation();
const noteId=button.getAttribute('data-note-id');
try{
const response=await fetch(`http://localhost:5000/api/notes/${noteId}`,{method:'DELETE'});
if(response.ok){
await fetchNotes();
showSuccess('Note deleted');
}else showError('Delete failed');
}catch(error){
console.error(error);
showError('Delete failed');
}
});
});

const noteCards=notesGrid.querySelectorAll('.note-card');
noteCards.forEach(card=>{
card.addEventListener('click',()=>{
const fullText=card.dataset.text;
const date=card.dataset.date;
modalTitle.textContent=getTitle(fullText);
modalContent.innerHTML = formatText(escapeHtml(fullText));
modalDate.textContent=formatDate(date);
noteModal.classList.add('show');
});
});
}

createNoteForm.addEventListener('submit',async e=>{
e.preventDefault();
const contentInput=document.getElementById('noteContent');
const submitButton=e.target.querySelector('button');
const content=contentInput.value.trim();
if(!content){showError('Please enter note');return;}

try{
submitButton.disabled=true;
submitButton.textContent='Saving...';
const response=await fetch('http://localhost:5000/api/notes',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({content})
});
if(!response.ok)throw new Error();
contentInput.value='';
await fetchNotes();
showSuccess('Note created');
}catch(error){
console.error(error);
showError('Create failed');
}finally{
submitButton.disabled=false;
submitButton.textContent='Save Note';
}
});

closeModal.addEventListener('click',()=>noteModal.classList.remove('show'));
noteModal.addEventListener('click',e=>{if(e.target===noteModal)noteModal.classList.remove('show');});

function showError(message){showNotification(message,'error');}
function showSuccess(message){showNotification(message,'success');}

function showNotification(message,type){
const notification=document.createElement('div');
notification.className=`notification ${type}`;
notification.textContent=message;
document.body.appendChild(notification);
setTimeout(()=>notification.classList.add('show'),10);
setTimeout(()=>{
notification.classList.remove('show');
setTimeout(()=>notification.remove(),300);
},3000);
}

function escapeHtml(unsafe){
return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

fetchNotes();