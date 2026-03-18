const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' 
});

const Agendamento = sequelize.define('Agendamento', {
  nomePaciente: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  dataConsulta: { type: Sequelize.DATEONLY, allowNull: false },
  horario: { type: Sequelize.STRING, allowNull: false },
  cep: { type: Sequelize.STRING },
  endereco: { type: Sequelize.STRING },
  previsaoTempo: { type: Sequelize.STRING }
});

const Usuario = sequelize.define('Usuario', {
  nome: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  senha: { type: Sequelize.STRING, allowNull: false },
  tipo: { type: Sequelize.STRING, defaultValue: 'paciente' }
});

// CONEXÃO COM O BANCO
async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Conexão com SQLite estabelecida e tabelas prontas! 📦');
  } catch (error) {
    console.error('Erro ao conectar ao SQLite:', error);
  }
}
connectDB();

// 1. Inicio
app.get('/', (req, res) => {
  res.send('Servidor AVA2 rodando!');
});

// Cadastro
app.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({
      nome, email, senha: senhaCriptografada, tipo
    });
    res.status(201).json({ mensagem: "Usuário criado!", usuario: novoUsuario.nome });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao cadastrar. E-mail já existe?" });
  }
});

// 3. Login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado!" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta!" });

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo }, 
      "CHAVE_SECRETA_DO_AVA2", 
      { expiresIn: '1h' }
    );

    res.json({ mensagem: "Login realizado!", token, usuario: usuario.nome, tipo: usuario.tipo });
  } catch (error) {
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

// 4. Rota de Agendamentos (AGORA FORA DO LOGIN!)
app.post('/agendamentos', async (req, res) => {
  try {
    const { dataConsulta, horario, cep, endereco, previsaoTempo } = req.body;

    const ocupado = await Agendamento.findOne({ where: { dataConsulta, horario } });
    if (ocupado) {
      return res.status(400).json({ erro: "Horário já ocupado! Escolha outro." });
    }

    await Agendamento.create({
      nomePaciente: "Paciente Teste",
      email: "joao@email.com",
      dataConsulta,
      horario,
      cep,
      endereco,
      previsaoTempo
    });

    res.status(201).json({ mensagem: "Agendado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar no banco." });
  }
});


// ROTA PARA LISTAR TODOS OS AGENDAMENTOS (Para o Secretário)
app.get('/agendamentos', async (req, res) => {
  try {
    const lista = await Agendamento.findAll({ order: [['dataConsulta', 'ASC']] });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar dados." });
  }
});

// Ligar o servidor (Sempre no final)
const PORT = process.env.PORT || 3000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});