// Função para formatar data no padrão DD/MM/AAAA - HH:MM
function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
}

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

async function finalizarPedido() {
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

    // --------- ENVIAR PARA SHEET MONKEY ---------
    const urlApi = "https://api.sheetmonkey.io/form/u2w1g2zWZzqX1kpZXLJptz"; // substitua aqui pela sua URL real

    // Monta o objeto para envio (separe itens e observacao)
const pedidoParaEnvio = {
    itens: itens.filter(i => !i.startsWith('Observação:')).join(", "),
    observacao: observacao,
    total: total.toFixed(2),
    data: formatarData(new Date())
};
    try {
        const response = await fetch(urlApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedidoParaEnvio)
        });

        if (response.ok) {
            alert("Pedido enviado com sucesso!");
            document.getElementById("pedidoForm").reset();
            document.getElementById('total').innerText = `Total: R$ 0,00`;
            document.getElementById('qrcode').innerHTML = '';
        } else {
            alert("Erro ao enviar pedido para a planilha.");
        }
    } catch (error) {
        alert("Erro na conexão: " + error.message);
    }
    // ---------------------------------------------

    const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    modal.show();
}



//* Função de navegação das pags *//

function irParaCardapio() {
    window.location.href = 'cardapio.html';
}

function fazerPedido() {
    window.location.href = 'pedido.html';
}

function voltarParaInicio() {
    window.location.href = 'index.html';
}
