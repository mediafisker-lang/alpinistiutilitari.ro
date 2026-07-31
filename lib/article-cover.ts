const COVERS = {
  arboriculture: "/images/articles/arboricultura.jpg",
  facade: "/images/articles/reparatii-fatade.jpg",
  industrial: "/images/articles/vopsitorie-industriala.jpg",
  inspection: "/images/articles/inspectii-ndt.jpg",
  publicity: "/images/articles/montaj-publicitar.jpg",
  roof: "/images/articles/acoperisuri-jgheaburi.jpg",
  windows: "/images/articles/spalare-geamuri.jpg",
} as const;

export function getArticleCoverUrl(slug: string) {
  const value = slug.toLowerCase();

  if (/(copac|copaci|toaletare|arbor)/.test(value)) return COVERS.arboriculture;
  if (/(geam|spalare-fatade|curatare-fatade)/.test(value)) return COVERS.windows;
  if (/(acoperis|jgheab|infiltr|hidroizol|zapada|turtur)/.test(value)) return COVERS.roof;
  if (/(banner|mesh|litere|publicitar|antena|cablu|plasa)/.test(value)) return COVERS.publicity;
  if (/(ndt|inspect|rafin|petrol|gaze|cos-industrial|eolian|turbina)/.test(value)) {
    return COVERS.inspection;
  }
  if (/(vops|anticoroz|sablare|industrial|structur|metal)/.test(value)) {
    return COVERS.industrial;
  }

  return COVERS.facade;
}
