let modalConfirmacao = `
<div class="modal fade" id="modalConfirmacao" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalMensagemTitulo"></h5>
      </div>
      <div class="modal-body" id="conteudoModalMensagem">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="modalConfirmacaoCancelar" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-corpadraosite" id="modalConfirmacaoConfirmar">Confirmar</button>
      </div>
    </div>
  </div>
</div>
`

let modalContagemTempo = `
<div class="modal fade" id="modalContagemTempo" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalContagemTempoTitulo"></h5>
      </div>
      <div class="modal-body">
        <div class="row contagemtempo-maincontent d-flex justify-content-center">
          <div class="col-12 alarmclock-container py-4">
            <img src="assets/alarm-clock.svg" class="img-fluid" alt="ícone relógio">
          </div>
          <div class="col-12 d-flex justify-content-center py-4 textoContagemTempo" id="campoContadorTempo"></div>
          <div class="col-12 py-3 d-flex flex-wrap justify-content-center">
            <button type="button" id="btn_pedirmaistempo" class="btn botao-opcaocontagem nao-visivel">Pedir Mais Tempo</button>
            <button type="button" id="btn_pausarcontagemtarefa" class="btn botao-opcaocontagem">Pausar Tarefa</button>
            <button type="button" id="btn_finalizartarefa" class="btn botao-opcaocontagem">Finalizar Tarefa</button>
          </div>
          <div
            id="containerNovaContagem"
            style="display: none !important"
            class="col-12 py-3 d-flex flex-wrap flex-column align-items-center justify-content-center">
            <h4>Digite a nova duração da sua tarefa</h4>
            <div class="col-12 py-3 d-flex flex-wrap justify-content-center">
              <input type="time" id="campoNovaDuracao" class="form-control duracao-customizada">
              <button type="button" id="btn_concluirAdicaoTempo" class="btn botao-opcaocontagem">
                Adicionar Tempo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`

var idTarefaSendoEditada;

const PENDENTE = 1;
const INICIALIZADA = 2;
const PAUSADA = 3;
const FINALIZADA = 4;

function leDados() {
  let strDados = localStorage.getItem('db_tarefas');
  let objDados = {};
  if (strDados) {
    objDados = JSON.parse(strDados);
  }
  else {
    objDados = {
      tarefa: []
    }
  }

  return objDados;
}
function salvaDados(dados) {
  localStorage.setItem('db_tarefas', JSON.stringify(dados));
}

function verificaSeTarefaExiste(tituloTarefa) {
  let objDados = leDados();
  let tarefasUsuarioCorrente = [];
  tarefasUsuarioCorrente = objDados.tarefa.filter((tarefa) => tarefa.cadastradoPor === usuarioCorrente.email);

  if (tarefasUsuarioCorrente.length == 0) {
    return false;
  } else {
    for (var i = 0; i < tarefasUsuarioCorrente.length; i++) {
      if (tituloTarefa == tarefasUsuarioCorrente[i].titulo) {
        return true;
      }
    }
    return false;
  }
}

function formatarData(data) {
  let diaData = data.slice(8, 10);
  let mesData = data.slice(5, 7);
  let anoData = data.slice(0, 4);
  return diaData + "/" + mesData + "/" + anoData;
}

