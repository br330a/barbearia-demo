# FORMA. — Barbearia demonstrativa

Projeto demonstrativo de uma landing page para barbearia, com **identidade visual minimalista**, responsividade e solicitação de agendamento sem backend.

**Site:** https://barbearia-demo.brunogoncalvesminitti.workers.dev/

> **Aviso:** FORMA. é uma barbearia fictícia. Serviços, valores, profissionais, horários e o ponto exibido no mapa são ilustrativos. Nenhum agendamento é efetivamente confirmado pelo site.

## Funcionalidades

- Apresentação dos serviços e seus preços.
- Equipe fictícia com retratos ilustrativos.
- Agendamento em duas etapas: serviço/profissional e preferência de data/horário.
- Seleção de horários sugeridos conforme funcionamento, duração do serviço e antecedência mínima.
- Solicitação preparada para WhatsApp quando houver um número configurado; no modo de demonstração, a mensagem é copiada.
- Mapa ilustrativo do Centro de Jundiaí com Leaflet/OpenStreetMap, carregado sob demanda.
- Navegação mobile, estados de foco, metadados básicos de SEO e imagem Open Graph.

## Tecnologias

React 19 · Vite 8 · JavaScript · CSS puro · Leaflet · Cloudflare Workers (hospedagem)

## Executar localmente

Requer Node.js compatível com as dependências indicadas em `package.json` (Node.js 20.19+ ou 22.12+ para Vite 8).

```bash
npm ci
npm run dev
```

Checagens antes de publicar:

```bash
npm run lint
npm run build
npm run preview
```

## Estrutura principal

```text
src/
  components/            # Seções, navegação, modal e mapa
  data/barbershop.js      # Serviços, equipe, horários e WhatsApp
  utils/bookingAvailability.js
  styles/                # CSS por seção e funcionalidade
public/
  images/                # Retratos fictícios otimizados
  favicon.svg
  og-forma.jpg
```

## Personalização

- Atualize serviços, preços, profissionais, fotos, horários e número do WhatsApp em `src/data/barbershop.js`.
- Para enviar a solicitação ao WhatsApp, configure `whatsappNumber` com DDI e DDD, somente números. A confirmação continua manual.
- O mapa aponta para **uma referência pública ilustrativa**, não para uma barbearia. Para projetos reais, substitua as coordenadas e revise as condições de uso do provedor de mapas.
- As informações demonstrativas devem ser substituídas ou removidas antes de oferecer o modelo a uma empresa.

## Publicação

O repositório pode ser integrado ao GitHub para deploy automático na Cloudflare Workers. Configuração da aplicação: build `npm run build` e saída estática de `dist`, conforme a configuração usada no painel da Cloudflare. O nome e a URL do projeto devem ser ajustados caso o site seja replicado.

## Observações

- **Sem banco de dados**: os horários apresentados representam apenas possibilidades conforme as regras de funcionamento, não disponibilidade real. A barbearia deve confirmar a reserva.
- O mapa usa tiles públicos do OpenStreetMap; respeite os limites e a [política de utilização](https://operations.osmfoundation.org/policies/tiles/) ao avaliar uso comercial.
- A imagem do Hero continua carregada da URL já utilizada no projeto, preservando a fotografia aprovada. O HTML inclui um preload para antecipar sua descoberta. Para autonomia total, substitua-a por uma fotografia local licenciada e otimizada.

## Créditos

Desenvolvido como projeto de portfólio. Os profissionais, serviços e preços apresentados são fictícios.
