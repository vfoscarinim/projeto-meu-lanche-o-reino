// Habilita/desabilita o input de quantidade ao marcar/desmarcar o checkbox do lanche
        document.querySelectorAll('.form-check-input[type=checkbox]').forEach((checkbox) => {
            checkbox.addEventListener('change', function () {
                const id = this.id;
                const qtdInput = document.getElementById('qtd-' + id);
                if (this.checked) {
                    qtdInput.disabled = false;
                } else {
                    qtdInput.disabled = true;
                    qtdInput.value = 1; // reseta a quantidade ao desmarcar
                }
            });
        });

        function finalizarPedido() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            const bebida = document.getElementById('bebida');
            const qtdBebida = document.getElementById('qtd-bebida').value;
            const observacao = document.getElementById('observacao').value.trim();

            let total = 0;
            let itens = [];

            if (checkboxes.length === 0) {
                alert("Selecione ao menos um lanche.");
                return;
            }

            // Processa lanches com quantidade
            checkboxes.forEach(cb => {
                const qtd = parseInt(document.getElementById('qtd-' + cb.id).value) || 1;
                const preco = parseFloat(cb.dataset.price);
                total += preco * qtd;
                itens.push(`${qtd}x ${cb.value}`);
            });

            // Processa bebida com quantidade
            const bebidaSelecionada = bebida.options[bebida.selectedIndex];
            if (!bebidaSelecionada || bebidaSelecionada.value === "") {
                alert("Selecione uma bebida.");
                return;
            }
            const precoBebida = parseFloat(bebidaSelecionada.dataset.price);
            const qtdBebidaNum = parseInt(qtdBebida) || 1;
            total += precoBebida * qtdBebidaNum;
            itens.push(`${qtdBebidaNum}x ${bebidaSelecionada.value}`);

            // Atualiza total
            document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

            // Conteúdo para QRCode com observação incluída
            let qrContent = `PIX - O Reino Burguer\nItens: ${itens.join(", ")}\nTotal: R$ ${total.toFixed(2)}`;
            if (observacao) {
                qrContent += `\nObservações: ${observacao}`;
            }

            QRCode.toCanvas(document.createElement('canvas'), qrContent, { width: 200 }, (err, canvas) => {
                if (!err) {
                    const qrcodeDiv = document.getElementById('qrcode');
                    qrcodeDiv.innerHTML = "<h6 class='text-center mt-3'>QR Code para pagamento:</h6>";
                    qrcodeDiv.appendChild(canvas);
                }
            });

            const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
            modal.show();
        }

        function atualizarSabores() {
  const bebidaSelect = document.getElementById('bebida');
  const saborContainer = document.getElementById('sabores-container');
  const saborSelect = document.getElementById('sabor-bebida');
  
  const tipo = bebidaSelect.options[bebidaSelect.selectedIndex]?.dataset.tipo;

  // Limpar sabores antigos
  saborSelect.innerHTML = '';

  if (tipo === 'refri') {
    saborContainer.style.display = 'block';
    const saboresRefri = ['Coca-Cola', 'Fanta Laranja', 'Fanta Uva', 'Sprite', 'Guaraná'];
    saboresRefri.forEach(sabor => {
      const opt = document.createElement('option');
      opt.value = sabor;
      opt.textContent = sabor;
      saborSelect.appendChild(opt);
    });
  } else if (tipo === 'suco') {
    saborContainer.style.display = 'block';
    const saboresSuco = ['Uva', 'Laranja', 'Pêssego', 'Maracujá'];
    saboresSuco.forEach(sabor => {
      const opt = document.createElement('option');
      opt.value = sabor;
      opt.textContent = sabor;
      saborSelect.appendChild(opt);
    });
  } else {
    // Se água ou outro, esconder sabores
    saborContainer.style.display = 'none';
  }
}

// Habilita/desabilita quantidade do lanche
document.querySelectorAll('.form-check-input[type=checkbox]').forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const id = checkbox.id;
    const qtdInput = document.getElementById('qtd-' + id);
    qtdInput.disabled = !checkbox.checked;
    if (!checkbox.checked) qtdInput.value = 1;
  });
});

function atualizarSaboresPorTipo(tipo, saborSelect) {
  saborSelect.innerHTML = '';
  let sabores = [];

  if (tipo === 'refri') {
    sabores = ['Coca-Cola', 'Fanta Laranja', 'Fanta Uva', 'Sprite', 'Guaraná'];
  } else if (tipo === 'suco') {
    sabores = ['Uva', 'Laranja', 'Pêssego', 'Maracujá'];
  }

  if (sabores.length === 0) {
    saborSelect.disabled = true;
    return;
  }

  saborSelect.disabled = false;
  sabores.forEach(sabor => {
    const opt = document.createElement('option');
    opt.value = sabor;
    opt.textContent = sabor;
    saborSelect.appendChild(opt);
  });
}

