// Captura botões e elementos do DOM
const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
const modalCarrinho = document.getElementById('modal-carrinho');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinhoEl = document.getElementById('total-carrinho');
const btnVerCarrinho = document.getElementById('btn-ver-carrinho');
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
const btnEnviarWhatsapp = document.getElementById('btn-enviar-whatsapp');
const contadorItens = document.getElementById('contador-itens');
const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');

// Elementos das opções de pedido
const selectTipoEntrega = document.getElementById('tipo-entrega');
const selectFormaPagamento = document.getElementById('forma-pagamento');
const inputTroco = document.getElementById('troco');

// Array pra guardar os itens do carrinho
let carrinho = [];

// Atualiza contador no menu
function atualizarContador() {
  let totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  contadorItens.textContent = totalItens;
}

// Atualiza a lista do carrinho no modal
function atualizarListaCarrinho() {
  listaCarrinho.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.quantidade}x ${item.nome}`;
    
    const precoItem = item.preco * item.quantidade;
    total += precoItem;
    
    const spanPreco = document.createElement('span');
    spanPreco.textContent = `R$ ${precoItem.toFixed(2).replace('.', ',')}`;
    li.appendChild(spanPreco);
    
    listaCarrinho.appendChild(li);
  });

  totalCarrinhoEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Adiciona item ao carrinho (se já existe, soma a quantidade)
function adicionarAoCarrinho(nome, preco) {
  const index = carrinho.findIndex(item => item.nome === nome);
  if (index > -1) {
    carrinho[index].quantidade++;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }
  atualizarContador();
}

// Mostrar e esconder modal
btnVerCarrinho.addEventListener('click', () => {
  atualizarListaCarrinho();
  modalCarrinho.classList.remove('hidden');
});

btnFecharCarrinho.addEventListener('click', () => {
  modalCarrinho.classList.add('hidden');
});

// Enviar pedido via WhatsApp formatado
btnEnviarWhatsapp.addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const tipoEntrega = selectTipoEntrega.value;
  const formaPagamento = selectFormaPagamento.value;
  let troco = inputTroco.value.trim();

  if (!troco || troco === '0' || troco === '0,00' || troco === '0.00') {
    troco = 'Não precisa de troco';
  } else {
    troco = `Precisa de troco para R$ ${troco}`;
  }

  let mensagem = 'Olá, gostaria de fazer o pedido:%0A';

  carrinho.forEach(item => {
    mensagem += `- ${item.quantidade}x ${item.nome}%0A`;
  });

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  mensagem += `%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
  mensagem += `%0ATipo de Pedido: ${tipoEntrega}`;
  mensagem += `%0AForma de Pagamento: ${formaPagamento}`;
  mensagem += `%0A${troco}`;

  // Número do WhatsApp (ajuste pro número real da sua empresa)
  const numeroWhatsapp = '5511999999999';

  const url = `https://wa.me/${numeroWhatsapp}?text=${mensagem}`;

  window.open(url, '_blank');
});

// Adiciona evento a cada botão adicionar
botoesAdicionar.forEach(btn => {
  btn.addEventListener('click', () => {
    const nome = btn.getAttribute('data-produto');
    const preco = parseFloat(btn.getAttribute('data-preco'));
    adicionarAoCarrinho(nome, preco);
  });
});

// Botão para limpar carrinho
btnLimparCarrinho.addEventListener('click', () => {
  carrinho = [];
  atualizarListaCarrinho();
  atualizarContador();
});
