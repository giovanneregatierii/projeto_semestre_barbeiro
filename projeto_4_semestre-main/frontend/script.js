// 🚀 Enviar dados do agendamento para o backend
function sendBookingToBackend(data) {
    const submitButton = document.querySelector('.booking-form button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Mostrar loading no botão
    submitButton.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Enviando...';
    submitButton.disabled = true;

    fetch("https://projeto-semestre-barbeiro.onrender.com/api/agenda", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        const res = await response.json();

        if (response.ok) {
            alert("Agendamento criado com sucesso!");
            document.getElementById("booking-form").reset();
        } else {
            alert("Erro ao criar agendamento: " + (res.mensagem || "Erro desconhecido."));
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor.");
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Recarregar ícones
        if (window.lucide) {
            lucide.createIcons();
        }
    });
}
