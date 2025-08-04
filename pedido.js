function finalizarPedido() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const bebida = document.getElementById('bebida');
  let total = 0;
  let itens = [];

  checkboxes.forEach(cb => {
    total += parseFloat(cb.dataset.price);
    itens.push(cb.value);
  });

  const bebidaSelecionada = bebida.options[bebida.selectedIndex];
  if (bebidaSelecionada && bebidaSelecionada.dataset.price) {
    total += parseFloat(bebidaSelecionada.dataset.price);
    itens.push(bebidaSelecionada.value);
  }

  if (itens.length === 0) {
    alert("Selecione ao menos um lanche e uma bebida.");
    return;
  }

  document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

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