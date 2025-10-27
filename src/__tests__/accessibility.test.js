import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { axe } from 'jest-axe';
import Register from '../views/Register/Register';
import { MemoryRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);

describe('Accessibility checks - Register', () => {
  test('Register component should have no basic accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/register?email=test@example.com"]}>
        <Register />
      </MemoryRouter>
    );

  // small smoke: form inputs existen
  expect(screen.getByPlaceholderText(/Nombres/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Apellidos/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Teléfono celular/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
