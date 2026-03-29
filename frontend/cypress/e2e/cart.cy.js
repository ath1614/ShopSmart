describe('Cart Flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/users/me', {
      body: { id: '1', email: 'test@test.com', name: 'Test', role: 'SHOPPER' },
    });
    window.localStorage.setItem(
      'shopsmart-auth',
      JSON.stringify({ state: { token: 'fake-token', user: { id: '1', name: 'Test', role: 'SHOPPER' } } })
    );
  });

  it('shows empty cart message', () => {
    cy.intercept('GET', '/api/cart', { body: [] });
    cy.visit('/cart');
    cy.contains('CART IS EMPTY').should('be.visible');
  });

  it('displays cart items', () => {
    cy.intercept('GET', '/api/cart', {
      body: [{ id: 'c1', quantity: 2, product: { id: 'p1', name: 'Sneakers', price: 89.99 } }],
    });
    cy.visit('/cart');
    cy.contains('Sneakers').should('be.visible');
    cy.contains('$179.98').should('be.visible');
  });
});