function incluirTarefa() {
  // Ler os dados do localStorage
  let objDados = leDados();

  // Incluir um nova tarefa
  let novoId;
  if (objDados.tarefa.length == 0) {
    novoId = 1;
  } else {
    novoId = objDados.tarefa[objDados.tarefa.length - 1].id + 1
  }
  let strTitulo = document.getElementById('tituloTarefaModal').value;
  let strCategoria = document.getElementById('categoriaTarefa').value;
  let strData = document.getElementById('datatarefa').value;
  let strDuracao = document.getElementById('duracaotarefa').value;
  let strDescricao = document.getElementById('descricaotarefa').value;
  let prioridadeAlta = document.getElementById('tarefaPrioridadeAlta').checked;
  let prioridadeMedia = document.getElementById('tarefaPrioridadeMedia').checked;
  let prioridadeBaixa = document.getElementById('tarefaPrioridadeBaixa').checked;
  let strPrioridade = undefined;
  let dataFormatada = formatarData(strData);

  if (prioridadeAlta) {
    strPrioridade = 1;
  } else if (prioridadeMedia) {
    strPrioridade = 2;
  } else if (prioridadeBaixa) {
    strPrioridade = 3;
  } else {
    strPrioridade = '';
  }

  if (strTitulo === '' || strCategoria === '' || strData === '' || strDuracao === '' || strDescricao === '' || strPrioridade === '') {
    adicionaMensagem('*Todos os campos precisam estar preenchidos', 'modalInclusaoTarefas');

    setTimeout(function () {
      removeMensagem('*Todos os campos precisam estar preenchidos', 'modalInclusaoTarefas');
    }, 2000)
  } else {
    let novaTarefa = {
      id: novoId,
      titulo: strTitulo,
      categoria: strCategoria,
      data: dataFormatada,
      duracao: strDuracao,
      descricao: strDescricao,
      prioridade: strPrioridade,
      cadastradoPor: usuarioCorrente.email,
      statusExecucao: PENDENTE,
    };
    const tarefaJaExiste = verificaSeTarefaExiste(strTitulo);

    if (!tarefaJaExiste) {
      objDados.tarefa.push(novaTarefa);
      // Salvar os dados no localStorage novamente
      salvaDados(objDados);

      // Atualiza os dados da tela
      imprimeDados();
    }
    else {
      renderizaAlert('Essa tarefa já foi adicionada', 'danger');
    }

    limpaCamposModal();
    $('#modalInclusaoTarefas').modal('hide');
  }
}

function limpaCamposModal() {
  let titulo = document.getElementById('tituloTarefaModal');
  let data = document.getElementById('datatarefa');
  let duracao = document.getElementById('duracaotarefa');
  let descricao = document.getElementById('descricaotarefa');
  let prioridadeAlta = document.getElementById('tarefaPrioridadeAlta');
  let prioridadeMedia = document.getElementById('tarefaPrioridadeMedia');
  let prioridadeBaixa = document.getElementById('tarefaPrioridadeBaixa');

  titulo.value = '';
  $('#categoriaTarefa option:first').prop('selected', true);
  data.value = '';
  duracao.value = '';
  descricao.value = '';
  prioridadeAlta.checked = false;
  prioridadeMedia.checked = false;
  prioridadeBaixa.checked = false;
}

function deletaTarefa(id = null) {
  let objDados = leDados();
  // Filtra o array removendo o elemento com o id passado
  if (id !== null) {
    objDados.tarefa = objDados.tarefa.filter((element) => { return element.id != id });
    $(`#btn_excluir-${id}`).off('click', '**');
    $(`#iniciarTarefa-${id}`).off('click', '**');
    // Salvar os dados no localStorage novamente
    salvaDados(objDados);
    imprimeDados();
  }
}

function editarTarefa(id) {
  let objDados = leDados();
  // Localiza o indice do objeto a ser alterado no array a partir do seu ID
  let index = objDados.tarefa.map(obj => obj.id).indexOf(id);
  idTarefaSendoEditada = objDados.tarefa[index].id;
  let campoTitulo = objDados.tarefa[index].titulo;
  let campoCategoria = objDados.tarefa[index].categoria;
  let campoData = objDados.tarefa[index].data;
  let campoDuracao = objDados.tarefa[index].duracao;
  let campoDescricao = objDados.tarefa[index].descricao;
  let camposPrioridade = objDados.tarefa[index].prioridade;
  let data = "20" + campoData.slice(6, 8) + "-" + campoData.slice(3, 5) + "-" + campoData.slice(0, 2);

  $("#editTitulo").val(campoTitulo);
  $("#editCategoriaTarefa").val(campoCategoria);
  $("#editDataTarefa").val(data);
  $("#editDuracaotarefa").val(campoDuracao);
  $("#editDescricaotarefa").val(campoDescricao);

  if (camposPrioridade == 1) {
    document.getElementById('editPrioridadeAlta').checked = true;
  } else if (camposPrioridade == 2) {
    document.getElementById('editPrioridadeMedia').checked = true
  } else {
    document.getElementById('editPrioridadeBaixa').checked = true;
  }

}

