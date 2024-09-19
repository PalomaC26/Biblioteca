const db = require('../config/db'); // Importa a conexão com o banco de dados

// Função para obter todas as transações
const getAllLivros = (req, res) => {
  db.query('SELECT * FROM livros', (err, results) => {
    if (err) {
      console.error('Erro ao obter livros:', err);
      res.status(500).send('Erro ao obter livros');
      return;
    }
    res.json(results);
  });
};

// Função para adicionar uma nova transação
const addLivros = (req, res) => {
    const { date, amount, description, category, account, user_id } = req.body;
    db.query(
    'INSERT INTO livros (titulo, autor, isbn, categoria) VALUES
    ()',
    [titulo, autor, isbn, categoria],
    (err, results) => {
    if (err) {
    console.error('Erro ao adicionar livros:', err);
    res.status(500).send('Erro ao adicionar livros');
    return;
    }
    res.status(201).send('Livro adicionado com sucesso');
    }
    );
    };







module.exports = {
    getAllLivros,
    addLivros
    };