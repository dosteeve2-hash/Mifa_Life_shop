import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VendeursPage, { VENDEURS } from '@/app/vendeurs/page'
import { toast } from 'sonner'

// ── Mock functions ────────────────────────────────────────────
const mockAddItem = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/vendeurs',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => {
    const { prefetch, ...rest } = props
    return <a href={href} {...rest}>{children}</a>
  },
}))

vi.mock('framer-motion', async () => {
  const { createElement } = await import('react')
  const strip = (tag: string) =>
    function MotionEl({ children, ...props }: any) {
      const { whileHover, whileTap, initial, animate, exit, transition, variants, layout, custom, drag, ...rest } = props
      return createElement(tag as any, rest, children)
    }
  return {
    motion: { div: strip('div'), button: strip('button') },
    AnimatePresence: ({ children }: any) => children ?? null,
    useAnimation: () => ({ start: () => {} }),
  }
})

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: [],
    addItem: mockAddItem,
    removeItem: vi.fn(),
    updateQty: vi.fn(),
    clearCart: vi.fn(),
    total: 0,
    count: 0,
  }),
}))

// ── Tests ─────────────────────────────────────────────────────
describe('VendeursPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sans crash', () => {
    render(<VendeursPage />)
  })

  it('affiche le titre "Marketplace Artisans"', () => {
    render(<VendeursPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Marketplace/)
  })

  it('VENDEURS contient 12 vendeurs', () => {
    expect(VENDEURS).toHaveLength(12)
  })

  it('affiche "Aminata Textile"', () => {
    render(<VendeursPage />)
    expect(screen.getByText('Aminata Textile')).toBeInTheDocument()
  })

  it('affiche "Diallo Créations"', () => {
    render(<VendeursPage />)
    expect(screen.getByText('Diallo Créations')).toBeInTheDocument()
  })

  it('affiche "Sahel Tissage"', () => {
    render(<VendeursPage />)
    expect(screen.getByText('Sahel Tissage')).toBeInTheDocument()
  })

  it('affiche la spécialité "Wax & Bogolan"', () => {
    render(<VendeursPage />)
    expect(screen.getByText('Wax & Bogolan')).toBeInTheDocument()
  })

  it('affiche la ville "Ouagadougou"', () => {
    render(<VendeursPage />)
    expect(screen.getByText(/Ouagadougou/)).toBeInTheDocument()
  })

  it('affiche la note 4.8', () => {
    render(<VendeursPage />)
    expect(screen.getAllByText('4.8').length).toBeGreaterThan(0)
  })

  it('affiche "(127 avis)" pour Aminata Textile', () => {
    render(<VendeursPage />)
    expect(screen.getByText(/127 avis/)).toBeInTheDocument()
  })

  it('affiche les badges "Vérifié" pour les vendeurs vérifiés', () => {
    render(<VendeursPage />)
    const verifiedCount = VENDEURS.filter(v => v.verifie).length
    expect(screen.getAllByText('Vérifié')).toHaveLength(verifiedCount)
  })

  it('affiche un bouton "Ajouter au panier" par vendeur (12 total)', () => {
    render(<VendeursPage />)
    expect(screen.getAllByText('Ajouter au panier')).toHaveLength(12)
  })

  it('cliquer "Ajouter au panier" appelle addItem', () => {
    render(<VendeursPage />)
    fireEvent.click(screen.getAllByText('Ajouter au panier')[0])
    expect(mockAddItem).toHaveBeenCalledOnce()
  })

  it('addItem est appelé avec le bon id vendeur', () => {
    render(<VendeursPage />)
    fireEvent.click(screen.getAllByText('Ajouter au panier')[0])
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'vendeur-aminata-kone' })
    )
  })

  it('cliquer "Ajouter au panier" affiche un toast.success', () => {
    render(<VendeursPage />)
    fireEvent.click(screen.getAllByText('Ajouter au panier')[0])
    expect(toast.success).toHaveBeenCalled()
  })

  it('affiche le champ de recherche', () => {
    render(<VendeursPage />)
    expect(screen.getByPlaceholderText(/Rechercher un vendeur/)).toBeInTheDocument()
  })

  it('filtrer par "Aminata" n\'affiche que Aminata Textile', () => {
    render(<VendeursPage />)
    fireEvent.change(screen.getByPlaceholderText(/Rechercher un vendeur/), {
      target: { value: 'Aminata' },
    })
    expect(screen.getByText('Aminata Textile')).toBeInTheDocument()
    expect(screen.queryByText('Diallo Créations')).not.toBeInTheDocument()
  })

  it('filtrer par "bijoux" retourne Diallo Créations', () => {
    render(<VendeursPage />)
    fireEvent.change(screen.getByPlaceholderText(/Rechercher un vendeur/), {
      target: { value: 'bijoux' },
    })
    expect(screen.getByText('Diallo Créations')).toBeInTheDocument()
    expect(screen.queryByText('Aminata Textile')).not.toBeInTheDocument()
  })

  it('affiche les boutons de filtre PAYS', () => {
    render(<VendeursPage />)
    expect(screen.getByRole('button', { name: 'Burkina Faso' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sénégal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mali' })).toBeInTheDocument()
  })

  it('filtrer par "Burkina Faso" masque les vendeurs des autres pays', () => {
    render(<VendeursPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Burkina Faso' }))
    expect(screen.queryByText('Diallo Créations')).not.toBeInTheDocument()
    expect(screen.queryByText('Oumar Cuir & Co')).not.toBeInTheDocument()
  })

  it('filtrer par "Burkina Faso" affiche Aminata Textile et Rasmané Poterie', () => {
    render(<VendeursPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Burkina Faso' }))
    expect(screen.getByText('Aminata Textile')).toBeInTheDocument()
    expect(screen.getByText('Rasmané Poterie')).toBeInTheDocument()
  })

  it('affiche le select de spécialité', () => {
    render(<VendeursPage />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('affiche le filtre NOTE MIN "★ 4+"', () => {
    render(<VendeursPage />)
    expect(screen.getByRole('button', { name: '★ 4+' })).toBeInTheDocument()
  })

  it('affiche le compteur "12 vendeurs"', () => {
    render(<VendeursPage />)
    expect(screen.getByText(/12 vendeurs/)).toBeInTheDocument()
  })

  it('affiche "Aucun vendeur" quand aucun résultat de recherche', () => {
    render(<VendeursPage />)
    fireEvent.change(screen.getByPlaceholderText(/Rechercher un vendeur/), {
      target: { value: 'xyzimpossible' },
    })
    expect(screen.getByText(/Aucun vendeur/)).toBeInTheDocument()
  })

  it('le bouton "Réinitialiser les filtres" remet tout à zéro', () => {
    render(<VendeursPage />)
    fireEvent.change(screen.getByPlaceholderText(/Rechercher un vendeur/), {
      target: { value: 'xyzimpossible' },
    })
    fireEvent.click(screen.getByText(/Réinitialiser les filtres/))
    expect(screen.getAllByText('Ajouter au panier')).toHaveLength(12)
  })
})
