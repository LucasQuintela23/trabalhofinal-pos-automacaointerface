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
import {
  getRandomNumber,
  getRandomEmail
} from '../support/helpers'

import { faker } from '@faker-js/faker'


describe('Automation Exercise', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr')
    cy.visit('https://automationexercise.com/')
    cy.get('a[href="/login"]').click()
  });

  it.only('Cadastrar um usuário', () => {
    // Arrange
    const timestamp = new Date().getTime()

    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    cy.get('[data-qa="signup-name"]').type(`${firstName} ${lastName}`)
    cy.get('[data-qa="signup-email"]').type(`qa-tester-${timestamp}@test.com`)

    // qa-tester-1758387945991@test.com
    // qa-tester-1758387959821@test.com

    cy.contains('button', 'Signup').click()

    // radio ou checkboxes -> check
    // cy.get('input[type=radio]').check('Mrs')
    cy.get('#id_gender1').check()

    cy.get('input#password').type('12345', { log: false })

    // para comboboxes ou selects -> select
    cy.get('select[data-qa=days]').select('20')
    cy.get('select[data-qa=months]').select('September')
    cy.get('select[data-qa=years]').select('1992')

    // radio ou checkboxes -> check
    cy.get('input[type=checkbox]#newsletter').check()
    cy.get('input[type=checkbox]#optin').check()

    cy.get('input#first_name').type(firstName)
    cy.get('input#last_name').type(lastName)
    cy.get('input#company').type(`PGATS ${faker.company.name()}`)
    cy.get('input#address1').type(faker.location.streetAddress())
    cy.get('select#country').select('Canada')
    cy.get('input#state').type(faker.location.state())
    cy.get('input#city').type(faker.location.city())
    cy.get('[data-qa="zipcode"]').type(faker.location.zipCode())
    cy.get('[data-qa="mobile_number"]').type('111 222 333')

    // Act
    cy.get('[data-qa="create-account"]').click()

    // Assert
    cy.url().should('includes', 'account_created')

    cy.contains('b', 'Account Created!')
    cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')

    // consulta ao banco ao api

  })

  it('Login de Usuário com e-mail e senha corretos', () => {

    cy.get(`[data-qa="login-email"]`).type(`qa-tester-1759530219181@test.com`)
    cy.get(`[data-qa="login-password"]`).type(`12345`)

    cy.get(`[data-qa="login-button"]`).click()

    const nomeDoUsuario = "QA Tester"

    cy.get('i.fa-user').parent().should('contain', nomeDoUsuario)
    cy.get('a[href="/logout"]').should('be.visible')

    cy.get(':nth-child(10) > a')
      .should('be.visible')
      .and('have.text', `Logged in as ${nomeDoUsuario}`);

    cy.contains('b', nomeDoUsuario)
    cy.contains(`Logged in as ${nomeDoUsuario}`).should('be.visible')
    cy.contains(`Logged in as ${nomeDoUsuario}`).should('be.visible')

  });

  it('Login de Usuário com e-mail e senha incorretos', () => {
    cy.get(`[data-qa="login-email"]`).type(`qa-tester-1759530219181@test.com`)
    cy.get(`[data-qa="login-password"]`).type(`54321`)

    cy.get(`[data-qa="login-button"]`).click()

    cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!')
  });

  it('Logout de Usuário', () => {
    // Arrange
    cy.get(`[data-qa="login-email"]`).type(`qa-tester-1759530219181@test.com`)
    cy.get(`[data-qa="login-password"]`).type(`12345`)

    cy.get(`[data-qa="login-button"]`).click()
    cy.get('i.fa-user').parent().should('contain', 'QA Tester')

    // Act
    cy.get('a[href="/logout"]').should('be.visible').click()
    // cy.get(`.shop-menu > .nav > :nth-child(4) > a`).click()                                       

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