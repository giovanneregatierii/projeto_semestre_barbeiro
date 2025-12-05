// 🚀 Enviar para o backend REAL
function sendBookingToBackend(data) {
    const submitButton = document.querySelector('.booking-form button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.innerHTML = '<i data-lucide="loader-2"></i> Enviando...';
    submitButton.disabled = true;

    fetch("https://projeto-semestre-barbeiro.onrender.com/api/agenda", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // <- CORRIGIDO (antes estava "dados")
    })
    .then(async response => {
        const res = await response.json();

        if (response.ok) {
            alert("Agendamento criado com sucesso!");
            document.getElementById("booking-form").reset();
        } else {
            alert("Erro ao criar agendamento: " + res.mensagem);
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor.");
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        lucide.createIcons();
    });
}
