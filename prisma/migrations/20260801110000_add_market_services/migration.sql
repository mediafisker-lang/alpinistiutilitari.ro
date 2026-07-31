-- Add the market services as active, indexable service pages.
INSERT INTO "Service" (
  "id", "name", "slug", "category", "shortName", "shortDescription",
  "longDescription", "seoTitle", "seoDescription", "icon", "isActive", "createdAt", "updatedAt"
)
SELECT
  'market-' || service.slug,
  service.name,
  service.slug,
  service.category,
  service.name,
  service.short_description,
  service.long_description,
  service.name || ' in Romania',
  service.short_description,
  service.icon,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM jsonb_to_recordset(
  $$[
    {"name":"Termoizolatii fatade la inaltime","slug":"termoizolatii-fatade-la-inaltime","category":"Fatade","short_description":"Montaj si reparatii de termosistem pe fatade greu accesibile, cu polistiren sau vata minerala.","long_description":"Termoizolatiile de fatada la inaltime acopera placari locale sau continue, refacerea zonelor desprinse, armare, masa de spaclu si finisaj, folosind acces pe coarda acolo unde schela nu este practica.","icon":"layers"},
    {"name":"Deszapezire acoperisuri","slug":"deszapezire-acoperisuri","category":"Servicii de iarna","short_description":"Indepartare controlata a zapezii de pe acoperisuri, terase si copertine cu acces dificil.","long_description":"Deszapezirea acoperisurilor reduce supraincarcarea si riscul caderilor necontrolate de zapada, cu protejarea invelitorii, delimitarea zonei de la sol si evacuarea etapizata a masei de zapada.","icon":"snowflake"},
    {"name":"Indepartare turturi si gheata","slug":"indepartare-turturi","category":"Servicii de iarna","short_description":"Eliminare rapida a turturilor si ghetii de pe cornise, jgheaburi si acoperisuri.","long_description":"Indepartarea turturilor se realizeaza controlat deasupra trotuarelor, intrarilor si parcarilor, cu securizarea perimetrului si verificarea zonelor in care gheata se poate forma din nou.","icon":"snowflake"},
    {"name":"Sisteme anti-pasari","slug":"sisteme-anti-pasari","category":"Protectie","short_description":"Montaj plase, tepi si sisteme discrete impotriva pasarilor pe fatade si acoperisuri.","long_description":"Sistemele anti-pasari protejeaza balcoane, cornise, luminatoare, hale si instalatii tehnice prin solutii adaptate geometriei cladirii, fara blocarea ventilatiei sau a accesului pentru mentenanta.","icon":"shield"},
    {"name":"Curatare panouri solare","slug":"curatare-panouri-solare","category":"Curatare","short_description":"Spalare controlata a panourilor fotovoltaice montate pe acoperisuri si structuri inalte.","long_description":"Curatarea panourilor solare indeparteaza praf, polen si depuneri fara a zgaria sticla sau afecta cablurile, cu acces sigur pe acoperis si inspectarea vizuala a prinderilor accesibile.","icon":"sun"},
    {"name":"Montaj structuri metalice la inaltime","slug":"montaj-structuri-metalice-la-inaltime","category":"Montaj industrial","short_description":"Asamblare si demontare controlata de structuri metalice in zone inalte sau greu accesibile.","long_description":"Montajul structurilor metalice la inaltime include pozitionarea elementelor, prinderi, ajustari si demontari etapizate pe hale, fatade, estacade si suporturi tehnice, in coordonare cu proiectul si operatiunile de ridicare.","icon":"construction"},
    {"name":"Vopsire acoperisuri","slug":"vopsire-acoperisuri","category":"Acoperisuri","short_description":"Pregatire si vopsire a invelitorilor metalice pe acoperisuri cu acces dificil.","long_description":"Vopsirea acoperisurilor presupune curatarea suportului, tratarea punctelor de coroziune si aplicarea unui sistem compatibil cu tabla existenta, cu atentie la rosturi, coame si zonele de evacuare a apei.","icon":"paintbrush"},
    {"name":"Curatare acoperisuri si cupole","slug":"curatare-acoperisuri-si-cupole","category":"Curatare","short_description":"Curatare depuneri, vegetatie si murdarie de pe acoperisuri, cupole si luminatoare.","long_description":"Curatarea acoperisurilor si cupolelor reda functionarea corecta a scurgerilor si suprafetelor vitrate, folosind metode adaptate materialului pentru a evita deteriorarea membranelor, tablei sau policarbonatului.","icon":"sparkles"},
    {"name":"Curatare hale industriale","slug":"curatare-hale-industriale","category":"Industrial","short_description":"Curatare la inaltime pentru grinzi, ferme, pereti si instalatii din hale industriale.","long_description":"Curatarea halelor industriale vizeaza praful si depunerile de pe structura, luminatoare, tubulaturi si suprafete greu accesibile, cu plan de lucru adaptat activitatii si restrictiilor din amplasament.","icon":"factory"},
    {"name":"Montaj aer conditionat la inaltime","slug":"montaj-aer-conditionat-la-inaltime","category":"Instalatii","short_description":"Acces si montaj pentru unitati exterioare, trasee frigorifice si suporturi pe fatade inalte.","long_description":"Montajul aparatelor de aer conditionat la inaltime faciliteaza instalarea sau inlocuirea unitatilor exterioare in pozitii inaccesibile, impreuna cu fixarea suporturilor si organizarea traseelor de instalatii.","icon":"fan"},
    {"name":"Montaj linii de viata","slug":"montaj-linii-de-viata","category":"Siguranta","short_description":"Instalare sisteme permanente de ancorare si protectie pentru accesul sigur pe acoperisuri.","long_description":"Montajul liniilor de viata creeaza trasee de protectie pentru personalul care efectueaza inspectii si mentenanta, pe baza configuratiei cladirii si a unei solutii tehnice compatibile cu suportul existent.","icon":"shield-check"},
    {"name":"Montaj geamuri si pereti cortina","slug":"montaj-geamuri-si-pereti-cortina","category":"Fatade vitrate","short_description":"Montaj, inlocuire si reglaj pentru panouri vitrate si elemente de perete cortina.","long_description":"Interventiile pe pereti cortina includ accesul pentru inlocuirea geamurilor, presarea garniturilor, remontarea capacelor si etansari locale, cu manipularea controlata a elementelor vitrate.","icon":"panels-top-left"},
    {"name":"Montaj decoratiuni la inaltime","slug":"montaj-decoratiuni-la-inaltime","category":"Montaj","short_description":"Instalare si demontare decoratiuni luminoase, ghirlande si elemente tematice pe cladiri.","long_description":"Montajul decoratiunilor la inaltime acopera fixarea, alimentarea organizata si demontarea elementelor sezoniere pe fatade, piete comerciale si structuri urbane, cu verificarea prinderilor expuse la vant.","icon":"sparkles"},
    {"name":"Reparatii balcoane la inaltime","slug":"reparatii-balcoane-la-inaltime","category":"Fatade","short_description":"Reparatii exterioare pentru placi, muchii, glafuri si finisaje degradate ale balcoanelor.","long_description":"Reparatiile balcoanelor la inaltime trateaza local betonul degradat, muchiile desprinse, fisurile si etansarile exterioare, dupa eliminarea elementelor instabile si evaluarea suportului accesibil.","icon":"hammer"},
    {"name":"Curatare si mentenanta silozuri","slug":"curatare-si-mentenanta-silozuri","category":"Industrial","short_description":"Acces specializat pentru curatarea si intretinerea silozurilor si recipientelor industriale.","long_description":"Curatarea si mentenanta silozurilor se planifica in functie de materialul depozitat, geometrie si riscurile procesului, incluzand acces, indepartarea depunerilor si inspectarea vizuala a zonelor expuse.","icon":"factory"},
    {"name":"Lucrari in spatii confinate","slug":"lucrari-in-spatii-confinate","category":"Industrial","short_description":"Interventii controlate in rezervoare, puturi si incinte cu acces limitat si ventilatie redusa.","long_description":"Lucrarile in spatii confinate necesita evaluarea atmosferei, supraveghere, comunicare si plan de salvare dedicat, pentru inspectii, curatare sau mentenanta in incinte cu intrari si iesiri limitate.","icon":"scan-search"},
    {"name":"Montaj tubulaturi industriale","slug":"montaj-tubulaturi-industriale","category":"Industrial","short_description":"Montaj si demontaj de tubulaturi, trasee si suporturi suspendate in obiective industriale.","long_description":"Montajul tubulaturilor industriale prin acces pe coarda permite pozitionarea segmentelor, suporturilor si accesoriilor in zone unde platformele nu ajung, cu integrarea lucrarii in planul tehnic al instalatiei.","icon":"pipe"},
    {"name":"Inspectii foto-video la inaltime","slug":"inspectii-foto-video-la-inaltime","category":"Inspectii","short_description":"Documentare foto-video detaliata pentru fatade, acoperisuri si structuri greu accesibile.","long_description":"Inspectiile foto-video la inaltime ofera imagini localizate ale fisurilor, coroziunii, infiltratiilor si prinderilor, utile pentru evaluare preliminara, planificarea reparatiilor si urmarirea in timp a degradarilor.","icon":"camera"},
    {"name":"Mentenanta poduri si viaducte","slug":"mentenanta-poduri-si-viaducte","category":"Infrastructura","short_description":"Acces pentru inspectii si interventii pe grinzi, pile, tabliere si elemente greu accesibile.","long_description":"Mentenanta podurilor si viaductelor prin acces pe coarda sprijina inspectarea, curatarea si reparatiile locale sub tablier sau pe pile, reducand necesarul de echipamente amplasate pe carosabil.","icon":"construction"},
    {"name":"Interventii portuare si navale","slug":"interventii-portuare-si-navale","category":"Industrial","short_description":"Lucrari la inaltime pe macarale portuare, nave, silozuri si structuri expuse mediului marin.","long_description":"Interventiile portuare si navale includ acces pentru inspectii, protectii anticorozive, montaj si reparatii locale pe structuri cu geometrii dificile, planificate in jurul operatiunilor din port sau santier naval.","icon":"anchor"}
  ]$$::jsonb
) AS service(
  name text,
  slug text,
  category text,
  short_description text,
  long_description text,
  icon text
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "shortName" = EXCLUDED."shortName",
  "shortDescription" = EXCLUDED."shortDescription",
  "longDescription" = EXCLUDED."longDescription",
  "seoTitle" = EXCLUDED."seoTitle",
  "seoDescription" = EXCLUDED."seoDescription",
  "icon" = EXCLUDED."icon",
  "isActive" = true,
  "updatedAt" = CURRENT_TIMESTAMP;
