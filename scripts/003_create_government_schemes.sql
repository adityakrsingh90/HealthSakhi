-- Create government schemes table
create table if not exists public.government_schemes (
  id uuid primary key default gen_random_uuid(),
  scheme_name text not null,
  scheme_name_hi text, -- Hindi translation
  scheme_name_mr text, -- Marathi translation
  description text not null,
  description_hi text,
  description_mr text,
  eligibility_criteria jsonb not null, -- Store as JSON for flexible criteria
  benefits text not null,
  benefits_hi text,
  benefits_mr text,
  application_process text not null,
  application_process_hi text,
  application_process_mr text,
  official_website text,
  state text, -- null for central schemes
  category text not null, -- 'maternal', 'child', 'nutrition', 'financial'
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- No RLS needed - schemes are public information
alter table public.government_schemes enable row level security;

create policy "government_schemes_select_all"
  on public.government_schemes for select
  using (true);

-- Create index for faster searches
create index if not exists government_schemes_category_idx on public.government_schemes(category);
create index if not exists government_schemes_state_idx on public.government_schemes(state);

-- Insert sample schemes
insert into public.government_schemes (
  scheme_name,
  scheme_name_hi,
  description,
  description_hi,
  eligibility_criteria,
  benefits,
  benefits_hi,
  application_process,
  application_process_hi,
  official_website,
  category
) values 
(
  'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
  'प्रधानमंत्री मातृ वंदना योजना',
  'Cash incentive for pregnant and lactating mothers for the first living child',
  'पहले जीवित बच्चे के लिए गर्भवती और स्तनपान कराने वाली माताओं के लिए नकद प्रोत्साहन',
  '{"age": "19+", "pregnancy": "first_child", "income": "any"}',
  'Rs. 5,000 in three installments during pregnancy and after childbirth',
  'गर्भावस्था और प्रसव के बाद तीन किस्तों में 5,000 रुपये',
  'Register at Anganwadi Centre or approved health facility',
  'आंगनवाड़ी केंद्र या अनुमोदित स्वास्थ्य सुविधा पर पंजीकरण करें',
  'https://pmmvy.wcd.gov.in/',
  'maternal'
),
(
  'Janani Suraksha Yojana (JSY)',
  'जननी सुरक्षा योजना',
  'Safe motherhood intervention promoting institutional delivery',
  'संस्थागत प्रसव को बढ़ावा देने वाला सुरक्षित मातृत्व हस्तक्षेप',
  '{"pregnancy": "any", "delivery": "institutional", "income": "below_poverty_line"}',
  'Cash assistance for institutional delivery - Rs. 1,400 (rural) / Rs. 1,000 (urban)',
  'संस्थागत प्रसव के लिए नकद सहायता - 1,400 रुपये (ग्रामीण) / 1,000 रुपये (शहरी)',
  'Register during pregnancy at government health facility',
  'सरकारी स्वास्थ्य सुविधा पर गर्भावस्था के दौरान पंजीकरण करें',
  'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309',
  'maternal'
);
