import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PanierPage from '@/app/panier/page'

// ── Mock functions ────────────────────────────────────────────
const mockPush = vi.fn()
const mockUpdateQty = vi.fn()
const mockRemoveItem = vi.fn()
const mockClearCart = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/panier',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prefetch, ...rest } = props
    return <a href={href} {...rest}>{children}</a>
  },
}))

vi.mock('framer-motion', async () => {
  const { createElement } = await import('react')
  const strip = (tag: string) =>
    function MotionEl({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) {
      const { whileHover, whileTap, initial, animate, exit, transition, variants, layout, custom, drag, ...rest } = props
      return createElement(tag as React.ElementType, rest, children)
    }
  return {
    motion: { div: strip('div'), button: strip('button') },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children ?? null,
  }
})

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

// ── Cart mock data ────────────────────────────────────────────
const defaultItems = [
  { id: 'art1', nom: 'Boubou en wax', prix: 25000, quantite: 1 },
  { id: 'art2', nom: 'Bracelet bogolan', prix: 10000, quantite: 2 },
]

let mockItems: typeof defaultItems | { id: string; nom: string; prix: number; quantite: number }[] = defaultItems
let mockTotal = 45000
let mockCount = 3

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: mockItems,
    addItem: vi.fn(),
    removeItem: mockRemoveItem,
    updateQty: mockUpdateQty,
    clearCart: mockClearCart,
    total: mockTotal,
    count: mockCount,
  }),
}))

