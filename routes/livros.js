const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria um novo roteador
const livrosController = require('../controllers/livrosController'); // Importa o controlador de transações
 


// Definindo uma rota para obter todas as transações
router.get('/',  livrosController.getAllLivros);
router.post('/', livrosController.addLivros);

// Exportando o roteador
module.exports = router;