function criarBlocoBebida() {
  const container = document.getElementById('bebidas-container');

  const div = document.createElement('div');
  div.classList.add('d-flex', 'align-items-center', 'mb-2', 'bebida-item');
  div.style.gap = '10px';

  // Select tipo bebida
  const selectTipo = document.createElement('select');
  selectTipo.className = 'form-select bebida-tipo';
  selectTipo.style.width = '220px';
  selectTipo.required = true;

  const optionDefault = document.createElement('option');
  optionDefault.value = '';
  optionDefault.textContent = 'Selecione tipo bebida';
  optionDefault.disabled = true;
  optionDefault.selected = true;

  selectTipo.appendChild(optionDefault);

  const tipos = [
    { value: 'refri', text: 'Refrigerante' },
    { value: 'suco', text: 'Suco' },
    { value: 'agua', text: 'Água' },
  ];

  tipos.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.value;
    opt.textContent = t.text;
    selectTipo.appendChild(opt);
  });

  // Select sabor bebida
  const selectSabor = document.createElement('select');
  selectSabor.className = 'form-select bebida-sabor';
  selectSabor.style.width = '180px';
  selectSabor.disabled = true;
  selectSabor.required = true;

  // Quantidade
  const inputQtd = document.createElement('input');
  inputQtd.type = 'number';
  inputQtd.className = 'form-control bebida-qtd';
  inputQtd.min = 1;
  inputQtd.value = 1;
  inputQtd.style.width = '80px';
  inputQtd.required = true;

  // Botão remover
  const btnRemover = document.createElement('button');
  btnRemover.type = 'button';
  btnRemover.className = 'btn btn-danger btn-sm';
  btnRemover.textContent = 'X';
  btnRemover.title = 'Remover bebida';
  btnRemover.onclick = () => div.remove();

  // Evento para atualizar sabores quando mudar o tipo
  selectTipo.addEventListener('change', () => {
    atualizarSaboresPorTipo(selectTipo.value, selectSabor);
  });

  div.appendChild(selectTipo);
  div.appendChild(selectSabor);
  div.appendChild(inputQtd);
  div.appendChild(btnRemover);

  container.appendChild(div);
}

function finalizarPedido() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  let total = 0;
  let itens = [];

  // Processa lanches
  checkboxes.forEach(cb => {
    const id = cb.id;
    const qtdInput = document.getElementById('qtd-' + id);
    let qtd = parseInt(qtdInput.value) || 1;
    if (qtd < 1) qtd = 1;
    const preco = parseFloat(cb.dataset.price);
    total += preco * qtd;
    itens.push(`${qtd}x ${cb.value}`);
  });

  // Processa bebidas múltiplas
  const bebidaItems = document.querySelectorAll('.bebida-item');
  if (bebidaItems.length === 0) {
    alert('Adicione ao menos uma bebida.');
    return;
  }

  bebidaItems.forEach(div => {
    const tipo = div.querySelector('.bebida-tipo').value;
    const sabor = div.querySelector('.bebida-sabor').value;
    let qtd = parseInt(div.querySelector('.bebida-qtd').value) || 1;
    if (qtd < 1) qtd = 1;

    // Preço por tipo e tamanho fixos:
    // Para simplicidade, vamos assumir preços:
    // Refrigerante 350ml = R$5,00
    // Refrigerante 500ml = R$7,00
    // Suco 290ml = R$8,00
    // Água 500ml = R$4,00
    // Mas aqui só tem tipo, então vou usar preço médio fixo por tipo:
    let precoUnit = 0;
    if (tipo === 'refri') precoUnit = 6.0;
    else if (tipo === 'suco') precoUnit = 8.0;
    else if (tipo === 'agua') precoUnit = 4.0;

    total += precoUnit * qtd;

    itens.push(`${qtd}x ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}${sabor ? ' (' + sabor + ')' : ''}`);
  });

  if (itens.length === 0) {
    alert('Selecione ao menos um lanche e uma bebida.');
    return;
  }

  // Observação
  const observacao = document.getElementById('observacao').value.trim();
  if (observacao.length > 0) {
    itens.push(`Observação: ${observacao}`);
  }

  document.getElementById('total').innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

  const qrContent = `PIX - O Reino Burguer\nItens: ${itens.join(", ")}\nTotal: R$ ${total.toFixed(2)}`;
  QRCode.toCanvas(document.createElement('canvas'), qrContent, { width: 200 }, (err, canvas) => {
    if (!err) {
      const qrcodeDiv = document.getElementById('qrcode');
      qrcodeDiv.innerHTML = "<h6 class='text-center mt-3'>QR Code para pagamento:</h6>";
      qrcodeDiv.appendChild(canvas);
    }
  });

  const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
  modal.show();
}


//* Função de navegação das pags *//

function irParaCardapio() {
  window.location.href = 'cardapio.html';
}

function fazerPedido() {
  window.location.href = 'pedido.html'
}

function voltarParaInicio() {
  window.location.href = 'index.html'
}