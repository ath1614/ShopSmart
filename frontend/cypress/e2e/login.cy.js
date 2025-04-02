describe('Login Flow', () => {
  it('lands on homepage', () => {
    cy.visit('/');
    cy.contains('SHOPSMART').should('be.visible');
    cy.contains('GET STARTED').should('be.visible');
  });

  it('navigates to login page', () => {
    cy.visit('/');
    cy.contains('LOG IN').click();
    cy.url().should('include', '/login');
    cy.contains('SIGN IN').should('be.visible');
  });

  it('shows error on invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 401, body: { error: 'Invalid credentials' } });
    cy.visit('/login');
    cy.get('input[type="email"]').type('wrong@test.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.contains('SIGN IN →').click();
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('redirects to dashboard after successful login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token', user: { id: '1', email: 'test@test.com', name: 'Test', role: 'SHOPPER' } },
    });
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('SIGN IN →').click();
    cy.url().should('include', '/dashboard');
  });
});
