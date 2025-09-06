import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do banco de dados
const sequelize = new Sequelize('railway', 'root', 'DjDGydyTyozTgWriJGxDDRzRIiVIAmwN', {
    host: 'mainline.proxy.rlwy.net',
    port: 36841,
    dialect: 'mysql',
    logging: false, // Desative o logging para evitar o aviso
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
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
sequelize.sync().then(() => {
    console.log('✅ Banco sincronizado');
}).catch(err => {
    console.error('❌ Erro ao sincronizar:', err);
});

// Configuração do Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal - serve o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas da API
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
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
});

// Atualizar livro por ID
app.put('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByPk(req.params.id);
        if (livro) {
            await livro.update(req.body);
            res.json(livro);
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar livro' });
    }
});

// Deletar livro por ID
app.delete('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByPk(req.params.id);
        if (livro) {
            await livro.destroy();
            res.json({ message: 'Livro deletado com sucesso' });
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar livro' });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
