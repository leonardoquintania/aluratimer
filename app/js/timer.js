const { ipcRenderer } = require('electron');

const moment = require('moment');
let segundos = 0;
let timer

module.exports = {
  iniciar(el) {
    let tempo = moment.duration(el.textContent);
    segundos = tempo.asSeconds();
    clearInterval(timer); //-- Limpa o setInterval anterior
    timer = setInterval(() => {
      segundos++;
      el.textContent = this.segundosParaTempo(segundos);
    }, 1000);
  }, parar(curso) {
    clearInterval(timer); //-- Limpa o setInterval anterior
    let tempoEstudado = this.segundosParaTempo(segundos);
    ipcRenderer.send('curso-parado', curso, tempoEstudado);
  }, segundosParaTempo(segundos) {
    return moment().startOf('day')
      .seconds(segundos)
      .format("HH:mm:ss");
  }



}