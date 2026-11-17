import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  services,
  professionals,
  whatsappNumber,
} from "../data/barbershop";

const formatPrice = (price) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const Booking = forwardRef(function Booking(_props, ref) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    service: services[0].id,
    professional: "",
    date: "",
    time: "",
  });

  const selectedService = services.find((item) => item.id === form.service);
  const selectedProfessional = professionals.find(
    (item) => item.id === form.professional
  );

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setStatus("");
  }

  function openBooking({
    serviceId = services[0].id,
    professionalId = "",
  } = {}) {
    setForm((previous) => ({
      ...previous,
      service: services.some((item) => item.id === serviceId)
        ? serviceId
        : services[0].id,
      professional: professionals.some((item) => item.id === professionalId)
        ? professionalId
        : "",
    }));
    setStep(1);
    setStatus("");

    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }

  useImperativeHandle(ref, () => ({ open: openBooking }));

  useEffect(() => {
    if (dialogRef.current?.open) {
      if (contentRef.current) contentRef.current.scrollTop = 0;
      headingRef.current?.focus();
    }
  }, [step]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedService || !form.name.trim()) {
      setStatus("Preencha seu nome e selecione um serviço.");
      return;
    }

    const requestedDate = new Date(`${form.date}T${form.time}:00`);
    if (
      !form.date ||
      !form.time ||
      Number.isNaN(requestedDate.getTime()) ||
      requestedDate <= new Date()
    ) {
      setStatus("Escolha uma data e um horário futuros.");
      return;
    }

    const [year, month, day] = form.date.split("-");
    const message = [
      "Olá! Gostaria de solicitar um agendamento.",
      "",
      `Nome: ${form.name.trim()}`,
      `Serviço: ${selectedService.name}`,
      `Profissional: ${selectedProfessional?.name ?? "Sem preferência"}`,
      `Data desejada: ${day}/${month}/${year}`,
      `Horário desejado: ${form.time}`,
      "",
      "Podem confirmar a disponibilidade?",
    ].join("\n");

    const phone = whatsappNumber.replace(/\D/g, "");
    if (phone) {
      window.location.assign(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setStatus("Solicitação copiada! Este é um projeto demonstrativo.");
    } catch {
      setStatus("Não foi possível copiar. Verifique a permissão do navegador.");
    }
  }

  return (
    <>
      <section className="schedule-section" id="agendamento">
        <div className="container">
          <div className="schedule-banner">
            <span className="eyebrow">SEU PRÓXIMO CORTE</span>
            <h2>Um momento para você.</h2>
            <p>
              Seu estilo merece atenção. Escolha o atendimento e solicite seu
              horário.
            </p>
            <button
              type="button"
              className="schedule-primary"
              onClick={() => openBooking()}
            >
              Solicitar agendamento
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="schedule-modal"
        aria-labelledby="schedule-title"
        aria-describedby="schedule-description"
        onClose={() => setStatus("")}
      >
        <div className="schedule-modal-inner" ref={contentRef}>
          <div className="schedule-top">
            <span className="schedule-brand">FORMA.</span>
            <button
              type="button"
              className="schedule-close"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fechar agendamento"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="schedule-progress" aria-hidden="true">
            <span className="is-active" />
            <span className={step === 2 ? "is-active" : ""} />
          </div>

          <header className="schedule-heading">
            <span className="schedule-step">
              ETAPA {String(step).padStart(2, "0")} DE 02
            </span>
            <h2 id="schedule-title" ref={headingRef} tabIndex={-1}>
              {step === 1 ? "Seu próximo cuidado." : "Vamos combinar?"}
            </h2>
            <p id="schedule-description">
              {step === 1
                ? "Escolha o serviço e quem vai cuidar de você."
                : "Informe quando gostaria de vir. Confirmaremos a disponibilidade depois."}
            </p>
          </header>

          {step === 1 ? (
            <div className="schedule-stage">
              <div className="schedule-group">
                <h3>01. Qual serviço você deseja?</h3>
                <div className="schedule-services">
                  {services.map((service) => {
                    const selected = form.service === service.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        className={`schedule-service ${selected ? "is-selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => updateField("service", service.id)}
                      >
                        <span className="schedule-service-radio" />
                        <span className="schedule-service-details">
                          <strong>{service.name}</strong>
                          <small>{service.duration} minutos</small>
                        </span>
                        <span className="schedule-price">
                          {formatPrice(service.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="schedule-group">
                <h3>02. Com quem deseja agendar?</h3>
                <div className="schedule-barbers" role="group" aria-label="Escolha de profissional">
                  <button
                    type="button"
                    className={`schedule-barber ${!form.professional ? "is-selected" : ""}`}
                    aria-pressed={!form.professional}
                    onClick={() => updateField("professional", "")}
                  >
                    <span className="schedule-barber-avatar schedule-barber-any" aria-hidden="true">✦</span>
                    <span className="schedule-barber-name">Sem preferência</span>
                  </button>

                  {professionals.map((professional) => {
                    const selected = form.professional === professional.id;
                    return (
                      <button
                        key={professional.id}
                        type="button"
                        className={`schedule-barber ${selected ? "is-selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => updateField("professional", professional.id)}
                      >
                        <img
                          className="schedule-barber-avatar"
                          src={professional.image}
                          alt=""
                          width="56"
                          height="56"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="schedule-barber-name">{professional.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                className="schedule-primary schedule-full"
                onClick={() => setStep(2)}
              >
                Continuar
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <form className="schedule-form" onSubmit={handleSubmit}>
              <div className="schedule-summary">
                <div>
                  <small>SEU ATENDIMENTO</small>
                  <strong>{selectedService?.name}</strong>
                  <span className="schedule-summary-professional">
                    {selectedProfessional && (
                      <img
                        src={selectedProfessional.image}
                        alt=""
                        width="26"
                        height="26"
                      />
                    )}
                    {selectedProfessional?.name ?? "Qualquer profissional"}
                  </span>
                </div>
                <strong>
                  {selectedService ? formatPrice(selectedService.price) : ""}
                </strong>
              </div>

              <label className="schedule-field">
                Seu nome
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Como podemos chamar você?"
                  maxLength={80}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                />
              </label>

              <div className="schedule-form-row">
                <label className="schedule-field">
                  Data desejada
                  <input
                    type="date"
                    min={getToday()}
                    value={form.date}
                    onChange={(event) => updateField("date", event.target.value)}
                    required
                  />
                </label>
                <label className="schedule-field">
                  Horário desejado
                  <input
                    type="time"
                    value={form.time}
                    onChange={(event) => updateField("time", event.target.value)}
                    required
                  />
                </label>
              </div>

              {status && (
                <p className="schedule-feedback" role="status">
                  {status}
                </p>
              )}

              <div className="schedule-actions">
                <button
                  type="button"
                  className="schedule-back"
                  onClick={() => {
                    setStatus("");
                    setStep(1);
                  }}
                >
                  ← Voltar
                </button>
                <button type="submit" className="schedule-primary">
                  {whatsappNumber ? "Ir para o WhatsApp" : "Copiar solicitação"}
                  <span aria-hidden="true">↗</span>
                </button>
              </div>

              <p className="schedule-disclaimer">
                O horário só será confirmado após o contato com a barbearia.
              </p>
            </form>
          )}

          <p className="schedule-demo">Projeto demonstrativo · FORMA.</p>
        </div>
      </dialog>
    </>
  );
});

export default Booking;
