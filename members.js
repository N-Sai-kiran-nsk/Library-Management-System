// members.js

document.addEventListener('DOMContentLoaded', () => {
  const memberForm = document.getElementById('memberForm');
  const memberTableBody = document.getElementById('memberTableBody');

  let members = JSON.parse(localStorage.getItem('members')) || [];

  function renderMembers() {
    memberTableBody.innerHTML = '';
    members.forEach((member, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>${member.membershipId}</td>
        <td>${member.joinedDate}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      memberTableBody.appendChild(tr);
    });
  }

  function resetForm() {
    memberForm.reset();
    memberForm.querySelector('#member-id').value = '';
  }

  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = memberForm.querySelector('#member-id').value;
    const name = memberForm.querySelector('#name').value.trim();
    const email = memberForm.querySelector('#email').value.trim();
    const membershipId = memberForm.querySelector('#membershipId').value.trim();
    const joinedDate = memberForm.querySelector('#joinedDate').value;

    if (!name || !email || !membershipId || !joinedDate) {
      alert('Please fill in all fields');
      return;
    }

    if (id) {
      members[id] = { name, email, membershipId, joinedDate };
    } else {
      members.push({ name, email, membershipId, joinedDate });
    }

    localStorage.setItem('members', JSON.stringify(members));
    renderMembers();
    resetForm();
  });

  memberTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const idx = e.target.dataset.index;
      const member = members[idx];
      memberForm.querySelector('#member-id').value = idx;
      memberForm.querySelector('#name').value = member.name;
      memberForm.querySelector('#email').value = member.email;
      memberForm.querySelector('#membershipId').value = member.membershipId;
      memberForm.querySelector('#joinedDate').value = member.joinedDate;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this member?')) {
        const idx = e.target.dataset.index;
        members.splice(idx, 1);
        localStorage.setItem('members', JSON.stringify(members));
        renderMembers();
      }
    }
  });

  renderMembers();
});