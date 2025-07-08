const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(express.json());

let books = [
  { isbn: "1111", title: "The Alchemist", author: "Paulo Coelho", reviews: {} },
  { isbn: "2222", title: "The Prophet", author: "Kahlil Gibran", reviews: {} },
  { isbn: "3333", title: "1984", author: "George Orwell", reviews: {} }
];

let users = [];

// ====== Task 6: Register User ======
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ username, password });
  res.status(200).json({ message: 'User registered successfully' });
});

// ====== Task 7: Login User ======
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// ====== Task 8: Add/Modify Review ======
app.put('/books/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body;
  const book = books.find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!username || !review) return res.status(400).json({ message: 'Username and review are required' });
  book.reviews[username] = review;
  res.status(200).json({ message: 'Review added/modified successfully', reviews: book.reviews });
});

// ====== Task 9: Delete Review ======
app.delete('/books/review/:isbn/:username', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.params.username;
  const book = books.find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews[username]) return res.status(404).json({ message: 'Review not found for this user' });
  delete book.reviews[username];
  res.status(200).json({ message: 'Review deleted successfully', reviews: book.reviews });
});

// ====== Task 10: Get All Books ======
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// ====== Task 11: Get Book by ISBN ======
app.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  if (book) res.status(200).json(book);
  else res.status(404).json({ message: 'Book not found' });
});

// ====== Task 12: Get Books by Author ======
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = books.filter(b => b.author.toLowerCase() === author);
  if (booksByAuthor.length > 0) res.status(200).json(booksByAuthor);
  else res.status(404).json({ message: 'No books found by this author' });
});

// ====== Task 13: Get Books by Title ======
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const booksByTitle = books.filter(b => b.title.toLowerCase() === title);
  if (booksByTitle.length > 0) res.status(200).json(booksByTitle);
  else res.status(404).json({ message: 'No books found with this title' });
});

// ====== Axios Test Functions ======

const testRegistration = async () => {
  try {
    const response = await axios.post(`http://localhost:${PORT}/register`, {
      username: 'user1',
      password: 'pass123'
    });
    console.log('✅ Registration:', response.data);
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
  }
};

const testLogin = async () => {
  try {
    const response = await axios.post(`http://localhost:${PORT}/login`, {
      username: 'user1',
      password: 'pass123'
    });
    console.log('✅ Login:', response.data);
  } catch (error) {
    console.error('❌ Login Error:', error.message);
  }
};

const testAddReview = async () => {
  try {
    const response = await axios.put(`http://localhost:${PORT}/books/review/1111`, {
      username: 'user1',
      review: 'This is a great book!'
    });
    console.log('✅ Add/Modify Review:', response.data);
  } catch (error) {
    console.error('❌ Review Error:', error.message);
  }
};

const testDeleteReview = async () => {
  try {
    const response = await axios.delete(`http://localhost:${PORT}/books/review/1111/user1`);
    console.log('✅ Delete Review:', response.data);
  } catch (error) {
    console.error('❌ Delete Review Error:', error.message);
  }
};

const getAllBooks = async () => {
  try {
    const response = await axios.get(`http://localhost:${PORT}/books`);
    console.log('✅ All Books:', response.data);
  } catch (error) {
    console.error('❌ Get All Books Error:', error.message);
  }
};

const getBookByISBN = () => {
  axios.get(`http://localhost:${PORT}/books/isbn/1111`)
    .then(response => {
      console.log('✅ Book by ISBN:', response.data);
    })
    .catch(error => {
      console.error('❌ Get Book by ISBN Error:', error.message);
    });
};

const getBooksByAuthor = async () => {
  try {
    const response = await axios.get(`http://localhost:${PORT}/books/author/Paulo%20Coelho`);
    console.log('✅ Books by Author:', response.data);
  } catch (error) {
    console.error('❌ Get Books by Author Error:', error.message);
  }
};

const getBooksByTitle = async () => {
  try {
    const response = await axios.get(`http://localhost:${PORT}/books/title/The%20Alchemist`);
    console.log('✅ Books by Title:', response.data);
  } catch (error) {
    console.error('❌ Get Books by Title Error:', error.message);
  }
};

// ====== Start Server and Run Tests ======

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  testRegistration()
    .then(() => testLogin())
    .then(() => testAddReview())
    .then(() => testDeleteReview())
    .then(() => getAllBooks())
    .then(() => getBookByISBN())
    .then(() => getBooksByAuthor())
    .then(() => getBooksByTitle());
});
  