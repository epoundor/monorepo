describe("if lifeproof work correctly", () => {
  beforeEach(() => {
    cy.visit("/devices");
  });
  it("can found route", () => {
    cy.get("[data-test=title]").contains("Devices");
  });

  it("can search", () => {
    const input = cy.findByPlaceholderText("Rechercher un device");
    input.type("Yo je cherche un truc");
  });

  it("can select a row", () => {
    cy.wait(300);
    cy.get("tbody").find("tr").as("row").its("length").should("eq", 2);
    cy.get("@row")
      .first()
      .as("first")
      .should("not.have.class", "border-l-[#F8D648]")
      .click();
    cy.get("@first").should("have.class", "border-l-[#F8D648]");
  });

  it("can view menu", () => {
    cy.get("[data-test=action-button]").first().click();
    cy.get("[data-test=action-button]").last().click();
    cy.get("[data-test=action-items]").should("have.length", 1);
  });

  // it("can navigate to details", () => {
  //   cy.get("[data-test=action-button]").first().click();

  //   cy.get("[data-test=action-items]").contains("Voir détails");
  //   cy.get("[data-test=action-items]").contains("Attribuer à un agent");
  //   cy.get("[data-test=action-items]").contains("Modifier le terminal");
  //   cy.get("[data-test=action-item]")
  //     .contains("Désactiver le terminal")
  //     .click();
  //   cy.url().should("eq", Cypress.config().baseUrl + "devices/add");
  //   cy.findByText("Ajouter un terminal");
  // });

  it("can attribute device", () => {
    const agent = "Ruth Oneil Howard Horton";
    const searchAgent = "Ruth";
    cy.get("[data-test=action-button]").first().click();

    cy.get("[data-test=action-items]").contains("Attribuer à un agent").click();

    cy.url().should("eq", Cypress.config().baseUrl + "devices/1/attribute");
    cy.findByText("Attribuer à un agent");
    cy.get("[data-test=data-combolist-input]").focus().type(searchAgent);
    cy.get("[data-test=data-combolist-options]").contains(searchAgent);
    cy.get("[data-test=data-combolist-input]").clear().type(`${agent}{enter}`);

    cy.get("[data-test=agent-info]").contains(agent);
  });
});
