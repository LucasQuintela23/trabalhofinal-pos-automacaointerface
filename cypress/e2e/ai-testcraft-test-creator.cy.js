/**
 * Created by TestCraft AI
*/

// cypress/integration/modalFormTests.js
import modalPage from '../support/pageObjects/modalPage';

describe('New Transaction Modal Form Tests', () => {
  beforeEach(() => {
    cy.visit('https://devfinance-agilizei.netlify.app/#');
    cy.contains("Nova Transação").click()
  });

  it('Verify that the user can successfully submit the form with valid inputs for description, amount, and date.', () => {
    modalPage.fillDescription('Test Transaction');
    modalPage.fillAmount('100.00');
    modalPage.fillDate('2023-10-01');
    modalPage.submitForm();
    cy.url().should('include', 'expected-url-after-submit'); // Adjust the expected URL after successful submission
    cy.get('.success-message').should('be.visible'); // Adjust selector based on actual success message
  });

  it('Enter invalid characters in the description field and check if the form allows submission.', () => {
    modalPage.fillDescription('!@#$%^&*()123');
    modalPage.fillAmount('50.00');
    modalPage.fillDate('2023-10-01');
    modalPage.submitForm();
    cy.get('.error-message').should('be.visible'); // Adjust selector based on actual error message
  });

  it('Test the form submission with a very long description.', () => {
    const longDescription = 'A'.repeat(256); // Assuming 255 is the limit
    modalPage.fillDescription(longDescription);
    modalPage.fillAmount('50.00');
    modalPage.fillDate('2023-10-01');
    modalPage.submitForm();
    cy.get('.error-message').should('be.visible'); // Adjust selector based on actual error message
  });

  it('Check how the system behaves when the user tries to enter a very large number in the amount field.', () => {
    modalPage.fillDescription('Test Large Amount');
    modalPage.fillAmount('9999999.99'); // Example of a very large amount
    modalPage.fillDate('2023-10-01');
    modalPage.submitForm();
    cy.get('.error-message').should('be.visible'); // Adjust selector based on actual error message
  });
});

describe.only('Home Page New Transaction Link Tests', () => {
  beforeEach(() => {
    cy.visit('https://devfinance-agilizei.netlify.app/#');
  });

  it('Verify that clicking on the link opens the modal for creating a new transaction', () => {
    modalPage.openModal();
    modalPage.isModalVisible();
  });

});