-- Drop existing tables and policies
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Create new table structures

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('earn', 'spend')),
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS and set permissions

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Enable RLS for transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 3. Create permission policies

-- Users table policy: allow all operations
CREATE POLICY "Allow all users" ON public.users
  FOR ALL
  TO authenticated
  USING (true);

-- Products table policy: all authenticated users can view products
CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT
  TO authenticated
  USING (true);

-- Transactions table policy: allow all operations
CREATE POLICY "Allow all transactions" ON public.transactions
  FOR ALL
  TO authenticated
  USING (true);

-- 4. Add sample products
INSERT INTO public.products (name, price, description) VALUES 
('Magic Potion', 50, 'Magic potion to restore energy'),
('Lucky Charm', 100, 'Charm to increase luck'),
('Experience Book', 200, 'Book to increase experience');