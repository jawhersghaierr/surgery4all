-- Populate tables with the app's built-in seed content.
-- Run in the Supabase SQL editor AFTER schema.sql.
-- Safe to re-run only on empty tables: it always INSERTs (no upsert), so
-- running twice duplicates rows. Truncate first if you need a clean reload:
--   truncate cases, documents, posts, subscribers, sponsors;
-- `id` is omitted so the uuid default fills it (the app's string seed ids
-- like 'c1' don't fit the uuid columns).

insert into cases (title, specialty, type, duration, description, media_url, premium, sensitive) values
  ('Pose implant unitaire secteur 46', 'Implantologie', 'video', '12 min', 'Extraction-implantation immédiate avec mise en charge.', null, false, true),
  ('Greffe osseuse autogène mandibulaire', 'Greffe osseuse', 'video', '18 min', 'Prélèvement ramique et fixation par vis d’ostéosynthèse.', null, true, true),
  ('Sinus lift par abord latéral', 'Sinus lift', 'photo', '', 'Comblement sous-sinusien, biomatériau xénogénique.', null, true, true),
  ('Extraction dent de sagesse incluse', 'Extraction', 'video', '9 min', 'Germectomie 38 en position mésio-angulée.', null, false, true),
  ('Lambeau d’assainissement parodontal', 'Parodontologie', 'photo', '', 'Débridement à ciel ouvert secteur antérieur.', null, true, true),
  ('Régénération osseuse guidée (ROG)', 'Greffe osseuse', 'video', '16 min', 'Membrane résorbable + particules d’os.', null, true, true),
  ('Implant + provisoire immédiat secteur 21', 'Implantologie', 'photo', '', 'Zone esthétique, gestion du profil d’émergence.', null, false, false),
  ('Comblement alvéolaire post-extraction', 'Extraction', 'photo', '', 'Préservation de crête, technique socket-shield.', null, true, true);

insert into documents (title, journal, year, pdf_url, premium) values
  ('Mise en charge immédiate : revue systématique', 'Journal of Oral Implantology', '2025', null, false),
  ('Protocoles de greffe osseuse guidée — fiche technique', 'Protocole interne', '2026', null, true),
  ('Taux de survie implantaire à 10 ans', 'Clinical Oral Implants Research', '2024', null, true),
  ('Gestion des tissus mous péri-implantaires', 'Perio & Implant Digest', '2025', null, true),
  ('Antibioprophylaxie en chirurgie orale', 'Recommandations HAS', '2023', null, false);

insert into posts (title, category, excerpt, cover_url, date) values
  ('Comprendre l’implant dentaire en 5 étapes', 'Pédagogie', 'Le parcours complet, de la consultation à la couronne définitive.', null, '8 juil. 2026'),
  ('Pourquoi documenter chaque intervention ?', 'Coulisses', 'Transparence pour les patients, transmission pour les confrères.', null, '2 juil. 2026'),
  ('Sinus lift : à quoi s’attendre ?', 'Pédagogie', 'Indications, déroulé et suites opératoires expliqués simplement.', null, '24 juin 2026'),
  ('Nouveautés 2026 en implantologie guidée', 'Innovation', 'Planification 3D et chirurgie naviguée : où en est-on ?', null, '12 juin 2026');

insert into subscribers (name, initial, plan, since, status) values
  ('Dr. Laurent M.', 'L', 'Praticien (annuel)', 'Jan. 2026', 'active'),
  ('Clinique Odonto Nord', 'C', 'Institution', 'Nov. 2025', 'active'),
  ('Dr. Amira B.', 'A', 'Praticien (mensuel)', 'Mars 2026', 'active'),
  ('Étudiant · Fac Dentaire', 'É', 'Découverte', 'Fév. 2026', 'free'),
  ('Dr. Sofiane R.', 'S', 'Praticien (mensuel)', 'Avr. 2026', 'paused');

insert into sponsors (name, logo_url, url) values
  ('Straumann', null, null),
  ('Nobel Biocare', null, null),
  ('Dentsply Sirona', null, null),
  ('Geistlich', null, null),
  ('MIS Implants', null, null),
  ('BioHorizons', null, null);
