describe("e2e test", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("found", () => {
    cy.findByText("Tableau de bord");
    cy.findByText("Total de preuve de vie");
    cy.findByText("Preuve de vie invalidées");
    cy.findByText("Preuve de vie en attente");
  });
});
