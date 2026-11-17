
import { useRef, useState } from "react";
import {
  services,
  professionals,
  whatsappNumber,
} from "../data/barbershop";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Booking() {
  const dialogRef = useRef(null);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    service: services[0].id,
    professional: "",
    date: "",
    time: "",
  });

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setStatus("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const service = services.find(
      (item) => item.id === form.service
    );

    const professional = professionals.find(
      (item) => item.id === form.professional
    );

    const [year, month, day] = form.date.split("-");

    const message = [
      "Olá! Gostaria de solicitar um agendamento.",
      "",
      `Nome: ${form.name.trim()}`,
      `Serviço: ${service.name}`,
      `Profissional: ${professional?.name ?? "Sem preferência"}`,
      `Data desejada: ${day}/${month}/${year}`,
      `Horário desejado: ${form.time}`,
      "",
      "Podem confirmar a disponibilidade?",
    ].join("\n");

    const phone = whatsappNumber.replace(/\D/g, "");

    if (phone) {
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank", "noopener,noreferrer");
      setStatus("Solicitação preparada no WhatsApp.");
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setStatus("Solicitação copiada! Demonstração concluída.");
    } catch {
      setStatus("Não foi possível copiar a solicitação.");
    }
  }

  return (
    <>
      <section className="booking-section" id="agendamento">
        <div className="container">
          <div className="booking-panel">
            <span className="eyebrow">SEU PRÓXIMO CORTE</span>

            <h2>Um momento para você.</h2>

            <p>
              Escolha seu serviço e solicite um horário.
              Simples, rápido e sem complicações.
            </p>

            <button
              className="button-primary"
              type="button"
              onClick={() => dialogRef.current?.showModal()}
            >
              Solicitar agendamento
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="booking-dialog"
        aria-labelledby="booking-title"
        onClose={() => setStatus("")}
      >
        <div className="booking-dialog-header">
          <div>
            <span className="eyebrow">FORMA.</span>
            <h2 id="booking-title">Solicitar horário</h2>
          </div>

          <button
            className="booking-close"
            type="button"
            aria-label="Fechar agendamento"
            onClick={() => dialogRef.current?.close()}
          >
            ×
          </button>
        </div>

        <p className="booking-description">
          Preencha suas preferências. O horário será
          confirmado posteriormente pela barbearia.
        </p>

        <form className="booking-form" onSubmit={handleSubmit}>
          <label>
            Seu nome
            <input
              type="text"
              autoComplete="name"
              placeholder="Como podemos te chamar?"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              maxLength={80}
              required
            />
          </label>

          <label>
            Serviço
            <select
              value={form.service}
              onChange={(e) => updateField("service", e.target.value)}
              required
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — R$ {service.price}
                </option>
              ))}
            </select>
          </label>

          <label>
            Profissional
            <select
              value={form.professional}
              onChange={(e) =>
                updateField("professional", e.target.value)
              }
            >
              <option value="">Sem preferência</option>

              {professionals.map((professional) => (
                <option
                  key={professional.id}
                  value={professional.id}
                >
                  {professional.name}
                </option>
              ))}
            </select>
          </label>

          <div className="booking-fields">
            <label>
              Data desejada
              <input
                type="date"
                min={getToday()}
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                required
              />
            </label>

            <label>
              Horário desejado
              <input
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                required
              />
            </label>
          </div>

          <button className="button-primary booking-submit" type="submit">
            {whatsappNumber
              ? "Continuar no WhatsApp"
              : "Copiar solicitação"}
            <span aria-hidden="true">↗</span>
          </button>

          <p className="booking-notice">
            Isto é uma solicitação, não uma reserva confirmada.
          </p>

          <p role="status" aria-live="polite" className="booking-status">
            {status}
          </p>
        </form>
      </dialog>
    </>
  );
}