function salvaEdicao() {
  let objDados = leDados();
  let index = objDados.tarefa.map(obj => obj.id).indexOf(idTarefaSendoEditada - 0);
  let strTitulo = document.getElementById('editTitulo').value;
  let strCategoria = document.getElementById('editCategoriaTarefa').value;
  let strData = document.getElementById('editDataTarefa').value;
  let strDuracao = document.getElementById('editDuracaotarefa').value;
  let strDescricao = document.getElementById('editDescricaotarefa').value;
  let prioridadeAlta = document.getElementById('editPrioridadeAlta').checked;
  let prioridadeMedia = document.getElementById('editPrioridadeMedia').checked;
  let prioridadeBaixa = document.getElementById('editPrioridadeBaixa').checked;
  let strPrioridade = undefined;
  let dataFormatada = formatarData(strData);

  if (prioridadeAlta) {
    strPrioridade = 1;
  } else if (prioridadeMedia) {
    strPrioridade = 2;
  } else if (prioridadeBaixa) {
    strPrioridade = 3;
  } else {
    strPrioridade = '';
  }

  if (strTitulo === '' || strCategoria === '' || strData === '' || strDuracao === '' || strDescricao === '' || strPrioridade === '') {
    adicionaMensagem('*Todos os campos precisam estar preenchidos', 'modalInclusaoTarefas');

    setTimeout(function () {
      removeMensagem('*Todos os campos precisam estar preenchidos', 'modalInclusaoTarefas');
    }, 2000)
  } else {
    objDados.tarefa[index].titulo = strTitulo;
    objDados.tarefa[index].categoria = strCategoria;
    objDados.tarefa[index].data = dataFormatada;
    objDados.tarefa[index].duracao = strDuracao;
    objDados.tarefa[index].descricao = strDescricao;
    objDados.tarefa[index].prioridade = strPrioridade;

    // Salvar os dados no localStorage novamente
    salvaDados(objDados);

    // Atualiza os dados da tela
    imprimeDados();
    $('#editnModal').modal('hide');
  }
}

function mostrarModalDeConfirmacao(titulo, mensagem, funcao, dados, idModalDeOrigem) {
  $('body').append(modalConfirmacao);
  if (idModalDeOrigem) {
    $(`#${idModalDeOrigem}`).modal('hide');
  }
  const containerTituloModal = document.getElementById('modalMensagemTitulo');
  containerTituloModal.innerHTML = titulo;
  const modalConfirmacaoEl = document.getElementById('modalConfirmacao');
  const containerMensagemModal = document.getElementById('conteudoModalMensagem');
  containerMensagemModal.innerHTML = mensagem;
  const botaoConfirmar = document.getElementById('modalConfirmacaoConfirmar');
  const botaoCancelar = document.getElementById('modalConfirmacaoCancelar');
  botaoConfirmar.addEventListener('click', function () {
    if (dados) {
      funcao(dados);
    }
    else {
      funcao();
    }
    $('#modalConfirmacao').modal('hide');
    document.getElementsByTagName('body')[0].removeChild(modalConfirmacaoEl);
  });
  botaoCancelar.addEventListener('click', function () {
    document.getElementsByTagName('body')[0].removeChild(modalConfirmacaoEl);
  });
  $('#modalConfirmacao').modal('toggle');
}

function noFechamentoDoModalContagem(horasRestantes, minutos, idTarefa, status) {
  let strDuracao = `${horasRestantes.toString()}:${minutos.toString()}`;
  let objDados = leDados();
  let indexObjetoTarefa = null;
  let tarefa;
  indexObjetoTarefa = objDados.tarefa.findIndex(tarefa => tarefa.id === idTarefa);
  const modalContagemtempoEl = document.getElementById('modalContagemTempo');

  if (status === PAUSADA && parseInt(horasRestantes) === 0 && parseInt(minutos) === 0) {
    renderizaAlert('Não é possível pausar tarefas com menos de 1 minuto de duração. Finalize a tarefa ou espere até o tempo acabar para redefinir o tempo.', 'warning');
  } else {
    $('#modalContagemTempo').modal('hide');
    document.getElementsByTagName('body')[0].removeChild(modalContagemtempoEl);

    if (idTarefa !== null) {
      tarefa = objDados.tarefa.filter((tarefa) => tarefa.id === idTarefa)[0];
      tarefa.duracao = strDuracao;
      tarefa.statusExecucao = status;
      if (status === FINALIZADA) {
        tarefa.prioridade = FINALIZADA;
      }
    }
    objDados.tarefa[indexObjetoTarefa] = tarefa;
    salvaDados(objDados);
    imprimeDados();

    if (status === PAUSADA) {
      renderizaAlert('Tarefa pausada com sucesso!', 'success');
    }
  }
}

