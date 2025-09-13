document.addEventListener('DOMContentLoaded', () => {
  const memberSelect = document.getElementById('memberSelect');
  const bookSelect = document.getElementById('bookSelect');
  const issueForm = document.getElementById('issueForm');
  const issueTableBody = document.getElementById('issueTableBody');

  let books = JSON.parse(localStorage.getItem('books')) || [];
  let members = JSON.parse(localStorage.getItem('members')) || [];
  let issuedBooks = JSON.parse(localStorage.getItem('issuedBooks')) || [];

  // Populate member and book dropdowns
  function populateDropdowns() {
    // Members dropdown
    memberSelect.innerHTML = '<option value="">-- Select Member --</option>';
    members.forEach((member, i) => {
      memberSelect.innerHTML += `<option value="${i}">${member.name} (${member.membershipId})</option>`;
    });

    // Books dropdown - only show available books
    bookSelect.innerHTML = '<option value="">-- Select Book --</option>';
    books.forEach((book, i) => {
      if (book.status === 'Available') {
        bookSelect.innerHTML += `<option value="${i}">${book.title} by ${book.author}</option>`;
      }
    });
  }

  // Render issued books table
  function renderIssuedBooks() {
    issueTableBody.innerHTML = '';

    if (issuedBooks.length === 0) {
      issueTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No books currently issued</td></tr>`;
      return;
    }

    issuedBooks.forEach((record, index) => {
      const book = books[record.bookIndex];
      const member = members[record.memberIndex];

      const status = record.returnDate ? 'Returned' : 'Issued';
      const returnBtn = !record.returnDate
        ? `<button class="return-btn" data-index="${index}">Return</button>`
        : '';

      issueTableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${book.title}</td>
          <td>${member.name}</td>
          <td>${record.issueDate}</td>
          <td>${record.returnDate || '-'}</td>
          <td>${status}</td>
          <td>${returnBtn}</td>
        </tr>
      `;
    });
  }

  // Issue form submit handler
  issueForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const memberIndex = memberSelect.value;
    const bookIndex = bookSelect.value;

    if (memberIndex === '' || bookIndex === '') {
      alert('Please select both member and book.');
      return;
    }

    // Mark book as issued
    books[bookIndex].status = 'Issued';

    // Add issued book record
    const issueDate = new Date().toLocaleDateString();
    issuedBooks.push({
      memberIndex: Number(memberIndex),
      bookIndex: Number(bookIndex),
      issueDate,
      returnDate: null,
    });

    // Save to localStorage
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));

    // Refresh UI
    populateDropdowns();
    renderIssuedBooks();
    issueForm.reset();

    alert('Book issued successfully!');
  });

  // Return button handler
  issueTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('return-btn')) {
      const idx = e.target.dataset.index;
      const record = issuedBooks[idx];

      if (record.returnDate) {
        alert('This book is already returned.');
        return;
      }

      // Set return date to today
      record.returnDate = new Date().toLocaleDateString();

      // Update book status back to Available
      books[record.bookIndex].status = 'Available';

      // Save changes
      localStorage.setItem('books', JSON.stringify(books));
      localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));

      renderIssuedBooks();
      populateDropdowns();

      alert('Book returned successfully!');
    }
  });

  // Initialize dropdowns and table on load
  populateDropdowns();
  renderIssuedBooks();
});