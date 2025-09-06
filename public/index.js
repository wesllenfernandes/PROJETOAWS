const API_URL = '/livros';

// Função para adicionar livro
document.getElementById('addLivroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const preco = document.getElementById('preco').value;
    
    try {
        const response = await fetch(`${API_URL}/livros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, autor, preco: parseFloat(preco) })
        });
        
        if (response.ok) {
            alert('Livro adicionado com sucesso!');
            document.getElementById('addLivroForm').reset();
            carregarLivros();
        } else {
            const error = await response.json();
            alert('Erro ao adicionar livro: ' + error.error);
        }
    } catch (error) {
        alert('Erro de conexão: ' + error.message);
    }
});

// Função para carregar todos os livros
async function carregarLivros() {
    try {
        const response = await fetch(`${API_URL}/livros`);
        const livros = await response.json();
        
        const tbody = document.getElementById('livrosTableBody');
        tbody.innerHTML = '';
        
        livros.forEach(livro => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>R$ ${parseFloat(livro.preco).toFixed(2)}</td>
                <td>
                    <button class="btn-edit" onclick="editarLivro(${livro.id})">Editar</button>
                    <button class="btn-delete" onclick="deletarLivro(${livro.id})">Deletar</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

// Função para buscar livro por ID
async function buscarLivroPorId() {
    const id = document.getElementById('searchId').value;
    const resultDiv = document.getElementById('searchResult');
    
    if (!id) {
        resultDiv.innerHTML = 'Por favor, digite um ID válido.';
        resultDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/livros/${id}`);
        
        if (response.ok) {
            const livro = await response.json();
            resultDiv.innerHTML = `
                <strong>Livro Encontrado:</strong><br>
                ID: ${livro.id}<br>
                Título: ${livro.titulo}<br>
                Autor: ${livro.autor}<br>
                Preço: R$ ${parseFloat(livro.preco).toFixed(2)}
            `;
        } else {
            resultDiv.innerHTML = 'Livro não encontrado.';
        }
        resultDiv.style.display = 'block';
    } catch (error) {
        resultDiv.innerHTML = 'Erro de conexão: ' + error.message;
        resultDiv.style.display = 'block';
    }
}

// Função para editar livro
async function editarLivro(id) {
    const novoTitulo = prompt('Novo título:');
    const novoAutor = prompt('Novo autor:');
    const novoPreco = prompt('Novo preço:');
    
    if (novoTitulo && novoAutor && novoPreco) {
        try {
            const response = await fetch(`${API_URL}/livros/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: novoTitulo,
                    autor: novoAutor,
                    preco: parseFloat(novoPreco)
                })
            });
            
            if (response.ok) {
                alert('Livro atualizado com sucesso!');
                carregarLivros();
            } else {
                const error = await response.json();
                alert('Erro ao atualizar livro: ' + error.error);
            }
        } catch (error) {
            alert('Erro de conexão: ' + error.message);
        }
    }
}

// Função para deletar livro
async function deletarLivro(id) {
    if (confirm('Tem certeza que deseja deletar este livro?')) {
        try {
            const response = await fetch(`${API_URL}/livros/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Livro deletado com sucesso!');
                carregarLivros();
            } else {
                const error = await response.json();
                alert('Erro ao deletar livro: ' + error.error);
            }
        } catch (error) {
            alert('Erro de conexão: ' + error.message);
        }
    }
}

// Carregar livros quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarLivros);