function adicionarNovaDuracao(idTarefa) {
  let objDados = leDados();
  let tarefa;
  let indexObjetoTarefa = null;
  indexObjetoTarefa = objDados.tarefa.findIndex(tarefa => tarefa.id === idTarefa);
  const novaDuracao = document.getElementById('campoNovaDuracao').value;
  const modalContagemtempoEl = document.getElementById('modalContagemTempo');

  if (novaDuracao !== '' && idTarefa !== null) {
    tarefa = objDados.tarefa.filter((tarefa) => tarefa.id === idTarefa)[0];
    tarefa.duracao = novaDuracao;
    tarefa.statusExecucao = PAUSADA;
    objDados.tarefa[indexObjetoTarefa] = tarefa;
    salvaDados(objDados);
    imprimeDados();
    $('#modalContagemTempo').modal('hide');
    document.getElementsByTagName('body')[0].removeChild(modalContagemtempoEl);
    renderizaAlert('O tempo da tarefa foi redefinido com sucesso!', 'success');
  } else {
    renderizaAlert('O campo da nova duração não pode estar vazio. Finalize a tarefa caso não queira adicionar um novo tempo.', 'danger');
  }
}

function noFinalDaContagem(idTarefa) {
  const cntNovaContagem = document.getElementById('containerNovaContagem');

  $('#btn_pausarcontagemtarefa').addClass('nao-visivel');
  $('#btn_pedirmaistempo').addClass('visivel');
  $('#btn_pedirmaistempo').unbind().click(function () {
    cntNovaContagem.style.display = 'block';
  });
  $('#btn_concluirAdicaoTempo').unbind().click(function () {
    adicionarNovaDuracao(idTarefa);
  });
}

function disparaContador(duracao, campo, idTarefa) {
  let momentoAtual = new Date();
  let tempoTotal = new Date(momentoAtual.getTime() + duracao * 60000).getTime();
  let diferenca;
  let horas;
  let minutos;
  let segundos;

  function contador() {
    let agora = new Date().getTime();
    diferenca = tempoTotal - agora;

    horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
    horas = horas < 10 ? "0" + horas.toString() : horas;
    minutos = minutos < 10 ? "0" + minutos.toString() : minutos;
    segundos = segundos < 10 ? "0" + segundos.toString() : segundos;

    campo.textContent = horas + ":" + minutos + ":" + segundos;

    if (diferenca >= 1000) {
      requestAnimationFrame(contador);
    } else {
      noFinalDaContagem(idTarefa);
    }
  };

  contador();
  requestAnimationFrame(contador);

  $('#btn_pausarcontagemtarefa').unbind().click(function () { noFechamentoDoModalContagem(horas, minutos, idTarefa, PAUSADA); })
  $('#btn_finalizartarefa').unbind().click(function () { noFechamentoDoModalContagem(horas, minutos, idTarefa, FINALIZADA); })
}

function iniciarTarefa(idTarefa = null) {
  let objDados = leDados();
  let tarefa;
  let duracaoTarefa;
  let minutos;
  let horas;
  let duracaoEmMinutos;
  let campoDeExibicaoDoContador;
  let tituloCotagemTempo;

  $('body').append(modalContagemTempo);
  if (idTarefa !== null) {
    tarefa = objDados.tarefa.filter((tarefa) => tarefa.id === idTarefa)[0];
    duracaoTarefa = tarefa.duracao;
  }
  horas = duracaoTarefa.split(":")[0];
  minutos = duracaoTarefa.split(":")[1];
  duracaoEmMinutos = (parseInt(horas) * 60) + parseInt(minutos);

  if (duracaoEmMinutos > 0) {
    $('#modalContagemTempo').modal('toggle');
    campoDeExibicaoDoContador = document.getElementById('campoContadorTempo');
    tituloCotagemTempo = document.getElementById('modalContagemTempoTitulo');
    tituloCotagemTempo.innerHTML = tarefa.titulo;
    disparaContador(duracaoEmMinutos, campoDeExibicaoDoContador, idTarefa);
  }
  else {
    renderizaAlert('Essa tarefa não pode ser mais inicializada porque não possui mais nenhum tempo sobrando!', 'danger');
  }
}

