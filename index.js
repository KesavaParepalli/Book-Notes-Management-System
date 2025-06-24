const express = require('express')
const { Pool } = require('pg')
const path = require('path')
const app = express()
const port = 3000

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes',
  password: '1985',
  port: 5432
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM books ORDER BY read_date DESC')
  res.render('index', { books: rows })
})

app.get('/books/new', (req, res) => {
  res.render('new')
})

app.post('/books', async (req, res) => {
  const { title, author, rating, notes, read_date, cover_id } = req.body
  await pool.query(
    'INSERT INTO books (title, author, rating, notes, read_date, cover_id) VALUES ($1, $2, $3, $4, $5, $6)',
    [title, author, rating, notes, read_date, cover_id]
  )
  res.redirect('/')
})

app.get('/books/:id/edit', async (req, res) => {
  const { id } = req.params
  const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id])
  res.render('edit', { book: rows[0] })
})

app.post('/books/:id/update', async (req, res) => {
  const { id } = req.params
  const { title, author, rating, notes, read_date, cover_id } = req.body
  await pool.query(
    'UPDATE books SET title=$1, author=$2, rating=$3, notes=$4, read_date=$5, cover_id=$6 WHERE id=$7',
    [title, author, rating, notes, read_date, cover_id, id]
  )
  res.redirect('/')
})

app.post('/books/:id/delete', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM books WHERE id=$1', [id])
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
