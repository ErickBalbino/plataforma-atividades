# 🎓 Plataforma de Atividades Escolares

> **Plataforma educacional focada na gestão simplificada de tarefas e resolução de atividades entre professores e alunos.**

Um sistema completo em padrão _monorepo_, arquitetado para entregar estabilidade, previsibilidade de negócios e uma experiência de usuário madura e humana.

---

## 🚀 Tecnologias Utilizadas

### Frontend

- **Core:** React 18, TypeScript, Vite.
- **Componentes e Estilização:** Ant Design (antd) + Tailwind CSS (para refinamentos em layout).
- **Gestão de Estado/Cache:** TanStack Query (React Query).
- **Roteamento:** React Router Dom v6.
- **Formulários:** React Hook Form e Zod.
- **Comunicação:** Axios.

### Backend

- **Core:** Python, Django, Django REST Framework (DRF).
- **Banco de Dados:** PostgreSQL.
- **Segurança:** Simple JWT (Cookies Auth).
- **Utilitários:** django-environ, django-cors-headers.

### Infraestrutura

- **Orquestração:** Docker + Docker Compose.

---

## 🏛 Arquitetura

O sistema adota o padrão **Client-Server** tradicional, utilizando abordagens defensivas (_Zero Trust_) no backend e experiência otimista no frontend.

- O **Backend** atua como guardião das regras de negócio, bloqueando modificações via custom permissions classes e interceptadores nas serializações do DRF.
- O **Frontend** reflete de forma simples o contrato imposto, sem carregar "regras mágicas": as renderizações condicionais dependem puramente da tipagem de retorno. A gestão de estado foi feita com o **TanStack Query**, removendo a necessidade de middlewares gigantes como Redux.

---

## 📋 Regras de Negócio Implementadas

1. **Gestão do Professor:** Apenas o professor pode emitir atividades (obrigatoriamente atribuídas pelo `POST /atividades/`).
2. **Visibilidade Direcional:** Um aluno só acessa e lista atividades inerentes à sua própria Turma. Professores listam e visualizam as atividades por eles publicadas.
3. **Submissão Única:** O aluno responde uma única vez por atividade usando o _POST_. Ele tem liberdade para editar (_PATCH_) sua resposta até o instante limite final (`due_date`).
4. **Vencimento do Prazo:** O término do prazo cristaliza o conteúdo, impedindo que os alunos injetem ou atualizem dados e autorizando o professor a emitir uma nota decisiva.
5. **Correção Fechada:** Apenas o professor criador daquela atividade pode avaliá-la, lançando **Nota (entre 0 e 10)** e **Feedback** com as exigências técnicas impostas pelo campo numérico.

---

## 🗂 Estrutura do Projeto (Monorepo)

O projeto encontra-se particionado em três vértices principais de desenvolvimento:

```
\
├── backend/                  # Ambiente server-side gerido por Django
│   ├── apps/                 # Lógica separada por domínios clássicos
│   │   ├── accounts/         # (Autenticação e Perfis)
│   │   ├── classes/          # (Gestão de Salas)
│   │   ├── activities/       # (Geração de Tarefas)
│   │   └── submissions/      # (Respostas e Correções)
│   ├── config/               # Settings isolados (base/dev)
│   └── requirements.txt
│
├── frontend/                 # Client React
│   ├── src/
│   │   ├── features/         # Clean Architecture (agrupamento vertical por módulo)
│   │   │   ├── auth/
│   │   │   ├── activities/
│   │   │   └── submissions/
│   │   ├── pages/            # View Containers com chamadas de UI limpa
│   │   └── shared/           # Cross-components (Header, Layout, Axios Client)
│
└── docker-compose.yml        # Ligações vitais do sistema (Frontend, Backend, DB)
```

---

## 📡 Endpoints Principais

A abstração da Rest API foi documentada internamente, utilizando nomenclatura padronizada e simplificada (foco no idioma alvo estipulado nos requisitos):

- **Auth**:
  - `POST /auth/login/` → Emite os tokens (Session e Refresh).
  - `POST /auth/logout/` → Encerra sessão.
  - `GET /auth/me/` → Retorna o perfil ativo.

- **Atividades**:
  - `POST /atividades/` → Cria uma nova atribuição (Apenas Professor).
  - `GET /me/atividades/` → Lista as atribuições correlacionadas ao perfil atual do usuário.

- **Submissões (Respostas)**:
  - `POST /respostas/` → Submete uma solução (Apenas Aluno).
  - `PATCH /respostas/{id}/` → Fork arquitetural duplo:
    - Se acionado por Aluno → Permite alteração do texto da submissão (Antes do expirar do prazo).
    - Se acionado por Professor → Lanço da avaliação (Nota/Feedback).
  - `GET /me/respostas/` → Lista de envio pendentes do próprio aluno ou as pendentes de correção do professor logado.

---

## 💡 Decisões Técnicas de Destaque

- **Autenticação via Cookies `HttpOnly`**: Optamos por não utilizar o `localStorage` do browser em prol de uma maior segurança arquitetural contra roubo de tokens maliciosos, armazenando o JWT e o Refresh na camada segura gerida pelo navegador do lado do Django.
- **TanStack Query & Invalidação de Cache Silenciosa**: Interceptar requisições lentas via Loading Spinners tornou a performance do projeto espetacular. Com a invalidação dos caches, ações contínuas (como as "Correções") geram um sentimento de sistema leve — avaliou um Aluno, ele flui automaticamente para a próxima card via React.
- **Divisão de Rotas em Idiomas (Backend vs Frontend)**: Uma escolha para abraçar o desenvolvedor que trabalha focado. Os schemas internos e códigos fontes se baseiam no padrão global (Inglês: _Activities, Submissions, Views_), porém toda rota REST e roteamento público do client se comunicam no padrão da documentação exigida (Português: `POST /respostas/`, rotas `/correcoes`).
- **Design Pattern _"Feature Sliced"_ no Cliente**: Em vez do obsoleto agrupamento horizontal (ex: ter pastas gigantes só de hooks, todas as interfaces juntas), modularizamos features verticais independentes, elevando exponencialmente a escalabilidade do frontend.

---

## 🛠 Instruções de Execução Rápida

O ambiente foi Dockerizado nativamente, isolando você da necessidade de bibliotecas conflitantes. Tudo está "Plug and Play".

1. Garanta ter o [Docker](https://docs.docker.com/) e o `docker compose` instalados na sua máquina.
2. Na pasta raiz do monorepo, suba todos os containers com a flag gerencial:

   ```bash
   docker compose up -d --build
   ```

3. Instale o schema no banco de dados e os dados de iniciação:

   ```bash
   docker compose exec backend python manage.py makemigrations
   docker compose exec backend python manage.py migrate
   ```

4. Acesse:
   - Frontend web ativo: `http://localhost:5173`
   - Backend gerencial REST: `http://localhost:8000/`
