function removeAlert (alertId) {
  const alert = document.getElementById(alertId);
  alert.remove();
}

function renderizaAlert (mensagem, tipoAlert, tempoDeAtraso = undefined, tempoDeExibicao = 4000) {
  const alertId = 'userAlert' ;
  
  const div = document.createElement('div');
  const button = document.createElement('button');
  const span =  document.createElement('span');
  const mensagemAlert = document.createTextNode(mensagem);
  const body = document.getElementsByTagName('body')[0];

  // Configura o container do alert
  div.id = alertId;
  div.className += `alert alert-${tipoAlert} alert-dismissible fade show margin-top alert-customizado`;
  div.setAttribute("role", "alert");
  // Configura o botão de fechamento do alert
  button.className += `close`;
  button.setAttribute("type", "button");
  button.setAttribute("data-dismiss", "alert");
  button.setAttribute("aria-label", "Close");
  // Configura o conteúdo interno do span
  span.setAttribute("aria-hidden", "true")
  span.innerHTML = '&times;';

  button.appendChild(span);
  div.appendChild(mensagemAlert);
  div.appendChild(button);

  if (tempoDeAtraso) {
    setTimeout( function () {
      body.insertBefore(div, body.childNodes[0]);
    }, tempoDeAtraso);  
  } else {
    body.insertBefore(div, body.childNodes[0]);
  }

  if (tempoDeExibicao) {
    setTimeout( function () {
      removeAlert(alertId);
    }, tempoDeExibicao);
  }
}