'use client'
import { useState, useEffect } from 'react'

export interface CartItem {
  id: string
  nom: string
  prix: number
  image?: string
  quantite: number
}

const STORAGE_KEY = 'mifa-cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved.replace(/^﻿/, '')))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'quantite'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i)
      return [...prev, { ...item, quantite: 1 }]
    })
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQty = (id: string, quantite: number) => {
    if (quantite <= 0) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantite } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((s, i) => s + i.prix * i.quantite, 0)
  const count = items.reduce((s, i) => s + i.quantite, 0)

  return { items, addItem, removeItem, updateQty, clearCart, total, count }
}
