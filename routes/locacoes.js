const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria um novo roteador
const locacoesController = require('../controllers/locacoesController'); // Importa o controlador de transações
 


// Definindo uma rota para obter todas as transações
router.get('/',  locacoesController.getAllLocacoes);
router.post('/',  locacoesController.addLocacoes);
router.put('/:id', locacoesController.updatelocacoesPut);
router.patch('/:id', locacoesController.updatelocacoesPatch);
router.delete('/:id', locacoesController.deletelocacoes);

// Exportando o roteador
module.exports = router;
