-- Create home remedies knowledge base
create table if not exists public.home_remedies (
  id uuid primary key default gen_random_uuid(),
  condition_name text not null,
  condition_name_hi text,
  condition_name_mr text,
  symptoms text not null,
  symptoms_hi text,
  symptoms_mr text,
  remedy_description text not null,
  remedy_description_hi text,
  remedy_description_mr text,
  ingredients jsonb, -- List of ingredients needed
  preparation_steps text not null,
  preparation_steps_hi text,
  preparation_steps_mr text,
  precautions text,
  precautions_hi text,
  precautions_mr text,
  who_approved boolean default false, -- WHO-approved remedies
  age_group text, -- 'infant', 'child', 'adult', 'all'
  category text not null, -- 'cold', 'fever', 'digestion', 'skin', etc.
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- No RLS needed - remedies are public information
alter table public.home_remedies enable row level security;

create policy "home_remedies_select_all"
  on public.home_remedies for select
  using (true);

-- Create index for faster searches
create index if not exists home_remedies_category_idx on public.home_remedies(category);
create index if not exists home_remedies_age_group_idx on public.home_remedies(age_group);

-- Insert sample remedies
insert into public.home_remedies (
  condition_name,
  condition_name_hi,
  symptoms,
  symptoms_hi,
  remedy_description,
  remedy_description_hi,
  ingredients,
  preparation_steps,
  preparation_steps_hi,
  precautions,
  precautions_hi,
  who_approved,
  age_group,
  category
) values 
(
  'Common Cold in Children',
  'बच्चों में सामान्य सर्दी',
  'Runny nose, sneezing, mild fever, congestion',
  'नाक बहना, छींक आना, हल्का बुखार, जमाव',
  'Honey and warm water can help soothe throat and reduce cough',
  'शहद और गर्म पानी गले को शांत करने और खांसी को कम करने में मदद कर सकता है',
  '["honey", "warm water"]',
  '1. Mix 1 teaspoon of honey in warm water. 2. Give to child (above 1 year) 2-3 times daily. 3. Ensure adequate rest and hydration.',
  '1. गर्म पानी में 1 चम्मच शहद मिलाएं। 2. बच्चे को (1 वर्ष से अधिक) दिन में 2-3 बार दें। 3. पर्याप्त आराम और जलयोजन सुनिश्चित करें।',
  'Do not give honey to children under 1 year. Consult doctor if fever persists beyond 3 days.',
  '1 वर्ष से कम उम्र के बच्चों को शहद न दें। यदि बुखार 3 दिनों से अधिक समय तक बना रहता है तो डॉक्टर से परामर्श लें।',
  true,
  'child',
  'cold'
),
(
  'Infant Colic Relief',
  'शिशु पेट दर्द से राहत',
  'Excessive crying, pulling legs to stomach, gas',
  'अत्यधिक रोना, पेट की ओर पैर खींचना, गैस',
  'Gentle tummy massage with warm oil can provide relief',
  'गर्म तेल से पेट की हल्की मालिश राहत प्रदान कर सकती है',
  '["coconut oil", "warm compress"]',
  '1. Warm coconut oil slightly. 2. Gently massage baby''s tummy in clockwise circles. 3. Apply warm compress if needed. 4. Burp baby after feeding.',
  '1. नारियल तेल को हल्का गर्म करें। 2. बच्चे के पेट पर दक्षिणावर्त गोलाकार में धीरे से मालिश करें। 3. यदि आवश्यक हो तो गर्म सेक लगाएं। 4. दूध पिलाने के बाद बच्चे को डकार दिलाएं।',
  'If crying persists for hours or baby has fever, consult pediatrician immediately.',
  'यदि रोना घंटों तक बना रहता है या बच्चे को बुखार है, तो तुरंत बाल रोग विशेषज्ञ से परामर्श लें।',
  true,
  'infant',
  'digestion'
);
