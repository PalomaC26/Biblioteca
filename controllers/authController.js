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
return res.status(400).send('Cliente já registrado');
}

// Criptografar a senha usando bcrypt
const hashedPassword = await bcrypt.hash(senha, 10);

// Inserir o novo usuário no banco de dados
await db.promise().query(
'INSERT INTO Clientes (nome, endereço, telefone, email, senha) VALUES (?, ?, ?, ?, ?)',
[nome, endereço, telefone, email, hashedPassword]
);
res.status(201).send('Cliente registrado com sucesso');
} catch (err) {
console.error('Erro ao registrar Cliente:', err);
res.status(500).send('Erro ao registrar Cliente');
}
};

// Função para autenticar um usuário 
const loginUser = async (req, res) => { 
    const { email, senha } = req.body; // Desestrutura os dados do corpo da requisição 
    // Verificar se o usuário existe no banco de dados 
    try { 
    const [User] = await db.promise().query('SELECT * FROM Clientes WHERE email = ?', [email]); 
    if (User.length === 0) { 
    return res.status(400).send('Credenciais inválidas'); 
    } 
    // Comparar a senha fornecida com a senha criptografada no banco de dados 
    const isMatch = await bcrypt.compare(senha, User[0].senha); 
    if (!isMatch) { 
    return res.status(400).send('Credenciais inválidas'); 
    } 
    // Gerar um token JWT 
    const token = jwt.sign({ UserId: User[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
    res.json({ token }); 
    } catch (err) { 
    console.error('Erro ao autenticar Cliente:', err); 
    res.status(500).send('Erro ao autenticar Cliente'); 
    } 
   }; 


module.exports = {
registerUser,
loginUser 

}