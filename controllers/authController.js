const db = require('../config/db'); // Importa a configuração do banco de dados
const bcrypt = require('bcrypt'); // Importa o bcrypt para criptografar senhas
const jwt = require('jsonwebtoken'); // Importa o jsonwebtoken para gerar tokens JWT

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
const { nome, endereço, telefone, email, senha } = req.body; // Desestrutura os dados do corpo da requisição

// Verificar se o usuário já existe no banco de dados
try {
const [existingUser] = await db.promise().query('SELECT * FROM clientes WHERE email = ?',
[email]);
if (existingUser.length > 0) {
return res.status(400).send('Usuário já registrado');
}

// Criptografar a senha usando bcrypt
const hashedPassword = await bcrypt.hash(senha, 10);

// Inserir o novo usuário no banco de dados
await db.promise().query(
'INSERT INTO users (nome, endereço, telefone, email, senha) VALUES (?, ?, ?, ?, ?)',
[nome, endereço, telefone, email, hashedPassword]
);
res.status(201).send('Usuário registrado com sucesso');
} catch (err) {
console.error('Erro ao registrar usuário:', err);
res.status(500).send('Erro ao registrar usuário');
}
};



module.exports = {
registerUser

}