// ── Tests — panier rempli ─────────────────────────────────────
describe('PanierPage — panier rempli', () => {
  beforeEach(() => {
    mockItems = defaultItems
    mockTotal = 45000
    mockCount = 3
    vi.clearAllMocks()
  })

  it('renders sans crash', () => {
    render(<PanierPage />)
  })

  it('affiche "Mon Panier" dans le titre', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Mon Panier/)).toBeInTheDocument()
  })

  it('affiche le nombre d\'articles (3)', () => {
    render(<PanierPage />)
    expect(screen.getByText(/3 article/)).toBeInTheDocument()
  })

  it('affiche le premier produit "Boubou en wax"', () => {
    render(<PanierPage />)
    expect(screen.getByText('Boubou en wax')).toBeInTheDocument()
  })

  it('affiche le deuxième produit "Bracelet bogolan"', () => {
    render(<PanierPage />)
    expect(screen.getByText('Bracelet bogolan')).toBeInTheDocument()
  })

  it('affiche le prix unitaire du premier produit', () => {
    render(<PanierPage />)
    // "25 000 FCFA / unité"
    expect(screen.getByText(/25.*000.*FCFA.*unité/)).toBeInTheDocument()
  })

  it('affiche le prix unitaire du deuxième produit', () => {
    render(<PanierPage />)
    expect(screen.getByText(/10.*000.*FCFA.*unité/)).toBeInTheDocument()
  })

  it('affiche la quantité 1 pour le premier article', () => {
    render(<PanierPage />)
    const qty = screen.getAllByText('1')
    expect(qty.length).toBeGreaterThanOrEqual(1)
  })

  it('affiche la quantité 2 pour le deuxième article', () => {
    render(<PanierPage />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('affiche le total ligne du deuxième article (20 000 FCFA)', () => {
    render(<PanierPage />)
    expect(screen.getByText(/20.*000.*FCFA/)).toBeInTheDocument()
  })

  it('affiche la section "Résumé de commande"', () => {
    render(<PanierPage />)
    expect(screen.getByText('Résumé de commande')).toBeInTheDocument()
  })

  it('affiche le sous-total (45 000 FCFA)', () => {
    render(<PanierPage />)
    expect(screen.getAllByText(/45.*000.*FCFA/).length).toBeGreaterThan(0)
  })

  it('affiche les frais de livraison (2 500 FCFA) quand total < 50 000', () => {
    render(<PanierPage />)
    expect(screen.getByText(/2.*500.*FCFA/)).toBeInTheDocument()
  })

  it('affiche le total final (47 500 FCFA)', () => {
    render(<PanierPage />)
    expect(screen.getByText(/47.*500.*FCFA/)).toBeInTheDocument()
  })

  it('affiche le bouton "Vider le panier"', () => {
    render(<PanierPage />)
    expect(screen.getByText('Vider le panier')).toBeInTheDocument()
  })

  it('appelle clearCart en cliquant "Vider le panier"', () => {
    render(<PanierPage />)
    fireEvent.click(screen.getByText('Vider le panier'))
    expect(mockClearCart).toHaveBeenCalledOnce()
  })

  it('affiche le bouton "Passer la commande"', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Passer la commande/)).toBeInTheDocument()
  })

  it('redirige vers /checkout?source=panier en cliquant Commander', () => {
    render(<PanierPage />)
    fireEvent.click(screen.getByText(/Passer la commande/))
    expect(mockPush).toHaveBeenCalledWith('/checkout?source=panier')
  })

  it('affiche 2 boutons Augmenter (un par article)', () => {
    render(<PanierPage />)
    expect(screen.getAllByLabelText('Augmenter')).toHaveLength(2)
  })

  it('affiche 2 boutons Diminuer (un par article)', () => {
    render(<PanierPage />)
    expect(screen.getAllByLabelText('Diminuer')).toHaveLength(2)
  })

  it('appelle updateQty(id, +1) en cliquant Augmenter', () => {
    render(<PanierPage />)
    fireEvent.click(screen.getAllByLabelText('Augmenter')[0])
    expect(mockUpdateQty).toHaveBeenCalledWith('art1', 2)
  })

  it('appelle updateQty(id, 0) en cliquant Diminuer (quantite 1 → 0)', () => {
    render(<PanierPage />)
    fireEvent.click(screen.getAllByLabelText('Diminuer')[0])
    expect(mockUpdateQty).toHaveBeenCalledWith('art1', 0)
  })

  it('appelle removeItem en cliquant Supprimer', () => {
    render(<PanierPage />)
    fireEvent.click(screen.getAllByLabelText('Supprimer')[0])
    expect(mockRemoveItem).toHaveBeenCalledWith('art1')
  })

  it('affiche le lien "Retour aux vendeurs"', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Retour aux vendeurs/)).toBeInTheDocument()
  })

  it('affiche les modes de paiement (Orange Money, Wave)', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Orange Money, Wave/)).toBeInTheDocument()
  })
})

// ── Tests — livraison gratuite ────────────────────────────────
describe('PanierPage — livraison gratuite (≥ 50 000 FCFA)', () => {
  beforeEach(() => {
    mockItems = [{ id: 'art1', nom: 'Tissu premium', prix: 50000, quantite: 1 }]
    mockTotal = 50000
    mockCount = 1
    vi.clearAllMocks()
  })

  it('affiche "Gratuite 🎉" quand total ≥ 50 000', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Gratuite/)).toBeInTheDocument()
  })

  it('total final = sous-total (pas de frais livraison)', () => {
    render(<PanierPage />)
    const totals = screen.getAllByText(/50.*000.*FCFA/)
    expect(totals.length).toBeGreaterThan(0)
  })
})

// ── Tests — panier vide ───────────────────────────────────────
describe('PanierPage — panier vide', () => {
  beforeEach(() => {
    mockItems = []
    mockTotal = 0
    mockCount = 0
    vi.clearAllMocks()
  })

  it('affiche "Votre panier est vide"', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Votre panier est vide/)).toBeInTheDocument()
  })

  it('affiche le lien vers /vendeurs', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Découvrir les vendeurs/)).toBeInTheDocument()
  })

  it('affiche le lien vers /shop', () => {
    render(<PanierPage />)
    expect(screen.getByText(/Voir la boutique/)).toBeInTheDocument()
  })
})