function imprimeDados() {
  let tela = document.getElementById('tela');
  let strHtml = '';
  let objDados = leDados();
  let tarefasDoUsuario = objDados.tarefa.filter((tarefa) => {
    return tarefa.cadastradoPor === usuarioCorrente.email
  })
  let filterCateg = document.getElementById('filtroCategoria').value;
  let filterPrior = {
    'ALTA': 1,
    'MÉDIA': 2,
    'BAIXA': 3,
    'TODAS': 'TODAS'

  }
  const cores = {
    1: 'card-vermelho',
    2: 'card-amarelo',
    3: 'card-verde',
    4: 'card-finalizada'
  }

  const labelBotao = {
    1: 'INICIAR',
    2: 'RETOMAR',
    3: 'RETOMAR',
    4: 'FINALIZADA',
  }

  if (tarefasDoUsuario.length > 0) {
    for (i = 0; i < tarefasDoUsuario.length; i++) {
      let corDoCard = cores[tarefasDoUsuario[i].prioridade];
      let texto = labelBotao[tarefasDoUsuario[i].statusExecucao];
      let disabled = tarefasDoUsuario[i].statusExecucao === FINALIZADA ? true : false;
      if ((filterCateg == tarefasDoUsuario[i].categoria || filterCateg == 'TODAS') && (filterPrior[document.getElementById("filtroPrioridade").value] == tarefasDoUsuario[i].prioridade || filterPrior[document.getElementById("filtroPrioridade").value] == 'TODAS')) {

        strHtml += `
        <div class="col-lg-4 col-md-6 col-sm-12 px-4" >
          <div class="card my-4 mx-0 ${corDoCard}" id="cards" mb-3" style="max-width: 450px;">
            <div class="card-body text-right py-1 px-1">
              <button type="button" ${disabled ? 'disabled' : ''} id ="btn_editar" onclick="editarTarefa(${tarefasDoUsuario[i].id})" data-toggle="modal" data-target="#editnModal" class="btn btn-dark btn-circle btn-sm"><svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>
              <button
                type="button"
                id ="btn_excluir"
                onclick="mostrarModalDeConfirmacao('Excluir tarefa', 'Deseja mesmo excluir essa tarefa?', deletaTarefa, ${tarefasDoUsuario[i].id})"
                class="btn btn-dark btn-circle btn-sm">
                <svg width="3em" height="3em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>   
            </div>
            <div class="card-body text-center py-0">
              <h3 class="card-title my-1" id="tituloTarefa"><hr>${tarefasDoUsuario[i].titulo}</hr></h3>
              <span class="badge my-1 px-5" id="categoria"
                style="border: 1px solid #000; height: 20px; align-items: center; background-color: white; font-size:14px;">${tarefasDoUsuario[i].categoria}</span>
            </div>
            <div class="card-body text-center py-1">
              <h7 class="card-title"><b>DATA DA TAREFA:</b></h7>
              <span class="badge text-center my-1 ml-1" id="dataTarefa"
                  style="width:120px; height: 20px; background-color: white; text-align: center; font-size: 16px;">${tarefasDoUsuario[i].data}</span>
            </div>
            <textarea class="card-header mx-3" ${disabled ? 'disabled' : ''} id="descricaoTarefa" rows="2" style=" border: 1px solid #000; border-radius: 10px; background-color:white;">${tarefasDoUsuario[i].descricao}</textarea>
            <div class="card-body text-center py-2 pb-3">
              <h7 class="card-title text-center"><b>DURAÇÃO DA TAREFA:</b></h7>
              <span class="badge text-center ml-1" id="duracaoTarefa"
                  style="width:120px; height: 20px; align-items: center; background-color: white; font-size: 16px;">${tarefasDoUsuario[i].duracao}</span>
            </div>
            <div class="card-body text-right py-1">
              <a
                href="#"
                class="btn ${disabled ? 'disabled' : ''}"
                id="iniciarTarefa-${tarefasDoUsuario[i].id}"
                onclick="iniciarTarefa(${tarefasDoUsuario[i].id})"
                style=" border: 1px solid #000; background-color: white; max-width: 150px; max-height: 30px; text-align: center; color: black;">
                <h6>
                  ${texto}
                </h6>
              </a>
            </div>
          </div>
        </div>`
      }
    }
  } else {
    strHtml = `
      <div class="col-12 py-4 d-flex flex-column align-items-center">
        <div class="col-12 py-4 mb-2 lupa-container">
          <img src="assets/lupa.svg" class="img-fluid imagem-centralizada" alt="ícone">
        </div>
        <h5 class="titulo-tarefanaoencontrada">Nenhuma tarefa encontrada. Cadastre uma para começar!</h5>
      </div>
    `
  }

  tela.innerHTML = strHtml;
}
