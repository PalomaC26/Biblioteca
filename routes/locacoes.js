const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria um novo roteador
const locacoesController = require('../controllers/locacoesController'); // Importa o controlador de transações

const authMiddleware = require('../middlewares/authMiddleware'); // Importa o middleware de autenticação


// Definindo uma rota para obter todas as transações
router.get('/', authMiddleware, locacoesController.getAllLocacoes);

router.post('/',authMiddleware, locacoesController.addLocacoes);

router.put('/:id',authMiddleware, locacoesController.updatelocacoesPut);

router.patch('/:id',authMiddleware, locacoesController.updatelocacoesPatch);

router.delete('/:id',authMiddleware, locacoesController.deletelocacoes);

// Exportando o roteador
module.exports = router;
