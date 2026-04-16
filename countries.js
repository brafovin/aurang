// Länder-Datenbank für das Geografie-Quiz
// difficulty: 1 = leicht (bekannt), 2 = mittel, 3 = schwer
const COUNTRIES = [
  // Europa – leicht
  { name: "Deutschland",     capital: "Berlin",          flag: "🇩🇪", continent: "Europa",     difficulty: 1 },
  { name: "Frankreich",      capital: "Paris",           flag: "🇫🇷", continent: "Europa",     difficulty: 1 },
  { name: "Italien",         capital: "Rom",             flag: "🇮🇹", continent: "Europa",     difficulty: 1 },
  { name: "Spanien",         capital: "Madrid",          flag: "🇪🇸", continent: "Europa",     difficulty: 1 },
  { name: "Vereinigtes Königreich", capital: "London",   flag: "🇬🇧", continent: "Europa",     difficulty: 1 },
  { name: "Portugal",        capital: "Lissabon",        flag: "🇵🇹", continent: "Europa",     difficulty: 1 },
  { name: "Niederlande",     capital: "Amsterdam",       flag: "🇳🇱", continent: "Europa",     difficulty: 1 },
  { name: "Belgien",         capital: "Brüssel",         flag: "🇧🇪", continent: "Europa",     difficulty: 1 },
  { name: "Österreich",      capital: "Wien",            flag: "🇦🇹", continent: "Europa",     difficulty: 1 },
  { name: "Schweiz",         capital: "Bern",            flag: "🇨🇭", continent: "Europa",     difficulty: 1 },
  { name: "Schweden",        capital: "Stockholm",       flag: "🇸🇪", continent: "Europa",     difficulty: 1 },
  { name: "Norwegen",        capital: "Oslo",            flag: "🇳🇴", continent: "Europa",     difficulty: 1 },
  { name: "Dänemark",        capital: "Kopenhagen",      flag: "🇩🇰", continent: "Europa",     difficulty: 1 },
  { name: "Finnland",        capital: "Helsinki",        flag: "🇫🇮", continent: "Europa",     difficulty: 1 },
  { name: "Polen",           capital: "Warschau",        flag: "🇵🇱", continent: "Europa",     difficulty: 1 },
  { name: "Griechenland",    capital: "Athen",           flag: "🇬🇷", continent: "Europa",     difficulty: 1 },
  { name: "Irland",          capital: "Dublin",          flag: "🇮🇪", continent: "Europa",     difficulty: 1 },
  { name: "Russland",        capital: "Moskau",          flag: "🇷🇺", continent: "Europa",     difficulty: 1 },

  // Europa – mittel
  { name: "Tschechien",      capital: "Prag",            flag: "🇨🇿", continent: "Europa",     difficulty: 2 },
  { name: "Ungarn",          capital: "Budapest",        flag: "🇭🇺", continent: "Europa",     difficulty: 2 },
  { name: "Rumänien",        capital: "Bukarest",        flag: "🇷🇴", continent: "Europa",     difficulty: 2 },
  { name: "Bulgarien",       capital: "Sofia",           flag: "🇧🇬", continent: "Europa",     difficulty: 2 },
  { name: "Kroatien",        capital: "Zagreb",          flag: "🇭🇷", continent: "Europa",     difficulty: 2 },
  { name: "Serbien",         capital: "Belgrad",         flag: "🇷🇸", continent: "Europa",     difficulty: 2 },
  { name: "Ukraine",         capital: "Kiew",            flag: "🇺🇦", continent: "Europa",     difficulty: 2 },
  { name: "Island",          capital: "Reykjavík",       flag: "🇮🇸", continent: "Europa",     difficulty: 2 },
  { name: "Slowakei",        capital: "Bratislava",      flag: "🇸🇰", continent: "Europa",     difficulty: 2 },
  { name: "Slowenien",       capital: "Ljubljana",       flag: "🇸🇮", continent: "Europa",     difficulty: 2 },
  { name: "Litauen",         capital: "Vilnius",         flag: "🇱🇹", continent: "Europa",     difficulty: 2 },
  { name: "Lettland",        capital: "Riga",            flag: "🇱🇻", continent: "Europa",     difficulty: 2 },
  { name: "Estland",         capital: "Tallinn",         flag: "🇪🇪", continent: "Europa",     difficulty: 2 },

  // Europa – schwer
  { name: "Albanien",        capital: "Tirana",          flag: "🇦🇱", continent: "Europa",     difficulty: 3 },
  { name: "Nordmazedonien",  capital: "Skopje",          flag: "🇲🇰", continent: "Europa",     difficulty: 3 },
  { name: "Montenegro",      capital: "Podgorica",       flag: "🇲🇪", continent: "Europa",     difficulty: 3 },
  { name: "Moldau",          capital: "Chișinău",        flag: "🇲🇩", continent: "Europa",     difficulty: 3 },
  { name: "Belarus",         capital: "Minsk",           flag: "🇧🇾", continent: "Europa",     difficulty: 3 },
  { name: "Malta",           capital: "Valletta",        flag: "🇲🇹", continent: "Europa",     difficulty: 3 },
  { name: "Luxemburg",       capital: "Luxemburg",       flag: "🇱🇺", continent: "Europa",     difficulty: 3 },
  { name: "Liechtenstein",   capital: "Vaduz",           flag: "🇱🇮", continent: "Europa",     difficulty: 3 },
  { name: "Andorra",         capital: "Andorra la Vella",flag: "🇦🇩", continent: "Europa",     difficulty: 3 },
  { name: "Monaco",          capital: "Monaco",          flag: "🇲🇨", continent: "Europa",     difficulty: 3 },
  { name: "San Marino",      capital: "San Marino",      flag: "🇸🇲", continent: "Europa",     difficulty: 3 },
  { name: "Zypern",          capital: "Nikosia",         flag: "🇨🇾", continent: "Europa",     difficulty: 3 },
  { name: "Bosnien und Herzegowina", capital: "Sarajevo",flag: "🇧🇦", continent: "Europa",     difficulty: 3 },

  // Asien – leicht
  { name: "China",           capital: "Peking",          flag: "🇨🇳", continent: "Asien",      difficulty: 1 },
  { name: "Japan",           capital: "Tokio",           flag: "🇯🇵", continent: "Asien",      difficulty: 1 },
  { name: "Indien",          capital: "Neu-Delhi",       flag: "🇮🇳", continent: "Asien",      difficulty: 1 },
  { name: "Südkorea",        capital: "Seoul",           flag: "🇰🇷", continent: "Asien",      difficulty: 1 },
  { name: "Türkei",          capital: "Ankara",          flag: "🇹🇷", continent: "Asien",      difficulty: 1 },
  { name: "Thailand",        capital: "Bangkok",         flag: "🇹🇭", continent: "Asien",      difficulty: 1 },
  { name: "Indonesien",      capital: "Jakarta",         flag: "🇮🇩", continent: "Asien",      difficulty: 1 },

  // Asien – mittel
  { name: "Vietnam",         capital: "Hanoi",           flag: "🇻🇳", continent: "Asien",      difficulty: 2 },
  { name: "Philippinen",     capital: "Manila",          flag: "🇵🇭", continent: "Asien",      difficulty: 2 },
  { name: "Malaysia",        capital: "Kuala Lumpur",    flag: "🇲🇾", continent: "Asien",      difficulty: 2 },
  { name: "Singapur",        capital: "Singapur",        flag: "🇸🇬", continent: "Asien",      difficulty: 2 },
  { name: "Pakistan",        capital: "Islamabad",       flag: "🇵🇰", continent: "Asien",      difficulty: 2 },
  { name: "Iran",            capital: "Teheran",         flag: "🇮🇷", continent: "Asien",      difficulty: 2 },
  { name: "Irak",            capital: "Bagdad",          flag: "🇮🇶", continent: "Asien",      difficulty: 2 },
  { name: "Saudi-Arabien",   capital: "Riad",            flag: "🇸🇦", continent: "Asien",      difficulty: 2 },
  { name: "Israel",          capital: "Jerusalem",       flag: "🇮🇱", continent: "Asien",      difficulty: 2 },
  { name: "Vereinigte Arabische Emirate", capital: "Abu Dhabi", flag: "🇦🇪", continent: "Asien", difficulty: 2 },

  // Asien – schwer
  { name: "Kasachstan",      capital: "Astana",          flag: "🇰🇿", continent: "Asien",      difficulty: 3 },
  { name: "Usbekistan",      capital: "Taschkent",       flag: "🇺🇿", continent: "Asien",      difficulty: 3 },
  { name: "Mongolei",        capital: "Ulaanbaatar",     flag: "🇲🇳", continent: "Asien",      difficulty: 3 },
  { name: "Nepal",           capital: "Kathmandu",       flag: "🇳🇵", continent: "Asien",      difficulty: 3 },
  { name: "Sri Lanka",       capital: "Colombo",         flag: "🇱🇰", continent: "Asien",      difficulty: 3 },
  { name: "Bangladesch",     capital: "Dhaka",           flag: "🇧🇩", continent: "Asien",      difficulty: 3 },
  { name: "Myanmar",         capital: "Naypyidaw",       flag: "🇲🇲", continent: "Asien",      difficulty: 3 },
  { name: "Afghanistan",     capital: "Kabul",           flag: "🇦🇫", continent: "Asien",      difficulty: 3 },

  // Afrika – leicht
  { name: "Ägypten",         capital: "Kairo",           flag: "🇪🇬", continent: "Afrika",     difficulty: 1 },
  { name: "Südafrika",       capital: "Pretoria",        flag: "🇿🇦", continent: "Afrika",     difficulty: 1 },
  { name: "Marokko",         capital: "Rabat",           flag: "🇲🇦", continent: "Afrika",     difficulty: 1 },

  // Afrika – mittel
  { name: "Nigeria",         capital: "Abuja",           flag: "🇳🇬", continent: "Afrika",     difficulty: 2 },
  { name: "Kenia",           capital: "Nairobi",         flag: "🇰🇪", continent: "Afrika",     difficulty: 2 },
  { name: "Äthiopien",       capital: "Addis Abeba",     flag: "🇪🇹", continent: "Afrika",     difficulty: 2 },
  { name: "Algerien",        capital: "Algier",          flag: "🇩🇿", continent: "Afrika",     difficulty: 2 },
  { name: "Tunesien",        capital: "Tunis",           flag: "🇹🇳", continent: "Afrika",     difficulty: 2 },
  { name: "Ghana",           capital: "Accra",           flag: "🇬🇭", continent: "Afrika",     difficulty: 2 },
  { name: "Senegal",         capital: "Dakar",           flag: "🇸🇳", continent: "Afrika",     difficulty: 2 },

  // Afrika – schwer
  { name: "Tansania",        capital: "Dodoma",          flag: "🇹🇿", continent: "Afrika",     difficulty: 3 },
  { name: "Uganda",          capital: "Kampala",         flag: "🇺🇬", continent: "Afrika",     difficulty: 3 },
  { name: "Simbabwe",        capital: "Harare",          flag: "🇿🇼", continent: "Afrika",     difficulty: 3 },
  { name: "Madagaskar",      capital: "Antananarivo",    flag: "🇲🇬", continent: "Afrika",     difficulty: 3 },
  { name: "Kamerun",         capital: "Jaunde",          flag: "🇨🇲", continent: "Afrika",     difficulty: 3 },
  { name: "Angola",          capital: "Luanda",          flag: "🇦🇴", continent: "Afrika",     difficulty: 3 },
  { name: "Mosambik",        capital: "Maputo",          flag: "🇲🇿", continent: "Afrika",     difficulty: 3 },
  { name: "Namibia",         capital: "Windhoek",        flag: "🇳🇦", continent: "Afrika",     difficulty: 3 },
  { name: "Botswana",        capital: "Gaborone",        flag: "🇧🇼", continent: "Afrika",     difficulty: 3 },
  { name: "Libyen",          capital: "Tripolis",        flag: "🇱🇾", continent: "Afrika",     difficulty: 3 },

  // Nordamerika
  { name: "Vereinigte Staaten", capital: "Washington, D.C.", flag: "🇺🇸", continent: "Nordamerika", difficulty: 1 },
  { name: "Kanada",          capital: "Ottawa",          flag: "🇨🇦", continent: "Nordamerika", difficulty: 1 },
  { name: "Mexiko",          capital: "Mexiko-Stadt",    flag: "🇲🇽", continent: "Nordamerika", difficulty: 1 },
  { name: "Kuba",            capital: "Havanna",         flag: "🇨🇺", continent: "Nordamerika", difficulty: 2 },
  { name: "Jamaika",         capital: "Kingston",        flag: "🇯🇲", continent: "Nordamerika", difficulty: 2 },
  { name: "Panama",          capital: "Panama-Stadt",    flag: "🇵🇦", continent: "Nordamerika", difficulty: 2 },
  { name: "Costa Rica",      capital: "San José",        flag: "🇨🇷", continent: "Nordamerika", difficulty: 2 },
  { name: "Dominikanische Republik", capital: "Santo Domingo", flag: "🇩🇴", continent: "Nordamerika", difficulty: 3 },
  { name: "Guatemala",       capital: "Guatemala-Stadt", flag: "🇬🇹", continent: "Nordamerika", difficulty: 3 },
  { name: "Honduras",        capital: "Tegucigalpa",     flag: "🇭🇳", continent: "Nordamerika", difficulty: 3 },
  { name: "Nicaragua",       capital: "Managua",         flag: "🇳🇮", continent: "Nordamerika", difficulty: 3 },

  // Südamerika
  { name: "Brasilien",       capital: "Brasília",        flag: "🇧🇷", continent: "Südamerika", difficulty: 1 },
  { name: "Argentinien",     capital: "Buenos Aires",    flag: "🇦🇷", continent: "Südamerika", difficulty: 1 },
  { name: "Chile",           capital: "Santiago",        flag: "🇨🇱", continent: "Südamerika", difficulty: 1 },
  { name: "Peru",            capital: "Lima",            flag: "🇵🇪", continent: "Südamerika", difficulty: 2 },
  { name: "Kolumbien",       capital: "Bogotá",          flag: "🇨🇴", continent: "Südamerika", difficulty: 2 },
  { name: "Venezuela",       capital: "Caracas",         flag: "🇻🇪", continent: "Südamerika", difficulty: 2 },
  { name: "Ecuador",         capital: "Quito",           flag: "🇪🇨", continent: "Südamerika", difficulty: 2 },
  { name: "Uruguay",         capital: "Montevideo",      flag: "🇺🇾", continent: "Südamerika", difficulty: 2 },
  { name: "Bolivien",        capital: "Sucre",           flag: "🇧🇴", continent: "Südamerika", difficulty: 3 },
  { name: "Paraguay",        capital: "Asunción",        flag: "🇵🇾", continent: "Südamerika", difficulty: 3 },
  { name: "Guyana",          capital: "Georgetown",      flag: "🇬🇾", continent: "Südamerika", difficulty: 3 },
  { name: "Suriname",        capital: "Paramaribo",      flag: "🇸🇷", continent: "Südamerika", difficulty: 3 },

  // Ozeanien
  { name: "Australien",      capital: "Canberra",        flag: "🇦🇺", continent: "Ozeanien",   difficulty: 1 },
  { name: "Neuseeland",      capital: "Wellington",      flag: "🇳🇿", continent: "Ozeanien",   difficulty: 1 },
  { name: "Fidschi",         capital: "Suva",            flag: "🇫🇯", continent: "Ozeanien",   difficulty: 3 },
  { name: "Papua-Neuguinea", capital: "Port Moresby",    flag: "🇵🇬", continent: "Ozeanien",   difficulty: 3 },
  { name: "Samoa",           capital: "Apia",            flag: "🇼🇸", continent: "Ozeanien",   difficulty: 3 },
  { name: "Tonga",           capital: "Nukuʻalofa",      flag: "🇹🇴", continent: "Ozeanien",   difficulty: 3 },
];

if (typeof module !== "undefined") {
  module.exports = COUNTRIES;
}
