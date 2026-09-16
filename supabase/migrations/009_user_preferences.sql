-- Migration 009 : Préférences utilisateur (notifications, langue, devise, thème)
-- Sprint 12B — Page /compte/parametres

CREATE TABLE IF NOT EXISTS user_preferences (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  notif_commandes   BOOLEAN DEFAULT true,
  notif_promotions  BOOLEAN DEFAULT true,
  notif_newsletter  BOOLEAN DEFAULT false,
  langue      TEXT DEFAULT 'fr',
  devise      TEXT DEFAULT 'XOF',
  theme       TEXT DEFAULT 'light',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own prefs"
  ON user_preferences
  FOR ALL
  USING (auth.uid() = user_id);
