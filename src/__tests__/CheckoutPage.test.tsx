import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CheckoutPage from '@/app/checkout/page'
import { toast } from 'sonner'

// ── Mock functions ────────────────────────────────────────────
const mockClearCart = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams('source=panier'),
  usePathname: () => '/checkout',
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
  }
})

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

vi.mock('@/actions/checkout', () => ({
  placeOrderAction: vi.fn().mockResolvedValue({ ok: true, orderId: 'test-order-123' }),
}))

// ── Cart mock data ────────────────────────────────────────────
const panierItems = [
  { id: 'art1', nom: 'Boubou en wax', prix: 25000, quantite: 1 },
  { id: 'art2', nom: 'Bracelet bogolan', prix: 10000, quantite: 2 },
]

let mockPanierItems: typeof panierItems | [] = panierItems
let mockPanierTotal = 45000
let mockPanierCount = 3

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: mockPanierItems,
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQty: vi.fn(),
    clearCart: mockClearCart,
    total: mockPanierTotal,
    count: mockPanierCount,
  }),
}))

vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQty: vi.fn(),
    clearCart: vi.fn(),
    totalItems: 0,
    totalPrice: 0,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    itemCount: 0,
    syncing: false,
  }),
  CartProvider: ({ children }: any) => children,
  CartContextProvider: ({ children }: any) => children,
}))

// ── Helpers navigation ────────────────────────────────────────
function fillStep0AndAdvance() {
  fireEvent.change(screen.getByPlaceholderText('Coulibaly'), { target: { value: 'Coulibaly' } })
  fireEvent.change(screen.getByPlaceholderText('Ibrahim'), { target: { value: 'Ibrahim' } })
  fireEvent.change(screen.getByPlaceholderText(/\+223/), { target: { value: '+223 76 000 000' } })
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Bamako' } })
  fireEvent.click(screen.getByText(/Continuer.*Livraison/))
}

function fillStep1AndAdvance() {
  fireEvent.change(screen.getByPlaceholderText(/Rue, numéro/), { target: { value: 'Rue 123' } })
  fireEvent.click(screen.getByText(/Continuer.*Paiement/))
}

// ── Tests — step 0 (Informations) ────────────────────────────
describe('CheckoutPage — step 0 (Informations)', () => {
  beforeEach(() => {
    mockPanierItems = panierItems
    mockPanierTotal = 45000
    mockPanierCount = 3
    vi.clearAllMocks()
  })

  it('renders sans crash', () => {
    render(<CheckoutPage />)
  })

  it('affiche les 3 labels d\'étapes', () => {
    render(<CheckoutPage />)
    expect(screen.getByText('Informations')).toBeInTheDocument()
    expect(screen.getByText('Livraison')).toBeInTheDocument()
    expect(screen.getByText('Paiement')).toBeInTheDocument()
  })

  it('affiche le label "Informations"', () => {
    render(<CheckoutPage />)
    expect(screen.getByText('Informations')).toBeInTheDocument()
  })

  it('affiche le label "Livraison"', () => {
    render(<CheckoutPage />)
    expect(screen.getByText('Livraison')).toBeInTheDocument()
  })

  it('affiche le label "Paiement"', () => {
    render(<CheckoutPage />)
    expect(screen.getByText('Paiement')).toBeInTheDocument()
  })

  it('affiche le champ Nom', () => {
    render(<CheckoutPage />)
    expect(screen.getByPlaceholderText('Coulibaly')).toBeInTheDocument()
  })

  it('affiche le champ Prénom', () => {
    render(<CheckoutPage />)
    expect(screen.getByPlaceholderText('Ibrahim')).toBeInTheDocument()
  })

  it('affiche le champ Téléphone', () => {
    render(<CheckoutPage />)
    expect(screen.getByPlaceholderText(/\+223/)).toBeInTheDocument()
  })

  it('affiche le select Ville', () => {
    render(<CheckoutPage />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('affiche le bouton "Continuer → Livraison"', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/Continuer.*Livraison/)).toBeInTheDocument()
  })

  it('affiche des erreurs de validation si on avance sans remplir', () => {
    render(<CheckoutPage />)
    fireEvent.click(screen.getByText(/Continuer.*Livraison/))
    expect(screen.getAllByText('Requis').length).toBeGreaterThan(0)
  })

  it('affiche le résumé de commande dans la sidebar', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/Résumé/)).toBeInTheDocument()
  })

  it('affiche les articles dans le résumé', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/Boubou en wax/)).toBeInTheDocument()
    expect(screen.getByText(/Bracelet bogolan/)).toBeInTheDocument()
  })

  it('affiche le sous-total (45 000 FCFA)', () => {
    render(<CheckoutPage />)
    expect(screen.getAllByText(/45.*000.*FCFA/).length).toBeGreaterThan(0)
  })

  it('affiche les frais de livraison (2 500 FCFA)', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/2.*500.*FCFA/)).toBeInTheDocument()
  })

  it('affiche le total final (47 500 FCFA)', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/47.*500.*FCFA/)).toBeInTheDocument()
  })
})

