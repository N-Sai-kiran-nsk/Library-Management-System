document.addEventListener('DOMContentLoaded', () => {
  const totalBooksEl = document.getElementById('totalBooks');
  const totalMembersEl = document.getElementById('totalMembers');
  const issuedBooksEl = document.getElementById('issuedBooksCount');
  const availableBooksEl = document.getElementById('availableBooksCount');

  let books = JSON.parse(localStorage.getItem('books')) || [];
  let members = JSON.parse(localStorage.getItem('members')) || [];
  let issuedBooks = JSON.parse(localStorage.getItem('issuedBooks')) || [];

  // Calculate stats
  const totalBooks = books.length;
  const totalMembers = members.length;
  const issuedCount = issuedBooks.filter(r => !r.returnDate).length;
  const availableCount = books.filter(b => b.status === 'Available').length;

  // Display stats
  if (totalBooksEl) totalBooksEl.textContent = totalBooks;
  if (totalMembersEl) totalMembersEl.textContent = totalMembers;
  if (issuedBooksEl) issuedBooksEl.textContent = issuedCount;
  if (availableBooksEl) availableBooksEl.textContent = availableCount;

  // Chart: Book Status Distribution (Available vs Issued)
  const ctxStatus = document.getElementById('bookStatusChart')?.getContext('2d');
  if (ctxStatus) {
    new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: ['Available', 'Issued'],
        datasets: [{
          data: [availableCount, issuedCount],
          backgroundColor: ['#4caf50', '#f44336'],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Book Status Distribution'
          }
        }
      }
    });
  }

  // Chart: Books Issued Over Time (by month)
  const ctxIssuedTime = document.getElementById('booksIssuedTimeChart')?.getContext('2d');
  if (ctxIssuedTime) {
    // Aggregate issue counts by month-year string
    const issuedByMonth = {};

    issuedBooks.forEach(record => {
      const date = new Date(record.issueDate);
      if (isNaN(date)) return; // skip invalid dates

      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      issuedByMonth[monthYear] = (issuedByMonth[monthYear] || 0) + 1;
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(issuedByMonth).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    const dataCounts = sortedMonths.map(m => issuedByMonth[m]);

    new Chart(ctxIssuedTime, {
      type: 'bar',
      data: {
        labels: sortedMonths,
        datasets: [{
          label: 'Books Issued',
          data: dataCounts,
          backgroundColor: '#2196f3',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Books Issued Over Time'
          }
        }
      }
    });
  }
});