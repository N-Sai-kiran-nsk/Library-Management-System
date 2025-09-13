// books.js

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  const bookTableBody = document.getElementById('bookTableBody');

  let books = JSON.parse(localStorage.getItem('books')) || [];

  function renderBooks() {
    bookTableBody.innerHTML = '';
    books.forEach((book, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.status || 'Available'}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      bookTableBody.appendChild(tr);
    });
  }

  function resetForm() {
    bookForm.reset();
    bookForm.querySelector('#book-id').value = '';
  }

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = bookForm.querySelector('#book-id').value;
    const title = bookForm.querySelector('#title').value.trim();
    const author = bookForm.querySelector('#author').value.trim();
    const isbn = bookForm.querySelector('#isbn').value.trim();

    if (!title || !author || !isbn) {
      alert('Please fill in all fields');
      return;
    }

    if (id) {
      // Edit existing book
      books[id] = { ...books[id], title, author, isbn };
    } else {
      // Add new book
      books.push({ title, author, isbn, status: 'Available' });
    }

    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
    resetForm();
  });

  bookTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const idx = e.target.dataset.index;
      const book = books[idx];
      bookForm.querySelector('#book-id').value = idx;
      bookForm.querySelector('#title').value = book.title;
      bookForm.querySelector('#author').value = book.author;
      bookForm.querySelector('#isbn').value = book.isbn;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this book?')) {
        const idx = e.target.dataset.index;
        books.splice(idx, 1);
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
      }
    }
  });

  renderBooks();
});