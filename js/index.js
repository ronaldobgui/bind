import { createState, initBind } from "./bind.js";

const data = {};

data.name = createState("Fulano de Tal");

data.count = createState(0);

data.number = createState(0);

function getTimeBold() {

  const date = new Date();

  return date.toLocaleTimeString().bold();
}

data.hora = createState(getTimeBold());

setInterval(() => data.hora.value = getTimeBold(), 1000);

initBind(document.body, data);

window.data = data;