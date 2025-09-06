import { Sequelize, DataTypes } from 'sequelize';

async function diagnosticoCompleto() {
    console.log('🔍 Diagnóstico Completo do Banco de Dados\n');
    
    const sequelize = new Sequelize('railway', 'root', 'DjDGydyTyozTgWriJGxDDRzRIiVIAmwN', {
        host: 'mainline.proxy.rlwy.net',
        port: 36841,
        dialect: 'mysql',
        logging: true,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    });
    
    try {
        // 1. Testar conexão
        console.log('1. Testando conexão...');
        await sequelize.authenticate();
        console.log('✅ Conexão estabelecida!\n');
        
        // 2. Verificar banco de dados
        console.log('2. Verificando banco de dados...');
        const [dbs] = await sequelize.query('SELECT DATABASE() as current_db');
        console.log('✅ Banco atual:', dbs[0].current_db);
        
        const [tables] = await sequelize.query('SHOW TABLES');
        console.log('📋 Tabelas encontradas:', tables.map(t => Object.values(t)[0]).join(', ') || 'Nenhuma');
        console.log('');
        
        // 3. Verificar/criar tabela livros
        console.log('3. Verificando tabela livros...');
        const [livrosTable] = await sequelize.query('SHOW TABLES LIKE "livros"');
        
        if (livrosTable.length === 0) {
            console.log('❌ Tabela livros não existe. Criando...');
            await sequelize.query(`
                CREATE TABLE livros (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    titulo VARCHAR(100) NOT NULL,
                    autor VARCHAR(50) NOT NULL,
                    preco DECIMAL(10,2) NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `);
            console.log('✅ Tabela livros criada!');
        } else {
            console.log('✅ Tabela livros existe!');
            
            // Verificar estrutura
            const [columns] = await sequelize.query('DESCRIBE livros');
            console.log('📊 Estrutura:');
            columns.forEach(col => {
                console.log(`  ${col.Field} - ${col.Type} - ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? 'PRIMARY KEY' : ''}`);
            });
        }
        console.log('');
        
        // 4. Testar operações CRUD
        console.log('4. Testando operações CRUD...');
        
        // Definir modelo
        const Livro = sequelize.define('Livro', {
            titulo: DataTypes.STRING(100),
            autor: DataTypes.STRING(50),
            preco: DataTypes.DECIMAL(10, 2)
        }, { tableName: 'livros', timestamps: false });
        
        // Limpar tabela de teste
        await sequelize.query('DELETE FROM livros WHERE titulo LIKE "%Teste%"');
        
        // CREATE
        console.log('📝 Testando CREATE...');
        const novoLivro = await Livro.create({
            titulo: 'Livro Teste',
            autor: 'Autor Teste',
            preco: 19.99
        });
        console.log('✅ CREATE bem sucedido:', novoLivro.toJSON());
        
        // READ
        console.log('📖 Testando READ...');
        const livros = await Livro.findAll();
        console.log('✅ READ bem sucedido. Total:', livros.length);
        livros.forEach(l => console.log(`  - ${l.titulo} por ${l.autor} (R$ ${l.preco})`));
        
        // UPDATE
        console.log('✏️ Testando UPDATE...');
        await novoLivro.update({ preco: 29.99 });
        const livroAtualizado = await Livro.findByPk(novoLivro.id);
        console.log('✅ UPDATE bem sucedido:', livroAtualizado.toJSON());
        
        // DELETE
        console.log('🗑️ Testando DELETE...');
        await novoLivro.destroy();
        const count = await Livro.count();
        console.log('✅ DELETE bem sucedido. Total restante:', count);
        
        console.log('\n🎉 Todos os testes passaram! O banco de dados está funcionando corretamente.');
        
    } catch (error) {
        console.error('❌ Erro no diagnóstico:', error);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

diagnosticoCompleto();
