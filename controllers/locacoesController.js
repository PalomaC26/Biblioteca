const db = require('../config/db'); // Importa a conexão com o banco de dados

// Função para obter todas as transações
const getAllLocacoes = (req, res) => {
  db.query('SELECT * FROM locações', (err, results) => {
    if (err) {
      console.error('Erro ao obter locacoes:', err);
      res.status(500).send('Erro ao obter locacoes');
      return;
    }
    res.json(results);
  });
};

// Função para adicionar uma nova transação
const addLocacoes = (req, res) => {
  const { livro_id, cliente_id, data_locação, data_devolução} = req.body;
  db.query(
  'INSERT INTO locações (livro_id, cliente_id, data_locação, data_devolução) VALUES (?,?,?,?)',
  [livro_id, cliente_id, data_locação, data_devolução],
  (err, results) => {
  if (err) {
  console.error('Erro ao adicionar locações:', err);
  res.status(500).send('Erro ao adicionar locações');
  return;
  }
  res.status(201).send('locação adicionada com sucesso !!');
  }
  );
  };


// Função para atualizar uma transação existente (substituição completa)
const updatelocacoesPut = (req, res) => {
  const { id } = req.params;
  const { livro_id, cliente_id, data_locação, data_devolução } = req.body;
  db.query(
  'UPDATE locações SET livro_id=?, cliente_id=?, data_locação=?, data_devolução=?',
  [livro_id, cliente_id, data_locação, data_devolução],
  (err, results) => {
  if (err) {
  console.error('Erro ao atualizar locações:', err);
  res.status(500).send('Erro ao atualizar locações');
  return;
  }
  res.send('locações atualizada com sucesso !!');
  }
  );
  };





module.exports = {
    getAllLocacoes,
    addLocacoes,
    updatelocacoesPut

    };