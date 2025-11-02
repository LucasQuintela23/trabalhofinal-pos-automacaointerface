# PGATS Automação Web – Cypress

Este repositório contém uma suíte de testes E2E em Cypress para o site Automation Exercise. Os testes principais estão no arquivo `cypress/e2e/trabalhofinal.cy.js` e cobrem os casos TC01–TC06, TC08–TC10 e TC15.

## Requisitos

- Node.js 18.x (recomendado)
- npm (vem com o Node)

## Instalação

1. Instale as dependências do projeto:

	 ```bash
	 npm install
	 ```

2. (Opcional) Verifique a versão do Cypress instalada:

	 ```bash
	 npx cypress --version
	 ```

## Como executar localmente

Você tem duas formas principais de rodar os testes.

- Abrir a UI interativa do Cypress (útil para debug):

	```bash
	npm run cy:open
	```

- Executar todos os testes em modo headless (gera relatório HTML ao final):

	```bash
	npm run cy:run
	```

- Executar somente o arquivo `trabalhofinal.cy.js` em modo headless:

	```bash
	npm run cy:run:final
	```

### Relatórios (Mochawesome)

O projeto usa `cypress-mochawesome-reporter`. Ao rodar em modo run, o relatório HTML é gerado automaticamente em:

- `cypress/reports/html/index.html`

Para abrir rapidamente no Linux:

```bash
npm run report:open
```

Observação: em modo “open” (UI), o HTML não é gerado; utilize o modo “run” para produzir o relatório.

## O que acontece ao realizar um push (CI/CD)

Este repositório possui um workflow do GitHub Actions em `.github/workflows/main.yml` que:

- Dispara automaticamente em todo `push` e em `pull_request` (qualquer branch), além de permitir execução manual.
- Faz checkout do repositório e configura Node 18.
- Instala as dependências (`npm ci` com fallback para `npm install`).
- Executa somente o spec `cypress/e2e/trabalhofinal.cy.js` em modo headless:
	- `npx cypress run --spec cypress/e2e/trabalhofinal.cy.js`
- Gera o relatório HTML do Mochawesome e faz upload como artefato chamado `relatorios`, incluindo:
	- `cypress/reports` (HTML e JSONs do relatório)
	- `cypress/screenshots` (se houver falhas)
	- `cypress/videos`
- Adiciona no “Job Summary” um link direto para baixar o artefato e instrução para abrir o arquivo `cypress/reports/html/index.html`.

Para visualizar o relatório no GitHub Actions:

1. Vá em “Actions” > escolha a execução do workflow.
2. No topo, em “Job Summary”, clique no link do artefato `relatorios`.
3. Baixe e abra `cypress/reports/html/index.html`.

## Dicas e solução de problemas

- Caso algum elemento esteja fora da tela durante a execução local, rode em viewport mobile padrão do projeto (já configurada nos testes) ou maximize a janela do navegador.
- Se estiver usando WSL2, prefira o modo headless (`npm run cy:run`).
- Se `xdg-open` abrir o HTML em um app incorreto, rode diretamente com seu navegador, por exemplo:
	```bash
	google-chrome cypress/reports/html/index.html
	# ou
	firefox cypress/reports/html/index.html
	```

## Estrutura relevante

- `cypress/e2e/trabalhofinal.cy.js`: suíte principal com os casos TC01–TC06, TC08–TC10 e TC15.
- `cypress.config.js`: configuração do Cypress e do reporter Mochawesome.
- `cypress/reports/html/index.html`: relatório HTML (gerado após o run).

