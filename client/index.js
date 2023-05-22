let currentPage = 'home';
let currentBook = null;
let books = [];

const main = document.querySelector('main');

const pageListMainContent = `<h2 class="text-2xl font-bold mb-4">Daftar Buku Perpustakaan</h2>

<table class="min-w-full border border-gray-300">
<thead>
<tr>
<th class="px-6 py-3 bg-gray-100 border-b text-left">Judul</th>
<th class="px-6 py-3 bg-gray-100 border-b text-left">Penulis</th>
<th class="px-6 py-3 bg-gray-100 border-b text-left">Tahun Terbit</th>
<th class="px-6 py-3 bg-gray-100 border-b text-left">Jumlah</th>
<th class="px-6 py-3 bg-gray-100 border-b text-center">Action</th>
</tr>
</thead>
<tbody>
</tbody>
</table>`;

const pageEditBookMainContent = `<h2 class="text-2xl font-bold mb-4">Edit Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleEditForm(event)">
</form>
`;

const pageAddBookMainContent = `<h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleAddForm(event)">
<div class="mb-4">
<label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
<input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
</div>
<div class="mb-4">
<label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
<input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
</div>
<div class="mb-4">
<label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
<input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
</div>
<div class="mb-4">
<label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
<input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
</div>
<div class="flex justify-center">
<input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="Tambah Buku" />
</div>
</form>
`;

async function handleClickEditButton(bookId) {
  try {
    const response = await fetch(`http://localhost:3333/books/${bookId}`);
    const dataEdit = await response.json();
    console.log("inidata=",dataEdit);
    currentBook = dataEdit;
    currentBook.id = bookId;
    currentPage = 'edit';
    loadPage();
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat mengambil data buku');
  }
}


// async function handleClickDeleteButton(bookId) {
//   try {
//     await deleteBook(bookId);
//     books = books.filter((book) => book.id !== bookId);
//     loadPage();
//   } catch (error) {
//     console.log(error);
//     console.log('Terjadi kesalahan saat menghapus buku');
//   }
// }


async function handleEditForm(event) {
  try {
    event.preventDefault();
    
    
    const book = {
      id: currentBook.id,
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      year: parseInt(document.getElementById('year').value),
      quantity: parseInt(document.getElementById('quantity').value),
    };
    
    await editBook(book);
    console.log(book); // Mengirimkan ID buku sebagai parameter ke fungsi editBook
    
    currentBook = null;
    currentPage = 'home';
    loadPage();
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat mengubah buku');
  }
}



async function handleAddForm(event) {
  try {
    event.preventDefault();
    
    const book = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      year: parseInt(document.getElementById('year').value),
      quantity: parseInt(document.getElementById('quantity').value),
    };
    
    await addBook(book);
    
    currentPage = 'home';
    loadPage();
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat menambah buku');
  }
}


function handleClickAddNav() {
  currentPage = 'add';
  loadPage();
}


const navLinks = document.querySelectorAll('li a');
navLinks.forEach((navLink) => {
  navLink.addEventListener('click', handleClickAddNav);
});


function generateRows(books) {
  let rows = '';
  if (books.length === 0) {
    rows = `<tr>
      <td colspan="6" class="px-6 py-4 border-b text-center">Tidak ada buku yang ditemukan</td>
    </tr>`;
  } else {
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const row = `
        <tr class="book-item" data-book-id="${book.id}">
          <td class="px-6 py-4 border-b">${book.title}</td>
          <td class="px-6 py-4 border-b">${book.author}</td>
          <td class="px-6 py-4 border-b">${book.year}</td>
          <td class="px-6 py-4 border-b">${book.quantity}</td>
          <td class="px-6 py-4 border-b text-center">
            <button class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickEditButton(${book.id})">Edit</button>
            <button class="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded delete-button" onclick="handleClickDeleteButton(${book.id})">Hapus</button>
          </td>
        </tr>`;
      rows += row;
    }
  }
  return rows;
}




function generateEditFormInput() {
  return `<div class="mb-4">
  <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
  <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.title}">
  </div>
  <div class="mb-4">
  <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
  <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.author}">
  </div>
  <div class="mb-4">
  <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
  <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.year}">
  </div>
  <div class="mb-4">
  <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
  <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.quantity}">
  </div>
  <div class="flex justify-center">
  <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="simpan" />
  </div>`;
}

async function loadPage() {
  switch (currentPage) {
    case 'home':
    const bookList = await fetchBooks();
    
    main.innerHTML = pageListMainContent;
    
    const tableBody = document.querySelector('tbody');
    
    
    const rows = generateRows(bookList);
    tableBody.innerHTML = rows;

    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-button')) {
        const bookId = parseInt(event.target.parentElement.parentElement.dataset.bookId);
        deleteBook(bookId);
        loadPage();
      }
    });
    
    break;
    case 'edit':
    main.innerHTML = pageEditBookMainContent;
    
    const form = document.querySelector('form');
    const formInput = generateEditFormInput();
    form.innerHTML = formInput;
    
    break;
    case 'add':
    main.innerHTML = pageAddBookMainContent;
    break;
  }
}




async function fetchBooks() {
  try {
    
    const response = await fetch('http://localhost:3333/books');
    const data = await response.json();
    console.log(data);
    
    return data;
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat mengambil data buku dari server');
    return []; 
  }
}




async function addBook(book) {
  try {
    const response = await fetch('http://localhost:3333/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  console.log('Buku berhasil ditambahkan:', data);
} catch (error) {
  console.log(error);
  console.log('Terjadi kesalahan saat menambah buku');
}
}

async function editBook(book) {
  try {
    const response = await fetch(`http://localhost:3333/books/${book.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  console.log('Buku berhasil diubah:', data);
} catch (error) {
  console.log(error);
  console.log('Terjadi kesalahan saat mengubah buku');
}
}



async function deleteBook(bookId) {
  try {
    await fetch(`http://localhost:3333/books/${bookId}`, {
      method: 'DELETE',
    });
    console.log('Buku berhasil dihapus');
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat menghapus buku');
  }
}


loadPage();
