describe("if lifeproof work correctly", () => {
  beforeEach(() => {
    cy.visit("/life-proof");
    cy.wait(1500);
  });
  it("can found route", () => {
    cy.findByText("Preuves de vie");
  });

  it("can search", () => {
    const input = cy.findByPlaceholderText("Rechercher une preuve de vie");
    input.type("Yo je cherche un truc");
  });
  it("can select a row", () => {
    cy.get("tbody tr").first().should("not.have.class", "border-l-[#F8D648]");
    cy.get("tbody tr")
      .first()
      .click()
      .should("have.class", "border-l-[#F8D648]");
  });
  it.only("can view menu", () => {
    cy.get("tbody tr").first().click();
    cy.get("tbody tr [data-test=proof-action]").first().click();
  });
  it("can navigate to details", () => {
    cy.get("[data-test=action-button]").first().click();
    cy.get("[data-test=action-items]").first().contains("Vérifier Maintenant");
    cy.get("[data-test=action-items]").first().contains("Voir détail").click();
    cy.url().should("eq", Cypress.config().baseUrl + "life-proof/2/details");
    cy.findByText("Preuve de vie");
  });
});
