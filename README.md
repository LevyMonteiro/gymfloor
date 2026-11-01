# 🏋️ Gymfloor — Protocolos de Treino Profissionais

![Gymfloor Banner](https://img.shields.io/badge/GYMFLOOR-PDF%20Studio-0284c7?style=for-the-badge&logo=dumbbell&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite 6](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-56%20Passed-22c55e?style=flat-square&logo=vitest&logoColor=white)

O **Gymfloor** é uma aplicação web moderna e de alto desempenho desenvolvida para **Personal Trainers** e profissionais de Educação Física elaborarem, personalizarem e exportarem fichas e protocolos de treino completos em PDF profissional no formato A4, com acabamento visual de alto padrão e sem margens brancas indesejadas.

---

## ✨ Principais Funcionalidades

### 📋 Elaboração Completa de Protocolos

- **Capa & Protocolo Geral (Página 1)**:
  - Dados do aluno, objetivo principal (ex: _Hipertrofia & Definição_) e validade do planejamento.
  - **Bloco 1**: Alongamentos e exercícios de mobilidade recomendados.
  - **Bloco 2**: Ativação central e exercícios específicos de core.
  - **Bloco 3**: Observações gerais, recomendações de hidratação e cadência.
- **Páginas Individuais por Dia de Treino (Páginas 2 em diante)**:
  - 1 página A4 dedicada para cada dia de treino (_Treino A, B, C, D..._).
  - Título do dia, grupamento muscular foco e cardio/observações específicas.
  - Tabela organizada com nome do exercício, séries, repetições, descanso e notas técnicas.
  - Reordenação rápida de dias e exercícios, duplicação e exclusão com 1 clique.

### 🎨 Identidade Visual & Temas Personalizáveis

- Customização do perfil do Personal Trainer (nome, credencial e redes sociais).
- **6 Paletas de Cores Profissionais** (Magenta Neon, Ciano Elétrico, Verde Esmeralda, Dourado Iron, Laranja Sunset, Vermelho Crimson).
- Destaques de seleção de texto dinâmicos adaptados à cor primária escolhida.
- Sanitizador automático de códigos hexadecimais para prevenir falhas de renderização gráfica.

### 📱 Experiência Mobile Otimizada

- **Alternância Instantânea**: Botão de inversão (`ArrowLeftRight`) para navegar facilmente entre a edição em tela cheia e o visualizador do PDF.
- **Controles Ergonômicos**: Setas de reordenação de exercícios e treinos com touch targets generosos, posicionadas lado a lado.
- **Botões Fluídos**: Botões de ação em largura total (`w-full`), alinhados na mesma proporção dos campos de entrada de texto.
- **Visualizador Inteligente**:
  - Encaixe dinâmico: **40% de zoom no mobile** e **70% no desktop**.
  - Cálculo dimensional preciso que elimina folgas pretas e rolagens horizontais indesejadas no smartphone.
  - Suporte a `100dvh` para prevenir deslocamentos com a barra de endereços do navegador móvel.

### 📄 Motor de Exportação em PDF Direto

- **Download em 1 Clique**: Baixa o arquivo `.pdf` direto para o dispositivo sem depender de popups ou janelas nativas de impressão.
- **Sangria Total (Full-Bleed)**: Proporção A4 milimétrica (210mm × 297mm) sem bordas brancas laterais.
- **Modal de Progresso**: Feedback em tempo real com indicador percentual de processamento de cada página.
- **Offline-First**: Armazenamento e sincronização automática via `localStorage` com recuperação resiliente de dados.

---

## 🏛️ Arquitetura do Software

O projeto foi estruturado seguindo os princípios de **Domain-Driven Design (DDD)** e **Arquitetura Hexagonal (Ports & Adapters)**, garantindo total desacoplamento entre regras de negócio, adaptadores de infraestrutura e a camada de apresentação visual:

```mermaid
graph TD
    subgraph Presentation ["Presentation Layer (React)"]
        UI[App / Navbar / Modais]
        Editor[EditorView / DayEditor / CoverEditor]
        PDF[PdfDocument / PageCover / PageWorkoutDay]
    end

    subgraph Application ["Application Layer (Hooks)"]
        usePlan[useWorkoutPlan]
        useExport[usePdfExport]
    end

    subgraph Domain ["Domain Layer (Core)"]
        Entities[WorkoutPlan / Day / Exercise / Trainer]
        Services[WorkoutPlanService / TrainerService]
    end

    subgraph Infrastructure ["Infrastructure Layer (Adapters)"]
        Storage[LocalStorageWorkoutRepository]
        Export[PdfExportService (html2pdf)]
        Sanitizer[ColorSanitizer]
        Log[Logger]
    end

    Presentation --> Application
    Application --> Domain
    Application --> Infrastructure
    Infrastructure -.-> Domain
```

### Estrutura de Diretórios

```bash
src/
├── application/             # Regras de orquestração e custom hooks
│   ├── usePdfExport.ts      # Controle de estados e download do PDF
│   └── useWorkoutPlan.ts    # Gerenciamento de estado do plano de treino
│
├── domain/                  # Entidades e regras de negócio puras
│   ├── entities/            # Interfaces de domínio (WorkoutPlan, Exercise, Trainer)
│   └── services/            # Serviços de validação e geração de dados padrão
│
├── infrastructure/          # Adaptadores externos e integrações
│   ├── logger/              # Sistema de telemetria e logs estruturados
│   ├── pdf/                 # Motor de geração de PDF e patches de canvas
│   ├── storage/             # Persistência local no navegador (LocalStorage)
│   └── utils/               # Sanitizadores de cores e utilitários
│
├── presentation/            # Componentes visuais e interface de usuário
│   ├── components/
│   │   ├── common/          # Elementos visuais reutilizáveis e logotipos
│   │   ├── editor/          # Componentes de edição (dias, abas, exercícios)
│   │   ├── pdf/             # Layout vetorial das páginas A4 para tela e print
│   │   └── templates/       # Modal de seleção de personal e temas
│   └── layout/              # Navbar, cabeçalhos e modais de progresso
│
└── tests/                   # Suíte de testes automatizados unitários e de integração
```

---

## 🛠️ Tecnologias Utilizadas

- **Framework Web**: [React 19](https://react.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Geração de PDF**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) + patch customizado para `html2canvas`
- **Testes Unitários**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Gerenciador de pacotes `npm`

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/gymfloor.git
cd gymfloor
```

### 2. Instalar dependências

```bash
npm install
```

> _Nota: O hook `postinstall` aplica automaticamente os patches de correção de baseline para o motor de canvas do PDF._

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse no seu navegador: `http://localhost:5173` (ou no IP de rede local exibido no terminal para testes mobile).

### 4. Executar os Testes Automatizados

```bash
npm test
```

Para rodar em modo contínuo (watch):

```bash
npm run test:watch
```

### 5. Compilar para Produção

```bash
npm run build
```

Os arquivos otimizados e minificados serão gerados no diretório `dist/`.

---

## 🧪 Qualidade de Software & Testes

O projeto conta com testes unitários abrangentes cobrindo todas as camadas da aplicação:

| Módulo / Camada    | Arquivos de Teste                                                                                                                                                                                      | Cobertura / Verificações                                                        |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Domain**         | `WorkoutPlanService.test.ts`, `TrainerService.test.ts`                                                                                                                                                 | Integridade das regras de planos, treinos e dados do personal                   |
| **Infrastructure** | `LocalStorageWorkoutRepository.test.ts`, `ColorSanitizer.test.ts`, `PdfExportService.test.ts`                                                                                                          | Fallback de cache corrompido, sanitização de cores e download de blob PDF       |
| **Presentation**   | `Navbar.test.tsx`, `DayEditor.test.tsx`, `ExerciseItem.test.tsx`, `ProtocolCoverEditor.test.tsx`, `DayTabs.test.tsx`, `TemplateModal.test.tsx`, `PdfDocument.test.tsx`, `ExportProgressModal.test.tsx` | Renderização responsiva, callbacks de toque, botões de reordenação e páginas A4 |

---

## 📄 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).
