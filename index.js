// Importa os módulos necessários
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import cors from 'cors';

const sequelize = new Sequelize('railway', 'root', 'DjDGydyTyozTgWriJGxDDRzRIiVIAmwN', {
    host: 'mainline.proxy.rlwy.net',
    port: 36841,
    dialect: 'mysql',
    logging: console.log
});
// Definição do modelo Livro
const Livro = sequelize.define('Livro', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    autor: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'livros'
});

// Sincroniza com o banco de dados
sequelize.sync();

// Configuração do Express
const app = express();
app.use(cors());
app.use(express.json());

// Rotas CRUD
app.post('/livros', async (req, res) => {
    try {
        const livro = await Livro.create(req.body);
        res.status(201).json(livro);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.findAll();
        res.json(livros);
    } catch (error) {
        console.error(error); // Isso mostrará detalhes no terminal
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
});

app.get('/livros/:id', async (req, res) => {
    const livro = await Livro.findByPk(req.params.id);
    if (livro) {
        res.json(livro);
    } else {
        res.status(404).json({ error: 'Livro não encontrado' });
    }
});

app.put('/livros/:id', async (req, res) => {
    const livro = await Livro.findByPk(req.params.id);
    if (livro) {
        await livro.update(req.body);
        res.json(livro);
    } else {
        res.status(404).json({ error: 'Livro não encontrado' });
    }
});

app.delete('/livros/:id', async (req, res) => {
    const livro = await Livro.findByPk(req.params.id);
    if (livro) {
        await livro.destroy();
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Livro não encontrado' });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
