const db = require('../config/db'); // Importa a conexão com o banco de dados

// Função para obter todas as locações
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


//-------------------------- com verificação de duplicidade------------------------------------------------------------------//

// Função para adicionar uma nova locação
const addLocacoes = (req, res) => {
  const { id_usuario, id_livro, data_locação, data_devolução, status} = req.body;

// Verificar se a locação já existe
db.query(
  'SELECT * FROM locações WHERE id_usuario= ? AND id_livro = ? AND data_locação = ? AND data_devolução = ? AND status = ? ',
  [id_usuario, id_livro, data_locação, data_devolução, status ],
  (err, results) => {
  if (err) {
  console.error('Erro ao verificar locação:', err);
  res.status(500).send('Erro ao verificar locação');
  return;
  }
  if (results.length > 0) {
  // Se a locação já existe
  res.status(400).send('Locação duplicada');
  return;
  }



//se a locação não existe, insira-a no banco de dados 
  db.query(
  'INSERT INTO locações (id_usuario, id_livro, data_locação, data_devolução, status) VALUES (?,?,?,?,?)',
  [id_usuario, id_livro, data_locação, data_devolução, status],
  (err, results) => {
  if (err) {
  console.error('Erro ao adicionar locações:', err);
  res.status(500).send('Erro ao adicionar locações');
  return;
  }
  res.status(201).send('locação adicionada com sucesso !!');
  }

   );
  }  
);          
};



//Função para atualizar uma locação existente (substituição completa)
const updatelocacoesPut = (req, res) => {
  const{id} = req.params;
  const {id_usuario, id_livro, data_locação, data_devolução, status} = req.body;
  db.query(
  'UPDATE locações SET id_usuario=?, id_livro=?, data_locação=?, data_devolução=?, status=? WHERE id=?',
    
   [id_usuario, id_livro, data_locação, data_devolução, status, id],
  (err, results) => {
      if(err) {
          console.error('Erro ao atualizar locação', err);
          res.status(500).send('Erro ao atualizar locação');
       return;
      }
  
     
      if(results.affectedRows===0){
        res.status(404).send('Locação não encontrada');
        return;
      }
  
  
   res.send('Locação atualizada com sucesso');
  }
  );
  };
  



// Função para atualizar uma locação existente (atualização parcial)
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

  if (results.affectedRows === 0) {
    res.status(404).send('locação não encontrada');
    return;
  }

  res.send('locação atualizada com sucesso');
  }
  );
  };

  //Função para deletar uma locação existente

const deletelocacoes = (req,res) => {
  const{id} = req.params;
  db.query('DELETE FROM locações WHERE id = ?', [id],
  (err, results) => {
    if(err) {
        console.error('Erro deletar locações', err);
        res.status(500).send('Erro ao deletar locações');
     return;
    }


    if(results.affectedRows===0){
      res.status(404).send('Locação não encontrada');
      return;
    }


    res.send('Locação Deletada com sucesso');
});
};

module.exports = {
    getAllLocacoes,
    addLocacoes,
    updatelocacoesPut,
    updatelocacoesPatch,
    deletelocacoes

    };