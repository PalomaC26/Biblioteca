
const dotenv = require('dotenv'); 

//Configurar as Variáveis de ambiente

dotenv.config(); 

//Importar as Bibliotecas
const express = require('express'); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 

const db = require('./config/db'); // Importa a conexão com o banco de dados




//inicializar nova aplicação Express

const app = express(); 


//configurar o CORS e o bady-Parse

app.use(cors()); 
app.use(bodyParser.json()); 

//Rota inicial para testar o servidor
app.get('/',(req,res)=> {
    res.send('Servidor está rodando');
});


//Configurar o servidor para uma porta específica

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); 
});