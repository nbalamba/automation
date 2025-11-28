describe('AUO-2508 - Industry/SubSegment QA for AU Articles and Search', () => {
  const baseUrl = 'https://pr-1011-next.au-uw2-dev.autodesk.com/autodesk-university';

  it('Displays industry tags on an Article page', () => {
    cy.visit(`${baseUrl}/article/reducing-the-environmental-impact-of-concrete-for-sustainable-construction`); // Replace with real article slug

    cy.get('.related-tags').should('be.visible');
    cy.get('.related-tags .industry-tag').should('contain.text', 'Architecture');
  });

  it('Returns correct results for industry phrase search', () => {
    cy.visit(`${baseUrl}/search?q=Architecture`);

    cy.get('.search-result .industry-tag').each(($el) => {
      cy.wrap($el).should('contain.text', 'Architecture');
    });
  });

  it('Filters by industry facet correctly', () => {
    cy.visit(`${baseUrl}/search`);

    cy.contains('.facet-category', 'Industry').click();
    cy.contains('.facet-option', 'Manufacturing').click();

    cy.get('.search-result .industry-tag').each(($el) => {
      cy.wrap($el).should('contain.text', 'Manufacturing');
    });
  });
});
