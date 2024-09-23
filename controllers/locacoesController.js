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
  const { nome_livro, nome_cliente, data_locação, data_devolução} = req.body;
  db.query(
  'INSERT INTO locações (nome_livro, nome_cliente, data_locação, data_devolução) VALUES (?,?,?,?)',
  [nome_livro, nome_cliente, data_locação, data_devolução],
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



//Função para atualizar uma transação existente (substituição completa)
const updatelocacoesPut = (req, res) => {
  const{id} = req.params;
  const {nome_livro, nome_cliente, data_locação, data_devolução} = req.body;
  db.query(
  'UPDATE locações SET nome_livro=?, nome_cliente=?, data_locação=?, data_devolução=? WHERE id=?',
    [nome_livro, nome_cliente, data_locação, data_devolução, id],
  (err, results) => {
      if(err) {
          console.error('Erro ao adicionar locação', err);
          res.status(500).send('Erro ao adicionar locação');
       return;
      }
  
     
      // verifica se nenhuma linha foi afetada pela consulta
      if(results.affectedRows===0){
        res.status(404).send('Locação não encontrada');
        return;
      }
  
  
   res.send('Locação atualizada com sucesso');
  }
  );
  };
  



// Função para atualizar uma transação existente (atualização parcial)
const updatelocacoesPatch = (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const query = [];
  const values = [];
  for (const [key, value] of Object.entries(fields)) {
  query.push(`${key} = ?`);
  values.push(value);
  }
  values.push(id);
  db.query(
  `UPDATE locações SET ${query.join(', ')} WHERE id = ?`,
  values,
  (err, results) => {
  if (err) {
  console.error('Erro ao atualizar locação:', err);
  res.status(500).send('Erro ao atualizar locação');
  return;
  }
  res.send('locação atualizada com sucesso');
  }
  );
  };

  //Função para deletar uma transação existente

const deletelocacoes = (req,res) => {
  const{id} = req.params;
  db.query('DELETE FROM locações WHERE id = ?', [id],
  (err, results) => {
    if(err) {
        console.error('Erro deletar locações', err);
        res.status(500).send('Erro ao deletar locações');
     return;
    }


    //verifca se nenhuma linha foi afetada pela consulta
    if(results.affectedRows===0){
      res.status(404).send('Locação não encontrada');
      return;
    }


    res.send('Locação Deletada com sucesso');
}
);
};

module.exports = {
    getAllLocacoes,
    addLocacoes,
    updatelocacoesPut,
    updatelocacoesPatch,
    deletelocacoes

    };