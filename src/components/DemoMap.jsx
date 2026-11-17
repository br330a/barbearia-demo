import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/map.css";

// Ponto de referência público: Praça Governador Pedro de Toledo, Centro de Jundiaí.
// É APENAS um exemplo visual — não representa o endereço de uma barbearia.
const demoLocation = [-23.1886226, -46.8845744];
const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=-23.1886226%2C-46.8845744";

export default function DemoMap() {
  const wrapperRef = useRef(null);
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window)
  );
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [touchDevice, setTouchDevice] = useState(false);
  const [interacting, setInteracting] = useState(false);

  // Evita baixar a biblioteca e carregar os mapas antes de chegar à seção.
  useEffect(() => {
    // Sem IntersectionObserver, o estado inicial já carrega o mapa.
    // Não instanciar o observador em navegadores que não o suportam.
    if (shouldLoad || typeof IntersectionObserver === "undefined") return;
    const target = wrapperRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;
    let map;

    async function initializeMap() {
      try {
        const leaflet = await import("leaflet");
        if (cancelled || !mapElementRef.current) return;

        const L = leaflet.default ?? leaflet;
        const isTouch = window.matchMedia("(pointer: coarse)").matches;

        map = L.map(mapElementRef.current, {
          center: demoLocation,
          zoom: 15,
          minZoom: 12,
          maxZoom: 18,
          scrollWheelZoom: false,
          dragging: !isTouch,
          touchZoom: !isTouch,
          doubleClickZoom: !isTouch,
          keyboard: true,
          zoomControl: true,
        });
        mapRef.current = map;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const markerIcon = L.divIcon({
          className: "forma-demo-marker",
          html: '<span class="forma-demo-marker-symbol" aria-hidden="true"><span class="forma-demo-marker-label">F.</span></span>',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -42],
        });

        L.marker(demoLocation, { icon: markerIcon })
          .addTo(map)
          .bindPopup(
            '<strong>FORMA. — demonstração</strong><br />Ponto ilustrativo no Centro de Jundiaí.<br /><small>Não é uma barbearia real.</small>'
          );

        setTouchDevice(isTouch);
        setReady(true);
        // Corrige possíveis dimensões do mapa após o primeiro layout.
        requestAnimationFrame(() => {
          if (!cancelled) map?.invalidateSize();
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
    };
  }, [shouldLoad]);

  function toggleInteraction(enable) {
    const map = mapRef.current;
    if (!map) return;

    if (enable) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
    } else {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
    }
    setInteracting(enable);
  }

  return (
    <div className="forma-location-map" ref={wrapperRef}>
      <div className="forma-location-map-heading">
        <div>
          <span className="eyebrow">NOSSA REGIÃO</span>
          <h3>Encontre o caminho.</h3>
          <p>Conheça a região central de Jundiaí em nosso mapa interativo.</p>
        </div>
        <a
          className="forma-location-map-link"
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Explorar a região demonstrativa no Google Maps (abre em outra aba)"
        >
          Ver região no Google Maps
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="forma-location-map-frame">
        <div
          className="forma-location-map-canvas"
          ref={mapElementRef}
          aria-label="Mapa interativo ilustrativo do Centro de Jundiaí"
          role="region"
        />

        {!ready && !failed && (
          <div className="forma-location-map-loading" role="status">
            <span className="forma-location-map-loading-icon" aria-hidden="true">
              ◉
            </span>
            <span>Preparando o mapa...</span>
          </div>
        )}

        {failed && (
          <div className="forma-location-map-loading" role="alert">
            <p>Não foi possível carregar o mapa.</p>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              Abrir a região no Google Maps
            </a>
          </div>
        )}

        {ready && touchDevice && !interacting && (
          <div className="forma-location-map-touch-shield">
            <button
              className="forma-location-map-interaction"
              type="button"
              onClick={() => toggleInteraction(true)}
            >
              Explorar mapa
            </button>
          </div>
        )}

        {ready && touchDevice && interacting && (
          <button
            className="forma-location-map-interaction is-done"
            type="button"
            onClick={() => toggleInteraction(false)}
          >
            Concluir navegação
          </button>
        )}
      </div>

      <p className="forma-location-map-disclaimer">
        <span aria-hidden="true">ⓘ</span>
        Localização ilustrativa. A FORMA. é uma barbearia fictícia;
        este marcador não indica um estabelecimento real.
      </p>
    </div>
  );
}
