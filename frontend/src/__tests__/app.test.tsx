import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { EmergencyBanner } from '../components/layout/EmergencyBanner';
import { Footer } from '../components/layout/Footer';
import { BrowserRouter } from 'react-router-dom';

describe('EmergencyBanner Component', () => {
  it('renders official emergency contacts and responsible use notice', () => {
    render(<EmergencyBanner />);
    expect(screen.getByText(/Safety Notice/i)).toBeInTheDocument();
    expect(screen.getByText(/National Emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/112/i)).toBeInTheDocument();
    expect(screen.getByText(/108/i)).toBeInTheDocument();
  });
});

describe('Footer Component', () => {
  it('renders platform commitments and responsible use disclosure', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(/Zero Fake Statistics Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Sensitive Location Privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/Audited Resolution Verification/i)).toBeInTheDocument();
  });
});
