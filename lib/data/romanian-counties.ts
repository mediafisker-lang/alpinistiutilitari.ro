export type RomanianCountySeed = {
  name: string;
  slug: string;
  shortCode: string;
  countySeat: string;
  extraCities?: string[];
};

export const romanianCounties: RomanianCountySeed[] = [
  { name: "Alba", slug: "alba", shortCode: "AB", countySeat: "Alba Iulia", extraCities: ["Sebeș", "Aiud", "Blaj", "Cugir", "Ocna Mureș", "Teiuș"] },
  { name: "Arad", slug: "arad", shortCode: "AR", countySeat: "Arad", extraCities: ["Ineu", "Lipova", "Curtici", "Pecica", "Sântana", "Chișineu-Criș"] },
  { name: "Arges", slug: "arges", shortCode: "AG", countySeat: "Pitesti", extraCities: ["Mioveni", "Curtea de Arges", "Campulung", "Costești", "Ștefănești", "Topoloveni"] },
  { name: "Bacau", slug: "bacau", shortCode: "BC", countySeat: "Bacau", extraCities: ["Onesti", "Moinesti", "Comanesti", "Buhuși", "Dărmănești", "Târgu Ocna"] },
  { name: "Bihor", slug: "bihor", shortCode: "BH", countySeat: "Oradea", extraCities: ["Salonta", "Marghita", "Beius", "Aleșd", "Valea lui Mihai", "Ștei"] },
  { name: "Bistrita-Nasaud", slug: "bistrita-nasaud", shortCode: "BN", countySeat: "Bistrita", extraCities: ["Nasaud", "Beclean", "Sangeorz-Bai", "Prundu Bârgăului", "Rodna"] },
  { name: "Botosani", slug: "botosani", shortCode: "BT", countySeat: "Botosani", extraCities: ["Dorohoi", "Darabani", "Saveni", "Flămânzi", "Bucecea"] },
  { name: "Braila", slug: "braila", shortCode: "BR", countySeat: "Braila", extraCities: ["Ianca", "Faurei", "Insuratei", "Viziru", "Chiscani"] },
  {
    name: "Brasov",
    slug: "brasov",
    shortCode: "BV",
    countySeat: "Brasov",
    extraCities: ["Sacele", "Făgăraș", "Codlea", "Râșnov", "Zărnești", "Predeal"],
  },
  { name: "Bucuresti", slug: "bucuresti", shortCode: "B", countySeat: "Bucuresti", extraCities: ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"] },
  { name: "Buzau", slug: "buzau", shortCode: "BZ", countySeat: "Buzau", extraCities: ["Ramnicu Sarat", "Nehoiu", "Pătârlagele", "Pogoanele"] },
  { name: "Calarasi", slug: "calarasi", shortCode: "CL", countySeat: "Calarasi", extraCities: ["Oltenita", "Lehliu Gara", "Budești", "Fundulea"] },
  { name: "Caras-Severin", slug: "caras-severin", shortCode: "CS", countySeat: "Resita", extraCities: ["Caransebes", "Oravita", "Bocsa", "Moldova Nouă", "Anina"] },
  {
    name: "Cluj",
    slug: "cluj",
    shortCode: "CJ",
    countySeat: "Cluj-Napoca",
    extraCities: ["Turda", "Dej", "Câmpia Turzii", "Gherla", "Huedin", "Florești"],
  },
  { name: "Constanta", slug: "constanta", shortCode: "CT", countySeat: "Constanta", extraCities: ["Mangalia", "Medgidia", "Navodari", "Cernavodă", "Eforie", "Ovidiu"] },
  { name: "Covasna", slug: "covasna", shortCode: "CV", countySeat: "Sfantu Gheorghe", extraCities: ["Targu Secuiesc", "Covasna", "Întorsura Buzăului", "Baraolt"] },
  { name: "Dambovita", slug: "dambovita", shortCode: "DB", countySeat: "Targoviste", extraCities: ["Moreni", "Gaesti", "Pucioasa", "Titu", "Fieni", "Răcari"] },
  { name: "Dolj", slug: "dolj", shortCode: "DJ", countySeat: "Craiova", extraCities: ["Bailesti", "Calafat", "Filiasi", "Bechet", "Dăbuleni", "Segarcea"] },
  { name: "Galati", slug: "galati", shortCode: "GL", countySeat: "Galati", extraCities: ["Tecuci", "Targu Bujor", "Berești", "Pechea"] },
  { name: "Giurgiu", slug: "giurgiu", shortCode: "GR", countySeat: "Giurgiu", extraCities: ["Bolintin-Vale", "Mihailesti", "Comana", "Singureni"] },
  { name: "Gorj", slug: "gorj", shortCode: "GJ", countySeat: "Targu Jiu", extraCities: ["Motru", "Rovinari", "Bumbesti-Jiu", "Târgu Cărbunești", "Novaci"] },
  { name: "Harghita", slug: "harghita", shortCode: "HR", countySeat: "Miercurea-Ciuc", extraCities: ["Odorheiu Secuiesc", "Gheorgheni", "Toplita", "Cristuru Secuiesc", "Vlăhița"] },
  { name: "Hunedoara", slug: "hunedoara", shortCode: "HD", countySeat: "Deva", extraCities: ["Hunedoara", "Petrosani", "Orastie", "Brad", "Lupeni", "Vulcan"] },
  { name: "Ialomita", slug: "ialomita", shortCode: "IL", countySeat: "Slobozia", extraCities: ["Urziceni", "Fetesti", "Amara", "Țăndărei"] },
  { name: "Iasi", slug: "iasi", shortCode: "IS", countySeat: "Iasi", extraCities: ["Pascani", "Harlau", "Targu Frumos", "Podu Iloaiei", "Holboca", "Miroslava"] },
  {
    name: "Ilfov",
    slug: "ilfov",
    shortCode: "IF",
    countySeat: "Voluntari",
    extraCities: [
      "Otopeni",
      "Pantelimon",
      "Chiajna",
      "Bragadiru",
      "Popesti-Leordeni",
      "Magurele",
      "Dobroiesti",
      "Stefanestii de Jos",
      "Caldararu",
      "Tunari",
      "Buftea",
      "Snagov",
      "Afumați",
    ],
  },
  { name: "Maramures", slug: "maramures", shortCode: "MM", countySeat: "Baia Mare", extraCities: ["Sighetu Marmatiei", "Borsa", "Viseu de Sus", "Târgu Lăpuș", "Baia Sprie"] },
  { name: "Mehedinti", slug: "mehedinti", shortCode: "MH", countySeat: "Drobeta-Turnu Severin", extraCities: ["Orsova", "Strehaia", "Vânju Mare", "Baia de Aramă"] },
  { name: "Mures", slug: "mures", shortCode: "MS", countySeat: "Targu Mures", extraCities: ["Sighisoara", "Reghin", "Ludus", "Târnăveni", "Sovata"] },
  { name: "Neamt", slug: "neamt", shortCode: "NT", countySeat: "Piatra-Neamt", extraCities: ["Roman", "Targu Neamt", "Bicaz", "Roznov", "Săvinești"] },
  { name: "Olt", slug: "olt", shortCode: "OT", countySeat: "Slatina", extraCities: ["Caracal", "Bals", "Corabia", "Drăgănești-Olt", "Scornicești"] },
  { name: "Prahova", slug: "prahova", shortCode: "PH", countySeat: "Ploiesti", extraCities: ["Campina", "Sinaia", "Busteni", "Azuga", "Comarnic", "Vălenii de Munte"] },
  { name: "Salaj", slug: "salaj", shortCode: "SJ", countySeat: "Zalau", extraCities: ["Simleu Silvaniei", "Jibou", "Cehu Silvaniei"] },
  { name: "Satu Mare", slug: "satu-mare", shortCode: "SM", countySeat: "Satu Mare", extraCities: ["Carei", "Negresti-Oas", "Tășnad", "Livada"] },
  { name: "Sibiu", slug: "sibiu", shortCode: "SB", countySeat: "Sibiu", extraCities: ["Medias", "Cisnadie", "Avrig", "Agnita", "Dumbrăveni"] },
  { name: "Suceava", slug: "suceava", shortCode: "SV", countySeat: "Suceava", extraCities: ["Falticeni", "Radauti", "Campulung Moldovenesc", "Vatra Dornei", "Gura Humorului"] },
  { name: "Teleorman", slug: "teleorman", shortCode: "TR", countySeat: "Alexandria", extraCities: ["Rosiorii de Vede", "Turnu Magurele", "Zimnicea", "Videle"] },
  { name: "Timis", slug: "timis", shortCode: "TM", countySeat: "Timisoara", extraCities: ["Lugoj", "Sannicolau Mare", "Jimbolia", "Dumbrăvița", "Giroc", "Moșnița Nouă"] },
  { name: "Tulcea", slug: "tulcea", shortCode: "TL", countySeat: "Tulcea", extraCities: ["Macin", "Babadag", "Isaccea", "Sulina"] },
  { name: "Valcea", slug: "valcea", shortCode: "VL", countySeat: "Ramnicu Valcea", extraCities: ["Dragasani", "Calimanesti", "Băile Olănești", "Horezu", "Brezoi"] },
  { name: "Vaslui", slug: "vaslui", shortCode: "VS", countySeat: "Vaslui", extraCities: ["Barlad", "Husi", "Negresti", "Murgeni"] },
  { name: "Vrancea", slug: "vrancea", shortCode: "VN", countySeat: "Focsani", extraCities: ["Adjud", "Marasesti", "Odobești", "Panciu"] },
];

export function buildCountyIntro(countyName: string) {
  return `Firme de alpinism utilitar din ${countyName} pentru lucrări la înălțime, fațade, acoperișuri, bannere și intervenții comerciale rapide.`;
}

export function buildCountySeoDescription(countyName: string) {
  return `Găsești firme de alpinism utilitar în ${countyName}, servicii populare și pagini locale utile pentru căutări comerciale din România.`;
}

export function buildCityIntro(cityName: string, countyName: string) {
  return `Pagina locală pentru ${cityName}, ${countyName}, orientată spre căutări comerciale pentru alpinism utilitar și servicii conexe la înălțime.`;
}
