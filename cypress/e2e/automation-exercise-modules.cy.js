/// <reference types="cypress" />
/**
// describe / context - suíte ou conjunto de testes em um mesmo arquivo
// it - um teste dentro de um bloco ou conjunto de testes

// describe -> Automation Exercise
//   it -> Cadastrar um usuário
//   it -> Teste abcde
 */

/*
  HOOKS / Ganchos
    before      -> 1x antes de todos os testes
    beforeEach  -> antes de cada teste
    after       -> 1x depois de todos os testes
    afterEach   -> depois de cada teste

    describe
      context
        beforeEach
        it
        it
      context
        it
        it


*/

import userData from '../fixtures/example.json'

import menu from '../modules/menu'
import login from '../modules/login'
import cadastro from '../modules/cadastro'

describe('Automation Exercise', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr')
    cy.visit('https://automationexercise.com/')

    // menu.navegarParaLogin()
    cy.navegarParaLogin()

  });

  it.only('Cadastrar um usuário', () => {
    login.preencherFormularioDePreCadastro()
    cadastro.preencherFormularioDeCadastroCompleto()

    // Assert
    cy.url().should('includes', 'account_created')
    cy.contains('b', 'Account Created!')
    cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')

  })

  it('Login de Usuário com e-mail e senha corretos', () => {
    login.preencherFormularioDeLogin(userData.user, userData.password)

    cy.get('i.fa-user').parent().should('contain', userData.name)
    cy.get('a[href="/logout"]').should('be.visible')

    cy.get(':nth-child(10) > a')
      .should('be.visible')
      .and('have.text', `Logged in as ${userData.name}`);

    cy.contains('b', userData.name)
    cy.contains(`Logged in as ${userData.name}`).should('be.visible')
  });

  it('Login de Usuário com e-mail e senha incorretos', () => {
    login.preencherFormularioDeLogin(userData.user, '54321')

    cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!')
  });

  it('Logout de Usuário', () => {
    login.preencherFormularioDeLogin(userData.user, userData.password)
    menu.efetuarLogout()

    // Assert
    cy.url().should('contain', 'login')
    cy.contains('Login to your account')
    cy.get('a[href="/logout"]').should('not.exist')
    cy.get('a[href="/login"]').should('contain', 'Signup / Login')

  });

  it('Cadastrar Usuário com e-mail existente no sistema', () => {
    // Arrange
    cy.get(`[data-qa="signup-name"]`).type(`QA Tester`)
    cy.get(`[data-qa="signup-email"]`).type(`qa-tester-1759530219181@test.com`)

    cy.contains('button', 'Signup').click()

    cy.get('.signup-form > form > p').should('contain', 'Email Address already exist!')
  });

  it('Enviar um Formulário de Contato com upload de arquivo', () => {
    // beforeEach

    cy.get('a[href*=contact]').click()
    // cy.visit('/contact_us').click()

    cy.get('[data-qa="name"]').type(userData.name)
    cy.get('[data-qa="email"]').type(userData.email)
    cy.get('[data-qa="subject"]').type(userData.subject)
    cy.get('[data-qa="message"]').type(userData.message)

    cy.fixture('example.json').as('arquivo')

    cy.get('input[type=file]').selectFile('@arquivo')
    // cy.get('input[type=file]').selectFile('cypress/fixtures/example.json')
    // cy.get('[name="upload_file"]').selectFile('@arquivo')

    cy.get('[data-qa="submit-button"]').click()

    // asserts
    cy.get('.status').should('be.visible')
    cy.get('.status').should('have.text', 'Success! Your details have been submitted successfully.')


  });

})

// "upload_file_xpaot"
// "upload_file_xpret"
// "upload_file_pjghc"

// a[href*=upload_file]


// describe ou context -> agrupar testes
// it -> teste em si

// describe - funcionalidade de login 
//   context - testes que envolvem login com sucesso 
//     it - teste com usuário de perfil admin
//     it - teste com usuário de perfil funcionário
//   context - testes que envolvem erro
//     it - teste com usuário de bloqueado
//     it - teste com usuário de removido

// // suite de testes
//   smoke             
//   restante da suíte