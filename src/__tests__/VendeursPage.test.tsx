import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import VendeursPage from '@/app/vendeurs/page'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) => {
    const { prefetch, ...rest } = props
    return <a href={href as string} {...rest}>{children}</a>
  },
}))

describe('VendeursPage', () => {
  it('affiche le titre "Marketplace Artisans"', () => {
    render(<VendeursPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Marketplace/)
  })

  it("annonce honnêtement qu'aucun vendeur n'est référencé", () => {
    render(<VendeursPage />)
    expect(screen.getByText(/aucun vendeur n.est encore référencé/)).toBeInTheDocument()
  })

  it("n'affiche ni note, ni avis, ni badge vérifié, ni bouton d'achat", () => {
    render(<VendeursPage />)
    expect(screen.queryByText(/avis/)).not.toBeInTheDocument()
    expect(screen.queryByText('Vérifié')).not.toBeInTheDocument()
    expect(screen.queryByText('Ajouter au panier')).not.toBeInTheDocument()
  })

  it("propose de devenir vendeur pilote via l'inscription vendeur", () => {
    render(<VendeursPage />)
    expect(screen.getByRole('link', { name: 'Devenir vendeur pilote' })).toHaveAttribute(
      'href',
      '/seller-register',
    )
  })
})
