const crypto = require('crypto'); // Importa o módulo 'crypto', que fornece funcionalidades de criptografia, como geração de hashes e criptografia/descriptografia de dados.
const db = require('../config/db'); // Importa a configuração da conexão com o banco de dados a partir do arquivo 'db' localizado na pasta 'config'.
const bcrypt = require('bcrypt'); // Importa o módulo 'bcrypt', que será utilizado para realizar a criptografia de senhas e a comparação de senhas criptografadas.
const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' (JWT), que será utilizado para criar e verificar tokens de autenticação para segurança das rotas.
const sendEmail = require('../services/emailService').sendEmail; // Importa a função 'sendEmail' do serviço de e-mail localizado em 'emailService', usada para enviar e-mails a partir da aplicação.

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
  const { nome, telefone, email, senha} = req.body; // Desestrutura os dados do corpo da requisição

 // Verificar se o usuário já existe no banco de dados
  try {
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).send('Usuário já registrado');
    }

    // Criptografar a senha usando bcrypt
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir o novo usuário no banco de dados
    await db.promise().query(
      'INSERT INTO users (nome, telefone, email, senha) VALUES (?, ?, ?, ?)',
      [nome, telefone, email, hashedPassword]
    );

    res.status(201).send('Usuário registrado com sucesso');
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).send('Erro ao registrar usuário');
  }
};

// Função para autenticar um usuário
const loginUser = async (req, res) => {
  const { email, senha } = req.body; // Desestrutura os dados do corpo da requisição

 // Verificar se o usuário existe no banco de dados

  try {
    const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).send('Credenciais inválidas');
    }

    // Comparar a senha fornecida com a senha criptografada no banco de dados
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).send('Credenciais inválidas');
    }

    // Gerar um token JWT
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Erro ao autenticar usuário:', err);
    res.status(500).send('Erro ao autenticar usuário');
  }
};

// Função para solicitar redefinição de senha
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  
      if (user.length === 0) {
        return res.status(404).send('Usuário não encontrado');
      }
  
      const token = crypto.randomBytes(20).toString('hex'); // Gera um token aleatório
      const expireDate = new Date(Date.now() + 3600000); // 1 hora para expiração
  
      await db.promise().query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?', [token, expireDate, email]);
  
      const resetLink = `http://localhost:3000/reset-password/${token}`; // Link para redefinição de senha
      sendEmail(email, 'Recuperação de Senha', `Por favor, clique no link para redefinir sua senha: ${resetLink}`);
  
      res.send('E-mail de recuperação de senha enviado');
    } catch (err) {
      console.error('Erro ao solicitar redefinição de senha:', err);
      res.status(500).send('Erro ao solicitar redefinição de senha');
    }
  };
  
  // Função para redefinir a senha
  const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const [user] = await db.promise().query('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()', [token]);
  
      if (user.length === 0) {
        return res.status(400).send('Token inválido ou expirado');
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Criptografa a nova senha
  
      await db.promise().query('UPDATE users SET senha = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?', [hashedPassword, user[0].id]);
  
      res.send('Senha redefinida com sucesso');
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      res.status(500).send('Erro ao redefinir senha');
    }
  };
  
    
// Exporta as funções 'registerUser', 'loginUser', 'requestPasswordReset' e 'resetPassword' para que possam ser acessadas e utilizadas em outros módulos da aplicação.
module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset, 
  resetPassword
};