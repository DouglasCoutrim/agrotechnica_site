SET NAMES utf8mb4;
INSERT INTO site_settings (id, company_name, tagline, whatsapp_number, address, city, state,
  instagram_url, maps_link, opening_hours) VALUES
 (1, 'Agrotechnica', 'Tecnologia e soluções no agro', '5561996275673',
  'Cristalina - GO', 'Cristalina', 'GO',
  'https://www.instagram.com/agro.technica', 'https://share.google/qmnPxXPDPBWfZUeOq',
  JSON_ARRAY(JSON_OBJECT('dia','Segunda a sexta','horario','08h às 18h'),
             JSON_OBJECT('dia','Sábado','horario','08h às 12h')))
ON DUPLICATE KEY UPDATE company_name = VALUES(company_name);

INSERT IGNORE INTO whatsapp_messages (route_pattern, message) VALUES
 ('/', 'Olá! Vim pelo site da Agrotechnica e gostaria de falar com um especialista.'),
 ('/servicos/*', 'Olá! Vi um serviço no site da Agrotechnica e quero um orçamento.'),
 ('/pecas', 'Olá! Estou procurando uma peça para meu drone. Podem me ajudar?'),
 ('/pecas/*', 'Olá! Vi um produto no site da Agrotechnica e quero um orçamento.'),
 ('/gps-piloto-automatico', 'Olá! Quero saber mais sobre piloto automático e sinal RTK.'),
 ('/promocoes', 'Olá! Vi as promoções no site e quero aproveitar.');
