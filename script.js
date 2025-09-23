// === CONFIG ===
const TAXA_ENTREGA = 8.0;

// === DOM ===
const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
const modalCarrinho = document.getElementById('modal-carrinho');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinhoEl = document.getElementById('total-carrinho');
const btnVerCarrinho = document.getElementById('btn-ver-carrinho');
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
const btnEnviarWhatsapp = document.getElementById('btn-enviar-whatsapp');
const contadorItens = document.getElementById('contador-itens');
const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');

// opções de pedido
const selectTipoEntrega = document.getElementById('tipo-entrega');
const campoEndereco = document.getElementById('campo-endereco');
const inputEndereco = document.getElementById('endereco');
const selectFormaPagamento = document.getElementById('forma-pagamento');
const inputTroco = document.getElementById('troco');

// array do carrinho
let carrinho = [];

// === Helpers ===
function calcularSubtotal() {
  return carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
}

function atualizarContador() {
  contadorItens.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
}

function atualizarListaCarrinho() {
  listaCarrinho.innerHTML = '';
  carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.quantidade}x ${item.nome}`;
    const precoItem = item.preco * item.quantidade;
    const spanPreco = document.createElement('span');
    spanPreco.textContent = `R$ ${precoItem.toFixed(2).replace('.', ',')}`;
    li.appendChild(spanPreco);

    // botão remover
    const btnRem = document.createElement('button');
    btnRem.textContent = 'Remover';
    btnRem.style.marginLeft = '10px';
    btnRem.addEventListener('click', () => {
      if (item.quantidade > 1) {
        item.quantidade--;
      } else {
        carrinho.splice(index, 1);
      }
      atualizarListaCarrinho();
      atualizarContador();
      atualizarTotal();
    });
    li.appendChild(btnRem);

    listaCarrinho.appendChild(li);
  });
  atualizarTotal();
}

function atualizarTotal() {
  let total = calcularSubtotal();
  if (selectTipoEntrega && selectTipoEntrega.value === 'Entrega') {
    total += TAXA_ENTREGA;
  }
  totalCarrinhoEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

// === Eventos ===
if (btnVerCarrinho) {
  btnVerCarrinho.addEventListener('click', () => {
    atualizarListaCarrinho();
    modalCarrinho.classList.remove('hidden');
  });
}

if (btnFecharCarrinho) {
  btnFecharCarrinho.addEventListener('click', () => {
    modalCarrinho.classList.add('hidden');
  });
}

if (btnLimparCarrinho) {
  btnLimparCarrinho.addEventListener('click', () => {
    carrinho = [];
    atualizarListaCarrinho();
    atualizarContador();
  });
}

if (selectTipoEntrega) {
  selectTipoEntrega.addEventListener('change', () => {
    if (campoEndereco) {
      campoEndereco.style.display = (selectTipoEntrega.value === 'Entrega') ? 'block' : 'none';
    }
    atualizarTotal();
  });
}

if (btnEnviarWhatsapp) {
  btnEnviarWhatsapp.addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const tipo = selectTipoEntrega ? selectTipoEntrega.value : '';
    const forma = selectFormaPagamento ? selectFormaPagamento.value : '';
    let troco = inputTroco ? inputTroco.value.trim() : '';
    if (!troco || troco === '0' || troco === '0,00' || troco === '0.00') {
      troco = 'Não precisa de troco';
    } else {
      troco = `Precisa de troco para R$ ${troco}`;
    }

    let mensagem = 'Olá, gostaria de fazer o pedido:%0A';
    carrinho.forEach(item => {
      mensagem += `- ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}%0A`;
    });

    let total = calcularSubtotal();
    if (tipo === 'Entrega') total += TAXA_ENTREGA;

    mensagem += `%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    mensagem += `%0ATipo de Pedido: ${tipo}`;
    if (tipo === 'Entrega' && inputEndereco) {
      mensagem += `%0AEndereço: ${encodeURIComponent(inputEndereco.value)}`;
    }
    mensagem += `%0AForma de Pagamento: ${forma}`;
    mensagem += `%0A${troco}`;

    const numeroWhatsapp = '5511999999999'; // <-- coloque seu número real
    const url = `https://wa.me/${numeroWhatsapp}?text=${mensagem}`;
    window.open(url, '_blank');
  });
}

