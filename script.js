// script.js - uses Fetch API to interact with backend /students endpoints
const API_BASE = ''; // relative, since server serves static and API under same origin

const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');
const cgpaInput = document.getElementById('cgpa');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentsBody = document.getElementById('studentsBody');
const formTitle = document.getElementById('formTitle');

let editingId = null;

async function fetchStudents(){
  const res = await fetch(API_BASE + '/students');
  const data = await res.json();
  studentsBody.innerHTML = '';
  data.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.cgpa}</td>
      <td>
        <button class="action-btn" onclick="editStudent(${s.id})">Edit</button>
        <button class="action-btn" onclick="deleteStudent(${s.id})">Delete</button>
      </td>
    `;
    studentsBody.appendChild(tr);
  });
}

async function addStudent(){
  const id = Number(idInput.value);
  const name = nameInput.value.trim();
  const cgpa = cgpaInput.value.trim();
  if(!id || !name || !cgpa){ alert('Fill all fields'); return; }
  const res = await fetch(API_BASE + '/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, cgpa })
  });
  if(res.ok){ clearForm(); fetchStudents(); } else {
    const e = await res.json(); alert(e.message || 'Error');
  }
}

async function editStudent(id){
  const res = await fetch(API_BASE + '/students/' + id);
  if(!res.ok){ alert('Not found'); return; }
  const s = await res.json();
  editingId = s.id;
  idInput.value = s.id; idInput.disabled = true;
  nameInput.value = s.name; cgpaInput.value = s.cgpa;
  submitBtn.textContent = 'Update';
  cancelBtn.style.display = 'inline-block';
  formTitle.textContent = 'Edit Student';
}

async function updateStudent(){
  const name = nameInput.value.trim();
  const cgpa = cgpaInput.value.trim();
  const res = await fetch(API_BASE + '/students/' + editingId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, cgpa })
  });
  if(res.ok){ clearForm(); fetchStudents(); } else {
    const e = await res.json(); alert(e.message || 'Error');
  }
}

async function deleteStudent(id){
  if(!confirm('Delete student?')) return;
  const res = await fetch(API_BASE + '/students/' + id, { method: 'DELETE' });
  if(res.ok) fetchStudents(); else { const e = await res.json(); alert(e.message || 'Error'); }
}

function clearForm(){
  editingId = null;
  idInput.value = ''; idInput.disabled = false;
  nameInput.value = ''; cgpaInput.value = '';
  submitBtn.textContent = 'Add';
  cancelBtn.style.display = 'none';
  formTitle.textContent = 'Add Student';
}

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(editingId) updateStudent(); else addStudent();
});
cancelBtn.addEventListener('click', (e) => { e.preventDefault(); clearForm(); });

// initial load
fetchStudents();
