// Matriz de mensagens retornadas pelas validações

const mensagensCampos = {
  nome_cadastro: [],
  email_cadastro: [],
  senha_cadastro: [],
  confirmacao_senha_cadastro: [],
  email_login: [],
  senha_login: [],
  modalInclusaoTarefas: [],
}

// Matriz contendo o nome das divs onde as mensagens devem ser renderizadas caso necessário

const containersMensagens = {
  nome_cadastro: 'mensagensCadastroCampoNome',
  email_cadastro: 'mensagensCadastroCampoEmail',
  senha_cadastro: 'mensagensCadastroCampoSenha',
  confirmacao_senha_cadastro: 'mensagensCadastroCampoSenha2',
  email_login: 'mensagensLoginCampoEmail',
  senha_login: 'mensagensLoginCampoSenha',
  modalInclusaoTarefas: 'mensagemModalAdicao', 
}

// Renderiza as mensagens nos campos determinados

function renderizaMensagens(idContainerMensagens, arrayMensagem) {
  const containerMensagens = document.getElementById(idContainerMensagens);
  let mensagens = '';

  if (arrayMensagem.length > 0) {
    arrayMensagem.map((msg) => {
      mensagens += `<span>${msg}&nbsp;</span>`
    })

    containerMensagens.innerHTML = mensagens;
    containerMensagens.style.display = 'block';
  } else {
    containerMensagens.style.display = 'none';
  }

  return;
}

// Adiciona mensagens a matriz de mensagens

function adicionaMensagem (mensagem, idCampo) {
  let campoAtrelado = mensagensCampos[idCampo];

  if ((campoAtrelado.length > 0 && campoAtrelado.indexOf(mensagem) === -1) || campoAtrelado.length == 0) {
    campoAtrelado.push(mensagem);
  }

  mensagensCampos[idCampo] = campoAtrelado;
  return renderizaMensagens(containersMensagens[idCampo], campoAtrelado);
}

// Remove mensagens da matriz de mensagens

function removeMensagem (mensagem, idCampo) {
  let campoAtrelado = mensagensCampos[idCampo];

  if (campoAtrelado.length > 0 && campoAtrelado.indexOf(mensagem) !== -1) {
    campoAtrelado = campoAtrelado.filter(msg => msg !== mensagem);
  }

  mensagensCampos[idCampo] = campoAtrelado;
  return renderizaMensagens(containersMensagens[idCampo], campoAtrelado);
}

// Funções de validação dos campos

function verificaCampoEmBranco (event) {
  const { value } = event.target;
  if (value === undefined || (value !== null && value.trim() === '') || value === null) {
    return adicionaMensagem('Campo não pode ficar em branco', event.target.id);
  }
  return removeMensagem('Campo não pode ficar em branco', event.target.id);
}

function validaEmail (event) {
  let { value } = event.target;
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return adicionaMensagem('Email inválido', event.target.id);
  }
  return removeMensagem('Email inválido', event.target.id);
}


// Listeners que atrelam os campos aos validadores

if (document.getElementById('nome_cadastro') !== null) {
  document.getElementById('nome_cadastro').addEventListener('blur', verificaCampoEmBranco);
  document.getElementById('email_cadastro').addEventListener('blur', verificaCampoEmBranco);
  document.getElementById('email_cadastro').addEventListener('blur', validaEmail);
  document.getElementById('senha_cadastro').addEventListener('blur', verificaCampoEmBranco);
  document.getElementById('confirmacao_senha_cadastro').addEventListener('blur', verificaCampoEmBranco);
}
if (document.getElementById('email_login') !== null) {
  document.getElementById('email_login').addEventListener('blur', verificaCampoEmBranco);
  document.getElementById('email_login').addEventListener('blur', validaEmail);
  document.getElementById('senha_login').addEventListener('blur', verificaCampoEmBranco);
}