// ── Tests — step 1 (Livraison) ────────────────────────────────
describe('CheckoutPage — step 1 (Livraison)', () => {
  beforeEach(() => {
    mockPanierItems = panierItems
    mockPanierTotal = 45000
    mockPanierCount = 3
    vi.clearAllMocks()
  })

  it('affiche le champ adresse à l\'étape 1', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    expect(screen.getByPlaceholderText(/Rue, numéro/)).toBeInTheDocument()
  })

  it('affiche le bouton "Continuer → Paiement"', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    expect(screen.getByText(/Continuer.*Paiement/)).toBeInTheDocument()
  })

  it('le bouton Retour ramène à l\'étape 0', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fireEvent.click(screen.getByText('← Retour'))
    expect(screen.getByPlaceholderText('Coulibaly')).toBeInTheDocument()
  })

  it('erreur validation si adresse vide à l\'étape 1', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fireEvent.click(screen.getByText(/Continuer.*Paiement/))
    expect(screen.getByText('Requis')).toBeInTheDocument()
  })
})

// ── Tests — step 2 (Paiement) ─────────────────────────────────
describe('CheckoutPage — step 2 (Paiement)', () => {
  beforeEach(() => {
    mockPanierItems = panierItems
    mockPanierTotal = 45000
    mockPanierCount = 3
    vi.clearAllMocks()
  })

  it('affiche "Orange Money" comme mode de paiement', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fillStep1AndAdvance()
    expect(screen.getByText('Orange Money')).toBeInTheDocument()
  })

  it('affiche "Wave" comme mode de paiement', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fillStep1AndAdvance()
    expect(screen.getByText('Wave')).toBeInTheDocument()
  })

  it('affiche "Espèces à la livraison"', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fillStep1AndAdvance()
    expect(screen.getByText(/Espèces à la livraison/)).toBeInTheDocument()
  })

  it('affiche le bouton "Confirmer la commande"', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fillStep1AndAdvance()
    expect(screen.getByText(/Confirmer la commande/)).toBeInTheDocument()
  })

  it('le bouton Retour (step 2) ramène à l\'étape 1', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fillStep1AndAdvance()
    fireEvent.click(screen.getByText('← Retour'))
    expect(screen.getByPlaceholderText(/Rue, numéro/)).toBeInTheDocument()
  })

  it('on peut sélectionner "Wave" comme mode de paiement', () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fillStep1AndAdvance()
    fireEvent.click(screen.getByText('Wave'))
    // The Wave button should be selected (no error thrown)
    expect(screen.getByText('Wave')).toBeInTheDocument()
  })

  it('confirmer la commande (source=panier) appelle toast.success', async () => {
    render(<CheckoutPage />)
    fillStep0AndAdvance()
    fillStep1AndAdvance()
    fireEvent.click(screen.getByText(/Confirmer la commande/))
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled()
    }, { timeout: 2000 })
  })
})

// ── Tests — panier vide ───────────────────────────────────────
describe('CheckoutPage — panier vide', () => {
  beforeEach(() => {
    mockPanierItems = []
    mockPanierTotal = 0
    mockPanierCount = 0
    vi.clearAllMocks()
  })

  it('affiche "Votre panier est vide" si aucun article', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/Votre panier est vide/)).toBeInTheDocument()
  })

  it('affiche le lien de retour au panier', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/Retour au panier/)).toBeInTheDocument()
  })
})
