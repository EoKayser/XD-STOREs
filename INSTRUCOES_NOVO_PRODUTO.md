# 📚 Guia: Como Adicionar um Novo Produto Manualmente

**Versão:** 1.0  
**Data:** 27/04/2026  
**Loja:** XD Store

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-Requisitos](#pré-requisitos)
3. [Passo 1: Adicionar o Produto ao `store.js`](#passo-1-adicionar-o-produto-ao-storejs)
4. [Passo 2: Preparar a Imagem do Produto](#passo-2-preparar-a-imagem-do-produto)
5. [Passo 3: Criar o Arquivo HTML do Produto](#passo-3-criar-o-arquivo-html-do-produto)
6. [Passo 4: Testar o Novo Produto](#passo-4-testar-o-novo-produto)
7. [Dicas e Troubleshooting](#dicas-e-troubleshooting)

---

## 🎯 Visão Geral

Para adicionar um novo produto à loja, você precisa:

1. **Registrar** o produto no banco de dados (`store.js`)
2. **Preparar** uma imagem do produto
3. **Criar** uma página HTML específica para o produto
4. **Testar** para garantir que tudo funciona

**Tipos de Produtos:**
- ✅ **Simples:** Um preço único (Ex: Xbox Game Pass individual)
- ✅ **Multi-variação:** Vários planos/opções com preços diferentes (Ex: PSPlus 1 mês, 3 meses, 12 meses)

O processo é simples e não requer conhecimento avançado de programação!

---

## ✅ Pré-Requisitos

Antes de começar, você vai precisar de:

- Um editor de texto (VS Code, Notepad++, Sublime Text, etc.)
- Uma imagem do produto em formato PNG ou JPG
- Acesso aos arquivos da loja
- Um navegador para testar

### Estrutura de Pastas (Lembre-se!)

```
XD1.1-main/
├── pages/
│   └── produtos/          ← Aqui ficam os HTMLs dos produtos
├── assets/
│   └── images/            ← Aqui ficam as imagens dos produtos
├── js/
│   ├── store.js           ← Banco de dados dos produtos
│   └── ui.js
└── index.html
```

---

## 🔧 Passo 1: Adicionar o Produto ao `store.js`

O arquivo `store.js` contém a lista de todos os produtos. Você precisa adicionar seu novo produto lá.

### 1.1 - Abra o arquivo `js/store.js`

### 1.2 - Localize a seção `var PRODUCTS = [`

Você verá algo assim:

```javascript
var PRODUCTS = [
  { id: 1, name: "Minecraft Premium", price: 60.00, promoPrice: 40.90, promoEnabled: true, img: "assets/images/minejava.png", description: "Conta Minecraft Java Edition original" },
  { id: 2, name: "Valorant Mista", price: 150.00, promoPrice: 0, promoEnabled: false, img: "assets/images/conta valorant.png", description: "Conta com skins exclusivas" },
  // ... mais produtos aqui
]
```

### 1.3 - Adicione seu novo produto ANTES da chave de fechamento `]`

**Estrutura obrigatória de um produto:**

```javascript
{ 
  id: [NÚMERO_ÚNICO],                                    // ID único (maior que os anteriores)
  name: "[NOME_DO_PRODUTO]",                            // Nome que aparece na loja
  price: [PREÇO_EM_REAIS],                              // Ex: 59.90
  promoPrice: [PREÇO_PROMOCIONAL_OU_0],                 // 0 se não tem promoção
  promoEnabled: [true_OU_false],                        // true se tem promoção ativa
  img: "assets/images/[NOME_ARQUIVO_IMAGEM]",          // Caminho da imagem
  description: "[DESCRIÇÃO_CURTA]"                      // Descrição breve
}
```

### 1.4 - Exemplo Prático

Se você quer adicionar um produto chamado "PlayStation Plus":

```javascript
{ 
  id: 7, 
  name: "PlayStation Plus 3 Meses", 
  price: 45.90, 
  promoPrice: 35.90, 
  promoEnabled: true, 
  img: "assets/images/ps-plus.png", 
  description: "Acesso a jogos exclusivos do PlayStation" 
}
```

### ⚠️ Dicas Importantes do Passo 1:

- **ID:** Deve ser único! Se você tem 6 produtos (IDs 1-6), o novo deve ser 7
- **Nome:** Evite caracteres especiais, mas acentos (á, é, etc.) são okay
- **Preço:** Use ponto (`.`) como separador decimal, não vírgula
- **Imagem:** O arquivo deve estar na pasta `assets/images/`
- **vírgula:** Não esqueça da vírgula no final, EXCETO no último produto!

---

## 🖼️ Passo 2: Preparar a Imagem do Produto

### 2.1 - Requisitos da Imagem

- **Formato:** PNG ou JPG
- **Tamanho recomendado:** 400x400 px ou 600x600 px
- **Tamanho máximo:** 500 KB
- **Fundo:** Preferencialmente transparente (PNG) ou com fundo neutro

### 2.2 - Adicionar a Imagem

1. Coloque a imagem na pasta `assets/images/`
2. **Nomeie o arquivo** de forma descritiva: `ps-plus.png`, `gta-online.png`, etc.
3. Use apenas letras minúsculas e hífens (não use espaços!)
4. **Lembre-se do nome** - você vai usar ele em `store.js`

### 2.3 - Exemplo

Se o arquivo é `assets/images/ps-plus.png`, em `store.js` você coloca:
```javascript
img: "assets/images/ps-plus.png"
```

---

## 📄 Passo 3: Criar o Arquivo HTML do Produto

### 3.1 - Use o Template

1. Abra o arquivo `pages/produtos/PRODUTO-TEMPLATE.html`
2. Faça uma cópia dele (Ctrl+C)
3. Cole em `pages/produtos/` e renomeie para algo descritivo

**Convenção de nome:**
- Pegue o nome do produto
- Coloque em minúsculas
- Substitua espaços por hífens
- Adicione `.html`

**Exemplos:**
- "PlayStation Plus" → `playstation-plus.html`
- "GTA Online Dinheiro" → `gta-online-dinheiro.html`
- "Epic Games Conta" → `epic-games-conta.html`

### 3.2 - Edite o Template

Abra o arquivo HTML que você criou e procure por todos os `[PLACEHOLDERS]` em CAPS e substitua:

| Placeholder | Substitua por | Exemplo |
|---|---|---|
| `[NOME DO PRODUTO]` | Nome do seu produto | PlayStation Plus 3 Meses |
| `[DESCRIÇÃO CURTA DO PRODUTO - ...]` | Uma descrição curta (1-2 linhas) | Acesso a jogos exclusivos e conteúdo premium |
| `[CATEGORIA/EMOJI]` | Um emoji + categoria | 🎮 Gaming |
| `[NÚMERO]` | Número de avaliações | 45 |
| `[PREÇO]` | O preço (deve bater com `store.js`) | R$ 45,90 |
| `[NOME_ARQUIVO_IMAGEM].png` | Nome da imagem (pasta `assets/images/`) | ps-plus.png |
| `[DESCRIÇÃO DETALHADA DO PRODUTO]` | Descrição longa pode ter múltiplos parágrafos | Tenha acesso a centenas de... |
| `[CARACTERÍSTICA 1-4]` | Títulos de características | Jogos Exclusivos |
| `[EMOJI]` | Emoji relacionado | 🎮 |
| `[DESCRIÇÃO DA CARACTERÍSTICA]` | Detalhe sobre a característica | Acesso a mais de 600 jogos |
| `[ITEM 1-4]` | Itens inclusos | Acesso completo por 3 meses |
| `[REQUISITO 1-3]` | Requisitos | Conta PlayStation válida |
| `[ID_DO_PRODUTO]` | **IMPORTANTE!** O ID que você colocou em `store.js` | 7 |
| `[CLIENTE]` | Nome de um cliente | João Silva |
| `[AVALIAÇÃO/COMENTÁRIO]` | Feedback de cliente | Produto excelente, recomendo! |

### 3.3 - Exemplo de Edição Completa

**Antes (Template):**
```html
<title>[NOME DO PRODUTO] - XD Store</title>
<h1 class="product-title-main">[NOME DO PRODUTO]</h1>
<span id="product-price" class="price-current-single">R$ [PREÇO]</span>
<img src="../../assets/images/[NOME_ARQUIVO_IMAGEM].png" alt="[NOME DO PRODUTO]">
```

**Depois (Editado):**
```html
<title>PlayStation Plus 3 Meses - XD Store</title>
<h1 class="product-title-main">PlayStation Plus 3 Meses</h1>
<span id="product-price" class="price-current-single">R$ 45,90</span>
<img src="../../assets/images/ps-plus.png" alt="PlayStation Plus 3 Meses">
```

### 3.4 - A Linha MAIS IMPORTANTE (NÃO ESQUEÇA!)

No final do HTML, procure esta linha:

```javascript
const currentId = [ID_DO_PRODUTO]; // ALTERE ESTE NÚMERO
```

**Substitua `[ID_DO_PRODUTO]` pelo ID que você colocou em `store.js`**

Se seu produto tem `id: 7` em `store.js`, coloque:

```javascript
const currentId = 7; // ALTERE ESTE NÚMERO
```

⚠️ **Se você não fizer isso, o carrinho não vai funcionar!**

---

## ✅ Passo 4: Testar o Novo Produto

### 4.1 - Teste no Navegador

1. Abra `index.html` no navegador
2. O novo produto **deve aparecer** na lista da página inicial
3. Clique em "Ver Detalhes" para ir para a página do produto
4. Teste:
   - ✅ Imagem carrega corretamente?
   - ✅ Preço está correto?
   - ✅ Botão "Adicionar à Sacola" funciona?
   - ✅ Abre o carrinho ao clicar?
   - ✅ Produtos relacionados aparecem?

### 4.2 - Checklist de Testes

```
☐ Produto aparece na página inicial
☐ Imagem carrega (sem erros)
☐ Preço está correto
☐ Descrição está legível
☐ Botão "Adicionar à Sacola" funciona
☐ Carrinho abre quando clica
☐ Preço no carrinho bate com o anunciado
☐ Página de detalhes carrega sem erros no console
☐ Produtos relacionados aparecem
```

### 4.3 - Como Abrir o Console para Verificar Erros

1. Aperte `F12` (ou `Ctrl+Shift+I` no Windows)
2. Vá para a aba "Console"
3. Procure por mensagens de erro (em vermelho)
4. Se houver erro, anote e consulte a seção [Troubleshooting](#dicas-e-troubleshooting)

---

## 🆘 Dicas e Troubleshooting

### Problema: Produto não aparece na página inicial

**Possíveis causas:**
- ❌ Erro de sintaxe em `store.js` (vírgula faltando ou mal colocada)
- ❌ Propriedades obrigatórias faltando
- ❌ Arquivo não foi salvo

**Solução:**
1. Abra o Console (F12)
2. Procure por mensagens de erro
3. Verifique a sintaxe de `store.js`
4. Salve o arquivo e recarregue o navegador (Ctrl+Shift+R)

---

### Problema: Imagem não carrega

**Possíveis causas:**
- ❌ Caminho da imagem incorreto em `store.js`
- ❌ Arquivo de imagem deletado ou renomeado
- ❌ Arquivo em pasta errada

**Solução:**
1. Verifique: `assets/images/seu-arquivo.png` existe?
2. Verifique: Caminho em `store.js` bate com o nome real?
3. Se o arquivo é `assets/images/ps-plus.png`, em `store.js` deve ser:
   ```javascript
   img: "assets/images/ps-plus.png"
   ```

---

### Problema: Carrinho não abre ao clicar em "Adicionar"

**Possíveis causas:**
- ❌ `currentId` em HTML não bate com `id` em `store.js`
- ❌ Erro de JavaScript no Console

**Solução:**
1. Abra o Console (F12)
2. Procure por erros (mensagens vermelhas)
3. Verifique: `currentId` em HTML = `id` em `store.js`?
4. Exemplo correto:
   - Em `store.js`: `{ id: 7, name: "PlayStation Plus", ... }`
   - Em HTML: `const currentId = 7;`

---

### Problema: Preço não aparece na página de detalhes

**Possíveis causas:**
- ❌ `currentId` incorreto
- ❌ Elemento `#product-price` não existe no HTML

**Solução:**
1. Verifique se tem `<span id="product-price">` no HTML
2. Verifique se `currentId` está correto
3. Recarregue a página (Ctrl+Shift+R)

---

### Problema: Caracteres estranhos aparecem (❓ ou ❗)

**Possível causa:**
- ❌ Encoding de arquivo incorreto

**Solução:**
1. Abra o arquivo HTML
2. No editor, mude o encoding para **UTF-8**
3. Salve e recarregue

---

## 💡 Dicas Extras

### Cópia Rápida
Se você já tem um produto parecido pronto, pode simplesmente:
1. Copiar o arquivo HTML existente
2. Renomear para o novo produto
3. Editar apenas os placeholders
4. Adicionar em `store.js`

Mais rápido que usar o template!

### Testando Múltiplos Produtos
Se está adicionando vários produtos, teste cada um individualmente:
1. Adicione 1 em `store.js`
2. Crie o HTML
3. Teste no navegador
4. Depois adicione o próximo

Assim é mais fácil identificar problemas.

### Backup
Sempre faça backup dos arquivos principais antes de grandes mudanças:
- Cópia de `store.js`
- Cópia da pasta `pages/produtos/`

---

## 📞 Suporte

Se algo não funcionar:

1. ✅ Consulte a seção de [Troubleshooting](#dicas-e-troubleshooting)
2. ✅ Verifique o Console (F12) para erros
3. ✅ Repita os passos do guia
4. ✅ Compare com um produto que já funciona

---

## 📋 Resumo Rápido

**Para adicionar um novo produto:**

```
1. Abra js/store.js
2. Adicione: { id: [NOVO], name: "...", price: ..., promoPrice: ..., promoEnabled: ..., img: "...", description: "..." }
3. Salve a imagem em assets/images/
4. Copie PRODUTO-TEMPLATE.html para novo arquivo em pages/produtos/
5. Edite todos os [PLACEHOLDERS]
6. Procure por: const currentId = [ID_DO_PRODUTO];
7. Substitua pelo seu ID
8. Salve e teste no navegador
```

---

**FIM DO GUIA**

*Última atualização: 27/04/2026*
