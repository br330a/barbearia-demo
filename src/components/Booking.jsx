import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { services, professionals, whatsappNumber } from "../data/barbershop";
import {
  formatDateHuman,
  getDaySlots,
  getOperatingLabel,
  getPeriod,
  getPeriodOptions,
  getUpcomingBookableDays,
} from "../utils/bookingAvailability";

const formatPrice = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Booking = forwardRef(function Booking(_props, ref) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [sessionTime, setSessionTime] = useState(() => new Date());
  const [period, setPeriod] = useState("manha");
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
  const duration = selectedService?.duration ?? services[0].duration;
  const bookableDays = getUpcomingBookableDays(duration, sessionTime);
  const daySlots = form.date ? getDaySlots(form.date, duration, sessionTime) : [];
  const periodOptions = getPeriodOptions(daySlots);
  const activePeriod = periodOptions.some((option) => option.id === period)
    ? period
    : periodOptions[0]?.id;
  const displayedSlots = daySlots.filter((time) => getPeriod(time) === activePeriod);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setStatus("");
  }

  function selectService(serviceId) {
    setForm((previous) => ({
      ...previous,
      service: serviceId,
      date: "",
      time: "",
    }));
    setStatus("");
  }

  function openBooking({
    serviceId = services[0].id,
    professionalId = "",
  } = {}) {
    const chosenService = services.some((item) => item.id === serviceId)
      ? serviceId
      : services[0].id;
    const chosenProfessional = professionals.some((item) => item.id === professionalId)
      ? professionalId
      : "";

    setForm((previous) => ({
      ...previous,
      service: chosenService,
      professional: chosenProfessional,
      date: "",
      time: "",
    }));
    setSessionTime(new Date());
    setPeriod("manha");
    setStatus("");
    setStep(1);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }

  useImperativeHandle(ref, () => ({ open: openBooking }));

  useEffect(() => {
    if (dialogRef.current?.open) {
      if (contentRef.current) contentRef.current.scrollTop = 0;
      headingRef.current?.focus();
    }
  }, [step]);

  function goToDateStep() {
    const now = new Date();
    const days = getUpcomingBookableDays(duration, now);
    const selectedDate = days.some((day) => day.iso === form.date)
      ? form.date
      : days[0]?.iso ?? "";
    const slots = selectedDate ? getDaySlots(selectedDate, duration, now) : [];
    setSessionTime(now);
    setForm((previous) => ({
      ...previous,
      date: selectedDate,
      time: slots.includes(previous.time) ? previous.time : "",
    }));
    setPeriod(getPeriodOptions(slots)[0]?.id ?? "manha");
    setStatus("");
    setStep(2);
  }

  function selectDate(isoDate) {
    if (form.date === isoDate) return;
    const slots = getDaySlots(isoDate, duration, sessionTime);
    setForm((previous) => ({ ...previous, date: isoDate, time: "" }));
    setPeriod(getPeriodOptions(slots)[0]?.id ?? "manha");
    setStatus("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const now = new Date();
    const isValidTime = getDaySlots(form.date, duration, now).includes(form.time);

    if (!selectedService || !form.name.trim()) {
      setStatus("Informe seu nome antes de continuar.");
      return;
    }

    if (!isValidTime) {
      // Atualiza as sugestões e desmarca horários que acabaram de expirar.
      const days = getUpcomingBookableDays(duration, now);
      const nextDate = days.some((day) => day.iso === form.date)
        ? form.date
        : days[0]?.iso ?? "";
      const slots = nextDate ? getDaySlots(nextDate, duration, now) : [];
      setSessionTime(now);
      setForm((previous) => ({ ...previous, date: nextDate, time: "" }));
      setPeriod(getPeriodOptions(slots)[0]?.id ?? "manha");
      setStatus("Esse horário já passou. Selecione outro horário para solicitar.");
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
      "Podem confirmar se esse horário está disponível?",
    ].join("\n");

    const phone = whatsappNumber.replace(/\D/g, "");
    if (phone) {
      window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setStatus("Solicitação copiada! Este é um projeto demonstrativo.");
    } catch {
      setStatus("Não foi possível copiar. Verifique as permissões do navegador.");
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
              Seu estilo merece atenção. Escolha o atendimento e solicite seu horário.
            </p>
            <button type="button" className="schedule-primary" onClick={() => openBooking()}>
              Solicitar agendamento <span aria-hidden="true">↗</span>
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
              aria-label="Fechar agendamento"
              onClick={() => dialogRef.current?.close()}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="schedule-progress" aria-hidden="true">
            <span className="is-active" />
            <span className={step === 2 ? "is-active" : ""} />
          </div>

          <header className="schedule-heading">
            <span className="schedule-step">ETAPA {String(step).padStart(2, "0")} DE 02</span>
            <h2 id="schedule-title" ref={headingRef} tabIndex={-1}>
              {step === 1 ? "Seu próximo cuidado." : "Escolha seu momento."}
            </h2>
            <p id="schedule-description">
              {step === 1
                ? "Escolha o serviço e quem vai cuidar de você."
                : "Selecione um dia e horário de preferência. A barbearia confirma depois."}
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
                        onClick={() => selectService(service.id)}
                      >
                        <span className="schedule-service-radio" aria-hidden="true" />
                        <span className="schedule-service-details">
                          <strong>{service.name}</strong>
                          <small>{service.duration} minutos</small>
                        </span>
                        <span className="schedule-price">{formatPrice(service.price)}</span>
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
                        type="button"
                        key={professional.id}
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

              <button type="button" className="schedule-primary schedule-full" onClick={goToDateStep}>
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <form className="schedule-form schedule-form-time" onSubmit={handleSubmit}>
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
                <strong>{selectedService ? formatPrice(selectedService.price) : ""}</strong>
              </div>

              <div className="schedule-date-section">
                <div className="schedule-field-heading">
                  <strong>01. Qual dia prefere?</strong>
                  <span>Próximos dias de atendimento</span>
                </div>
                <div className="schedule-day-list" role="group" aria-label="Data desejada">
                  {bookableDays.map((day) => {
                    const chosen = form.date === day.iso;
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        className={`schedule-day ${chosen ? "is-selected" : ""}`}
                        aria-pressed={chosen}
                        aria-label={day.fullLabel}
                        onClick={() => selectDate(day.iso)}
                      >
                        <span className="schedule-day-week">{day.today ? "Hoje" : day.weekday}</span>
                        <strong>{day.number}</strong>
                        <span className="schedule-day-month">{day.month}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="schedule-day-info">
                  {form.date ? `${formatDateHuman(form.date)} · ${getOperatingLabel(form.date)}` : "Sem datas sugeridas."}
                </p>
              </div>

              <div className="schedule-time-section">
                <div className="schedule-field-heading">
                  <strong>02. Qual horário prefere?</strong>
                  <span>Duração: {duration} min</span>
                </div>
                {periodOptions.length > 0 ? (
                  <>
                    <div className="schedule-periods" role="group" aria-label="Período do dia">
                      {periodOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`schedule-period ${activePeriod === option.id ? "is-selected" : ""}`}
                          aria-pressed={activePeriod === option.id}
                          onClick={() => setPeriod(option.id)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <div className="schedule-times" role="group" aria-label="Horário de preferência">
                      {displayedSlots.map((time) => (
                        <button
                          type="button"
                          key={time}
                          className={`schedule-time ${form.time === time ? "is-selected" : ""}`}
                          aria-pressed={form.time === time}
                          onClick={() => updateField("time", time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="schedule-day-info">Nenhum horário sugerido para este dia. Escolha outra data.</p>
                )}
                <p className="schedule-availability-note">
                  Horários para solicitar, não vagas confirmadas. A disponibilidade será verificada pela barbearia.
                </p>
              </div>

              <label className="schedule-field">
                03. Como podemos chamar você?
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome"
                  maxLength={80}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                />
              </label>

              {status && <p className="schedule-feedback" role="status">{status}</p>}

              <div className="schedule-actions">
                <button
                  type="button"
                  className="schedule-back"
                  onClick={() => { setStatus(""); setStep(1); }}
                >
                  ← Voltar
                </button>
                <button
                  type="submit"
                  className="schedule-primary"
                  disabled={!form.time || !form.name.trim()}
                >
                  {whatsappNumber ? "Ir para o WhatsApp" : "Copiar solicitação"}
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
              <p className="schedule-disclaimer">
                Sua solicitação não é uma reserva confirmada.
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
