insert into public.community_links (label, url, type)
values
  ('Grup WhatsApp', 'https://chat.whatsapp.com/JukCLwGhlkH0Lgx7vaq8CU', 'whatsapp'),
  ('Pagina Facebook', 'https://www.facebook.com/share/14XDoK32UFF/?mibextid=wwXIfr', 'facebook_page'),
  ('Grup Facebook', 'https://www.facebook.com/groups/1495237625295689', 'facebook_group')
on conflict (type) do update
set label = excluded.label,
    url = excluded.url;

insert into public.association_progress (step_title, description, step_order, completed)
values
  (
    'Comunitatea a fost organizată și mobilizată',
    'Inițiativa a fost construită împreună cu proprietarii prin comunicare constantă, convocări, voluntariat și extinderea comunității de rezidenți.',
    1,
    true
  ),
  (
    'Documentația juridică a fost pregătită',
    'Au fost solicitate și analizate oferte juridice, a fost selectată echipa de avocatură prin votul comunității, iar documentele de constituire au fost redactate și achitate.',
    2,
    true
  ),
  (
    'Suntem în etapa de strângere a semnăturilor pentru constituire',
    'În prezent lucrăm la contactarea proprietarilor, completarea bazei de date și coordonarea acțiunilor necesare pentru convocarea adunării generale și depunerea dosarului de înființare.',
    3,
    false
  )
on conflict (step_order) do update
set step_title = excluded.step_title,
    description = excluded.description,
    completed = excluded.completed;

insert into public.updates (title, content, visibility)
values
  (
    'Unde ne aflăm acum',
    'Documentația juridică este pregătită, iar etapa curentă este mobilizarea proprietarilor și strângerea semnăturilor necesare pentru constituirea asociației.',
    'public'
  )
on conflict do nothing;