// === Adicionar itens (lanches, sorvetes, combos etc.) ===
botoesAdicionar.forEach(btn => {
  btn.addEventListener('click', () => {
    const nome = btn.getAttribute('data-produto');
    const preco = parseFloat(btn.getAttribute('data-preco'));
    const idx = carrinho.findIndex(i => i.nome === nome);
    if (idx > -1) {
      carrinho[idx].quantidade++;
    } else {
      carrinho.push({ nome, preco, quantidade: 1 });
    }
    atualizarContador();
    atualizarListaCarrinho();
  });
});

// === Fluxo Pastel Personalizado ===
const tamanhoPastelSelect = document.getElementById('tamanho-pastel');
const btnEscolherSabores = document.getElementById('btn-escolher-sabores');
const modalSabores = document.getElementById('modal-sabores');
const listaSaboresCheckbox = document.querySelectorAll('#lista-sabores input[type="checkbox"]');
const contadorSaboresEl = document.getElementById('contador-sabores');
const btnAdicionarCarrinhoPastel = document.getElementById('btn-adicionar-carrinho-pastel');
const btnFecharSabores = document.getElementById('btn-fechar-sabores');

let tamanhoSelecionado = '';
let precoSelecionado = 0;
let maxSabores = 0;

if (btnEscolherSabores) {
  btnEscolherSabores.addEventListener('click', () => {
    if (!tamanhoPastelSelect.value) {
      alert('Selecione o tamanho do pastel primeiro.');
      return;
    }

    tamanhoSelecionado = tamanhoPastelSelect.value;
    precoSelecionado = parseFloat(tamanhoPastelSelect.selectedOptions[0].dataset.preco);

    if (tamanhoSelecionado === 'Pequeno') maxSabores = 2;
    if (tamanhoSelecionado === 'Médio') maxSabores = 3;
    if (tamanhoSelecionado === 'Grande') maxSabores = 4;

    listaSaboresCheckbox.forEach(cb => cb.checked = false);
    contadorSaboresEl.textContent = `0 selecionados (máx. ${maxSabores})`;

    modalSabores.classList.remove('hidden');
  });
}

listaSaboresCheckbox.forEach(cb => {
  cb.addEventListener('change', () => {
    let selecionados = document.querySelectorAll('#lista-sabores input:checked').length;
    if (selecionados > maxSabores) {
      cb.checked = false;
      alert(`Máximo de ${maxSabores} sabores para tamanho ${tamanhoSelecionado}`);
    }
    contadorSaboresEl.textContent = `${document.querySelectorAll('#lista-sabores input:checked').length} selecionados (máx. ${maxSabores})`;
  });
});

if (btnAdicionarCarrinhoPastel) {
  btnAdicionarCarrinhoPastel.addEventListener('click', () => {
    let saboresEscolhidos = [...document.querySelectorAll('#lista-sabores input:checked')].map(cb => cb.value);

    if (saboresEscolhidos.length !== maxSabores) {
      alert(`Escolha exatamente ${maxSabores} sabores!`);
      return;
    }

    let nomeFinal = `Pastel ${tamanhoSelecionado} (${saboresEscolhidos.join(', ')})`;
    carrinho.push({ nome: nomeFinal, preco: precoSelecionado, quantidade: 1 });

    atualizarContador();
    atualizarListaCarrinho();

    modalSabores.classList.add('hidden');
  });
}

if (btnFecharSabores) {
  btnFecharSabores.addEventListener('click', () => {
    modalSabores.classList.add('hidden');
  });
}
