# 🎓 Plataforma de Atividades Escolares

> **Plataforma educacional focada na gestão simplificada de tarefas e resolução de atividades entre professores e alunos.**

Um sistema completo em padrão _monorepo_, arquitetado para entregar estabilidade, previsibilidade de negócios e uma experiência de usuário madura e humana.

---

## 🚀 1. Tecnologias Utilizadas

### Frontend

- **Core:** React 18, TypeScript, Vite.
- **UI & Estilização:** Ant Design (antd) + Tailwind CSS.
- **Gestão de Estado/Cache:** TanStack Query (React Query).
- **Formulários:** React Hook Form e Zod.
- **Navegação:** React Router Dom v6.

### Backend

- **Core:** Python, Django, Django REST Framework (DRF).
- **Banco de Dados:** PostgreSQL.
- **Segurança:** Simple JWT (Cookies HttpOnly).
- **Mailing/CORS:** django-cors-headers, django-environ.

### Infraestrutura

- **Containerização:** Docker & Docker Compose.

---

## 🏛 2. Arquitetura e Regras de Negócio

O sistema aplica o padrão **Client-Server** com foco em regras de negócio rígidas e auditoria de acesso.

- **Fluxo do Professor:** Cria salas de aula e atividades. Somente o criador da atividade pode visualizar, corrigir e atribuir notas aos seus alunos.
- **Fluxo do Aluno:** Entra em salas via código, visualiza tarefas pendentes e submete respostas. O conteúdo é "congelado" após o prazo ou após a atribuição de nota.
- **Validação de Nota:** Restrição técnica para notas entre **0 e 10**, garantindo consistência estatística.

---

## 🛠 3. Como Rodar o Projeto (Passo a Passo)

O ambiente foi Dockerizado nativamente, isolando o sistema host. Siga as etapas abaixo para subir o monorepo.

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado.
- [Docker Compose](https://docs.docker.com/compose/install/) (geralmente incluso no Docker Desktop).

### Execução

1.  **Clone o repositório** e entre na pasta raiz.
2.  **Suba os containers** (Frontend, Backend e DB):
    ```bash
    docker compose up -d --build
    ```
3.  **Execute as migrações** do banco de dados:
    ```bash
    docker compose exec backend python manage.py migrate
    ```
4.  **Popule o banco (Seed)** com dados de teste (Professores, Alunos e Salas):
    ```bash
    docker compose exec backend python manage.py seed
    ```
5.  **Acesse o sistema**:
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:8000/api/`

---

## 💡 4. Detalhes Técnicos e Decisões de Design

- **Segurança e Isolamento de Credenciais (JWT via Cookies HttpOnly)**: Diferente da abordagem comum (e menos segura) de armazenar tokens no `localStorage`, este projeto utiliza cookies segregados com a flag `HttpOnly`. Isso garante que o token JWT não seja acessível via scripts no frontend, mitigando drasticamente vetores de ataque XSS (Cross-Site Scripting). O backend Django também está preparado para validação rigorosa de `CORS` e `CSRF`.
- **Estabilidade de Interface e Persistência de Contexto (Busca Ininterrupta)**: Implementamos uma lógica de renderização onde o componente de `Input` de busca é desacoplado dos estados de carregamento (`Spin/Loading`). Isso evita que o campo de busca suma ou perca o foco durante a sincronização de dados com o servidor, proporcionando uma experiência de usuário fluida e profissional.
- **Otimização de Performance com Debouncing**: Para evitar sobrecarga no backend e chamadas de API desnecessárias a cada tecla digitada, as pesquisas em tempo real utilizam um sistema de `Debounce` customizado (500ms). Isso garante que o servidor só seja consultado quando o usuário termina uma intenção de busca.
- **Integridade de Dados e Bloqueio de Estados (Imutabilidade Pós-Correção)**: O sistema impõe uma regra de imutabilidade na submissão do aluno assim que uma nota é atribuída pelo professor. Essa decisão de design garante a integridade histórica dos dados acadêmicos, impedindo alterações de conteúdo após a auditoria/correção ter sido realizada.


---

## 🗂 5. Estrutura de Arquivos

```
\
├── backend/                  # Django Framework
│   ├── apps/                 # Domínios de negócio isolados
│   │   ├── accounts/         # Perfil e Autenticação
│   │   ├── classes/          # Gestão de Turmas
│   │   ├── activities/       # Criação de Tarefas
│   │   └── submissions/      # Respostas e Notas
│   ├── config/               # Configurações globais
│   └── requirements.txt      # Dependências Python
│
├── frontend/                 # React Framework
│   ├── src/
│   │   ├── features/         # Lógica modularizada (Feature-Sliced Design)
│   │   ├── pages/            # Views (Páginas principais)
│   │   └── shared/           # Hooks, Componentes e API base reutilizáveis
│
└── docker-compose.yml        # Orquestração do Monorepo
```

---

## 🚀 6. Melhorias Futuras

Embora o sistema seja funcional e estável, identificamos os seguintes pontos de evolução:

1.  **Testes Automatizados**: Implementação de testes unitários no backend (Pytest) e E2E no frontend (Cypress/Playwright).
2.  **Dashboard Analytics**: Visualização gráfica do progresso das turmas e média de notas de atividades.
3.  **Notificações em Tempo Real**: Uso de WebSockets (Django Channels) para avisar o aluno quando uma nota for atribuída.
4.  **Anexos de Arquivos**: Permitir que alunos façam upload de PDFs ou imagens em suas respostas via AWS S3 ou similar.
