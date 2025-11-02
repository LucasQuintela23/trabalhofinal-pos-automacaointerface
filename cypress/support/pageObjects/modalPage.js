/**
 * Created by TestCraft AI
 */

// cypress/support/pageObjects/modalPage.js
class ModalPage {
  get newTransactionButton() {
    return 'a.button.new';
  }

  get descriptionInput() {
    return cy.get('#description');
  }

  get amountInput() {
    return cy.get('#amount');
  }

  get dateInput() {
    return cy.get('#date');
  }

  get cancelButton() {
    return cy.get('.button.cancel');
  }

  get saveButton() {
    return cy.contains('Salvar')
  }

  openModal() {
    cy.get(this.newTransactionButton).click();
  }

  isModalVisible() {
    // Assuming the modal has a class 'modal' when visible
    cy.get('.modal').should('be.visible');
  }

  closeModal() {
    // Assuming there's a close button in the modal
    cy.get('.modal .close-button').click();
  }

  fillDescription(description) {
    this.descriptionInput.clear().type(description);
  }

  fillAmount(amount) {
    this.amountInput.clear().type(amount);
  }

  fillDate(date) {
    this.dateInput.clear().type(date);
  }

  submitForm() {
    this.saveButton.click();
  }

  cancelForm() {
    this.cancelButton.click();
  }
}

export default new ModalPage();