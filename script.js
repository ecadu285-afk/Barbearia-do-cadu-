
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // CONFIGURAÇÃO DO WHATSAPP
    const numeroWhatsApp = "5582988835803";

    // MENU MOBILE
    const botaoMenu = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#menu-principal");

    function fecharMenu() {
        if (!botaoMenu || !menu) return;

        menu.classList.remove("menu-aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
    }

    if (botaoMenu && menu) {
        botaoMenu.addEventListener("click", () => {
            const aberto = menu.classList.toggle("menu-aberto");

            botaoMenu.setAttribute("aria-expanded", String(aberto));
            botaoMenu.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        });

        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", fecharMenu);
        });

        document.addEventListener("click", evento => {
            if (
                !menu.contains(evento.target) &&
                !botaoMenu.contains(evento.target)
            ) {
                fecharMenu();
            }
        });
    }

    // FORMULÁRIO DE AGENDAMENTO
    const formulario = document.querySelector("#formAgendamento");
    const campoNome = document.querySelector("#nomeCliente");
    const campoServico = document.querySelector("#servicoCliente");
    const campoData = document.querySelector("#dataCliente");
    const campoHorario = document.querySelector("#horaCliente");

    function obterDataLocal() {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }

    if (campoData) {
        campoData.min = obterDataLocal();

        campoData.addEventListener("input", () => {
            campoData.setCustomValidity("");
        });
    }

    // SELECIONAR SERVIÇO PELO CARTÃO
    document.querySelectorAll("[data-servico]").forEach(link => {
        link.addEventListener("click", () => {
            if (campoServico) {
                campoServico.value = link.dataset.servico;
            }
        });
    });

    if (formulario) {
        formulario.addEventListener("submit", evento => {
            evento.preventDefault();

            if (!formulario.reportValidity()) return;

            const nome = campoNome.value.trim();
            const servico = campoServico.value;
            const data = campoData.value;
            const horario = campoHorario.value;

            if (!nome) {
                campoNome.setCustomValidity("Informe seu nome.");
                campoNome.reportValidity();
                return;
            }

            campoNome.setCustomValidity("");

            if (data < obterDataLocal()) {
                campoData.setCustomValidity(
                    "Escolha uma data atual ou futura."
                );
                campoData.reportValidity();
                return;
            }

            const [ano, mes, dia] = data.split("-");

            const mensagem = [
                "Olá! Gostaria de solicitar um agendamento na Barbearia Imperial.",
                "",
                `Nome: ${nome}`,
                `Serviço: ${servico}`,
                `Data: ${dia}/${mes}/${ano}`,
                `Horário: ${horario}`,
                "",
                "Esse horário está disponível?"
            ].join("\n");

            const linkWhatsApp =
                `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

            window.location.href = linkWhatsApp;
        });

        campoNome?.addEventListener("input", () => {
            campoNome.setCustomValidity("");
        });
    }

    // GALERIA INTERATIVA
    const lightbox = document.querySelector("#lightbox");
    const imagemAmpliada = document.querySelector("#lightbox-image");
    const botaoFechar = document.querySelector(".lightbox-close");

    let ultimoElemento = null;

    function fecharLightbox() {
        if (!lightbox || lightbox.hidden) return;

        lightbox.hidden = true;
        document.body.classList.remove("sem-scroll");

        imagemAmpliada.removeAttribute("src");

        ultimoElemento?.focus();
    }

    document.querySelectorAll(".gallery-item").forEach(botao => {
        botao.addEventListener("click", () => {
            const imagem = botao.querySelector("img");

            if (!imagem || !lightbox || !imagemAmpliada) return;

            ultimoElemento = botao;

            imagemAmpliada.src = imagem.src;
            imagemAmpliada.alt = imagem.alt;

            lightbox.hidden = false;
            document.body.classList.add("sem-scroll");

            botaoFechar?.focus();
        });
    });

    botaoFechar?.addEventListener("click", fecharLightbox);

    lightbox?.addEventListener("click", evento => {
        if (evento.target === lightbox) {
            fecharLightbox();
        }
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            fecharLightbox();
            fecharMenu();
        }

        if (
            evento.key === "Tab" &&
            lightbox &&
            !lightbox.hidden
        ) {
            evento.preventDefault();
            botaoFechar?.focus();
        }
    });

    // ANO AUTOMÁTICO DO RODAPÉ
    const anoAtual = document.querySelector("#ano-atual");

    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }

    console.log("Barbearia Imperial 4.0 carregada!");
});
