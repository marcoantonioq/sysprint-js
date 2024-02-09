/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "O aplicativo está sendo servido do cache por um service worker."
      );
    },
    registered() {
      console.log("O trabalhador do serviço foi registrado.");
    },
    cached() {
      console.log("O conteúdo foi armazenado em cache para uso off-line.");
    },
    updatefound() {
      console.log("Novo conteúdo está sendo baixado.");
    },
    updated() {
      console.log("Novo conteúdo está disponível; por favor atualize.");
    },
    offline() {
      console.log(
        "Nenhuma conexão com a Internet encontrada. O aplicativo está sendo executado no modo offline."
      );
    },
    error(error) {
      console.error("Erro durante o registro do service worker:", error);
    },
  });
}
