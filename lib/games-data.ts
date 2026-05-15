export interface Game {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  coverImage: string;
  screenshots: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  genres: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  positivePercentage: number;
  features: string[];
  systemRequirements: {
    minimum: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
    recommended: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
  };
}

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: 'positive' | 'negative';
  hoursPlayed: number;
  content: string;
  date: string;
  helpful: number;
  funny: number;
}

export const games: Game[] = [
  {
    id: "1",
    title: "Elden Ring",
    description: "Um RPG de ação épico ambientado em um mundo de fantasia sombria criado por Hidetaka Miyazaki e George R.R. Martin.",
    longDescription: "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected.",
    price: 249.90,
    originalPrice: 299.90,
    discount: 17,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_e80a907c2c43337e53316c71555c3c3035a1343e.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_c372274833ae6e5437b952fa1979430546a43ad9.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_1011610a0e330c41a75ffd0b3a9a1bac3205c46a.jpg"
    ],
    developer: "FromSoftware Inc.",
    publisher: "Bandai Namco Entertainment",
    releaseDate: "25 de fevereiro de 2022",
    genres: ["Ação", "RPG", "Mundo Aberto"],
    tags: ["Souls-like", "Fantasia Sombria", "Difícil", "Cooperativo"],
    rating: 4.8,
    reviewCount: 524789,
    positivePercentage: 93,
    features: ["Um jogador", "Cooperativo Online", "PvP Online", "Conquistas"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-8400", memory: "12 GB RAM", graphics: "GTX 1060 3GB", storage: "60 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-8700K", memory: "16 GB RAM", graphics: "GTX 1070 8GB", storage: "60 GB SSD" }
    }
  },
  {
    id: "2",
    title: "Cyberpunk 2077",
    description: "Um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e modificação corporal.",
    longDescription: "Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto que se passa em Night City, uma megalópole obcecada por poder, glamour e modificação corporal. Você joga como V, um mercenário em busca de um implante único que é a chave para a imortalidade.",
    price: 199.90,
    originalPrice: 299.90,
    discount: 33,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_b529b0abc43f55fc23fe8058eddb6e37c9629a6a.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_872822c5e50dc71f345416098d29fc3ae5cd26c3.jpg"
    ],
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    releaseDate: "10 de dezembro de 2020",
    genres: ["RPG", "Ação", "Mundo Aberto"],
    tags: ["Cyberpunk", "Futurista", "História Rica", "Escolhas Importam"],
    rating: 4.5,
    reviewCount: 789456,
    positivePercentage: 86,
    features: ["Um jogador", "Ray Tracing", "HDR", "Conquistas"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-3570K", memory: "8 GB RAM", graphics: "GTX 970", storage: "70 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-4790", memory: "16 GB RAM", graphics: "RTX 2060", storage: "70 GB SSD" }
    }
  },
  {
    id: "3",
    title: "Red Dead Redemption 2",
    description: "A épica saga de Arthur Morgan e da gangue Van der Linde enquanto fogem pela América no alvorecer da era moderna.",
    longDescription: "America, 1899. O fim da era do velho oeste começou. Após um roubo que deu errado na cidade de Blackwater, Arthur Morgan e a gangue Van der Linde são forçados a fugir. Com agentes federais e os melhores caçadores de recompensas no encalço, a gangue deve roubar, assaltar e lutar para sobreviver.",
    price: 239.90,
    originalPrice: 299.90,
    discount: 20,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_66b553f4c209476d3e4ce25fa4714f7a0b886c03.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_d1a8f5a69155c3186c65d1da90491fcfd43663d9.jpg"
    ],
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    releaseDate: "5 de dezembro de 2019",
    genres: ["Ação", "Aventura", "Mundo Aberto"],
    tags: ["Western", "História Rica", "Cavalos", "Multiplayer"],
    rating: 4.9,
    reviewCount: 612345,
    positivePercentage: 95,
    features: ["Um jogador", "Red Dead Online", "Conquistas"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-2500K", memory: "8 GB RAM", graphics: "GTX 770 2GB", storage: "150 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-4770K", memory: "12 GB RAM", graphics: "GTX 1060 6GB", storage: "150 GB SSD" }
    }
  },
  {
    id: "4",
    title: "God of War",
    description: "Sua vingança contra os deuses do Olimpo agora é passado. Kratos vive como um homem longe das sombras dos deuses.",
    longDescription: "Sua vingança contra os deuses do Olimpo agora é passado. Kratos vive como um homem nos confins mais frios de Midgard, nos reinos dos Deuses Nórdicos. Neste mundo hostil, ele deve lutar para sobreviver e ensinar seu filho a fazer o mesmo.",
    price: 199.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_a6c5e07210e9f1db916e32c0d77e8545a6e60b1c.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_d6c5d0c7c0a1e7e8d7e3f1b2a3b4c5d6e7f8a9b0.jpg"
    ],
    developer: "Santa Monica Studio",
    publisher: "PlayStation PC LLC",
    releaseDate: "14 de janeiro de 2022",
    genres: ["Ação", "Aventura", "Hack and Slash"],
    tags: ["Mitologia Nórdica", "Terceira Pessoa", "Pai e Filho"],
    rating: 4.9,
    reviewCount: 89234,
    positivePercentage: 97,
    features: ["Um jogador", "DLSS", "Controle Total"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-2500K", memory: "8 GB RAM", graphics: "GTX 960", storage: "70 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-4770K", memory: "16 GB RAM", graphics: "RTX 2060", storage: "70 GB SSD" }
    }
  },
  {
    id: "5",
    title: "Hogwarts Legacy",
    description: "Viva a aventura de um estudante em Hogwarts no século 19. Sua história. Seu legado.",
    longDescription: "Hogwarts Legacy é um RPG de ação em mundo aberto ambientado no mundo dos livros de Harry Potter. Embarque em uma jornada pelo mundo bruxo enquanto explora Hogwarts, Hogsmeade e descobre segredos antigos.",
    price: 249.90,
    originalPrice: 299.90,
    discount: 17,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_40e3c3a8c3c1f3c2e3d4f5a6b7c8d9e0f1a2b3c4.jpg"
    ],
    developer: "Avalanche Software",
    publisher: "Warner Bros. Games",
    releaseDate: "10 de fevereiro de 2023",
    genres: ["RPG", "Ação", "Mundo Aberto"],
    tags: ["Magia", "Harry Potter", "Fantasia", "Exploração"],
    rating: 4.6,
    reviewCount: 234567,
    positivePercentage: 89,
    features: ["Um jogador", "Ray Tracing", "Personalização"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-6600", memory: "16 GB RAM", graphics: "GTX 960", storage: "85 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-8700", memory: "32 GB RAM", graphics: "RTX 2080 Ti", storage: "85 GB SSD" }
    }
  },
  {
    id: "6",
    title: "The Witcher 3: Wild Hunt",
    description: "Você é Geralt de Rívia, caçador de monstros. Em um continente devastado pela guerra e infestado por monstros, você embarca em sua maior aventura.",
    longDescription: "The Witcher: Wild Hunt é um RPG de ação em mundo aberto que se passa em um universo de fantasia sombria. Você joga como Geralt de Rívia, um caçador de monstros profissional encarregado de encontrar a Criança da Profecia.",
    price: 79.90,
    originalPrice: 159.90,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_b74d60ee215337d765e4d20c8ca6710ae2362cc2.jpg"
    ],
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    releaseDate: "18 de maio de 2015",
    genres: ["RPG", "Ação", "Mundo Aberto"],
    tags: ["Fantasia", "História Rica", "Escolhas Importam"],
    rating: 4.9,
    reviewCount: 678901,
    positivePercentage: 98,
    features: ["Um jogador", "DLCs Inclusos", "New Game+"],
    systemRequirements: {
      minimum: { os: "Windows 7/8/10", processor: "Intel Core i5-2500K", memory: "6 GB RAM", graphics: "GTX 660", storage: "50 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-3770", memory: "8 GB RAM", graphics: "GTX 770", storage: "50 GB SSD" }
    }
  },
  {
    id: "7",
    title: "Baldur's Gate 3",
    description: "Uma história épica de companheirismo e traição, sobrevivência e sacrifício, e a tentação do poder absoluto.",
    longDescription: "Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de amizade e traição, sacrifício e sobrevivência, e a atração do poder absoluto. Experiência RPG completa da Larian Studios.",
    price: 199.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_c310f3bc9b4e3c5d7e8f9a0b1c2d3e4f5a6b7c8d.jpg"
    ],
    developer: "Larian Studios",
    publisher: "Larian Studios",
    releaseDate: "3 de agosto de 2023",
    genres: ["RPG", "Estratégia", "Turno"],
    tags: ["D&D", "Cooperativo", "Escolhas Importam"],
    rating: 4.9,
    reviewCount: 456789,
    positivePercentage: 96,
    features: ["Um jogador", "Cooperativo 4 jogadores", "Cross-play"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-4690", memory: "8 GB RAM", graphics: "GTX 970", storage: "150 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-8700K", memory: "16 GB RAM", graphics: "RTX 2060 Super", storage: "150 GB SSD" }
    }
  },
  {
    id: "8",
    title: "Grand Theft Auto V",
    description: "Quando um jovem vigarista, um ex-ladrão de bancos aposentado e um psicopata aterrorizante se envolvem com criminosos do submundo.",
    longDescription: "Grand Theft Auto V para PC oferece aos jogadores a opção de explorar o mundo de Los Santos e Blaine County em resoluções de até 4K e além, além de executar o jogo a 60 quadros por segundo.",
    price: 74.95,
    originalPrice: 149.90,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_0e9f43c7c3d3d7d4f5e6a7b8c9d0e1f2a3b4c5d6.jpg"
    ],
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    releaseDate: "14 de abril de 2015",
    genres: ["Ação", "Aventura", "Mundo Aberto"],
    tags: ["Crime", "Multiplayer", "Sandbox"],
    rating: 4.7,
    reviewCount: 1234567,
    positivePercentage: 90,
    features: ["Um jogador", "GTA Online", "Editor de Vídeos"],
    systemRequirements: {
      minimum: { os: "Windows 8.1", processor: "Intel Core 2 Quad Q6600", memory: "4 GB RAM", graphics: "GTX 9800", storage: "72 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-3470", memory: "8 GB RAM", graphics: "GTX 660 2GB", storage: "72 GB SSD" }
    }
  },
  {
    id: "9",
    title: "Counter-Strike 2",
    description: "Por mais de duas décadas, Counter-Strike ofereceu uma experiência competitiva de elite. Counter-Strike 2 é a maior atualização técnica da história.",
    longDescription: "Counter-Strike 2 é a maior atualização técnica da história de Counter-Strike, garantindo que CS continue sendo o melhor FPS competitivo por muitos anos. Renderização sub-tick, mapas atualizados e muito mais.",
    price: 0,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_118cb022b9a43f70d2e5a2df7427f29088b6b191.jpg"
    ],
    developer: "Valve",
    publisher: "Valve",
    releaseDate: "21 de agosto de 2012",
    genres: ["Ação", "FPS", "Competitivo"],
    tags: ["Tático", "Esports", "Multiplayer"],
    rating: 4.6,
    reviewCount: 7654321,
    positivePercentage: 88,
    features: ["Multiplayer", "Competitivo", "Workshop"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-750", memory: "8 GB RAM", graphics: "GTX 650 Ti", storage: "85 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-8400", memory: "16 GB RAM", graphics: "RTX 2060", storage: "85 GB SSD" }
    }
  },
  {
    id: "10",
    title: "Starfield",
    description: "A nova geração de RPG da Bethesda Game Studios. Crie qualquer personagem e explore com liberdade incomparável.",
    longDescription: "No maior e mais ambicioso jogo da Bethesda, você pode embarcar em uma jornada épica pela galáxia. Crie seu personagem, escolha suas habilidades e explore mais de 1000 planetas.",
    price: 299.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_9f6c4c3b5a3e2e1d0c9b8a7f6e5d4c3b2a1f0e9d.jpg"
    ],
    developer: "Bethesda Game Studios",
    publisher: "Bethesda Softworks",
    releaseDate: "6 de setembro de 2023",
    genres: ["RPG", "Ação", "Espacial"],
    tags: ["Exploração", "Ficção Científica", "Mundo Aberto"],
    rating: 4.2,
    reviewCount: 123456,
    positivePercentage: 75,
    features: ["Um jogador", "Criação de Personagem", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "AMD Ryzen 5 2600X", memory: "16 GB RAM", graphics: "GTX 1070 Ti", storage: "125 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "AMD Ryzen 5 3600X", memory: "32 GB RAM", graphics: "RTX 2080", storage: "125 GB SSD" }
    }
  },
  {
    id: "11",
    title: "Resident Evil 4",
    description: "O agente Leon S. Kennedy é designado para resgatar a filha do presidente dos EUA, sequestrada por uma seita misteriosa.",
    longDescription: "Sobrevivendo aos horrores da cidade de Raccoon, Leon S. Kennedy tornou-se agente especial. Seis anos depois, ele é enviado em missão de resgate à Europa rural, onde encontra uma nova ameaça biológica.",
    price: 249.90,
    originalPrice: 299.90,
    discount: 17,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg",
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/ss_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg"
    ],
    developer: "CAPCOM",
    publisher: "CAPCOM",
    releaseDate: "24 de março de 2023",
    genres: ["Terror", "Ação", "Sobrevivência"],
    tags: ["Remake", "Zumbis", "Terceira Pessoa"],
    rating: 4.8,
    reviewCount: 178234,
    positivePercentage: 94,
    features: ["Um jogador", "VR Support", "Mercenaries Mode"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-8400", memory: "12 GB RAM", graphics: "GTX 1050 Ti", storage: "60 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-8700", memory: "16 GB RAM", graphics: "RTX 3070", storage: "60 GB SSD" }
    }
  },
  {
    id: "12",
    title: "Minecraft",
    description: "Explore mundos infinitos e construa de tudo, desde as casas mais simples até os maiores castelos.",
    longDescription: "Minecraft é um jogo sobre colocar blocos e aventuras. Explore mundos gerados aleatoriamente e construa coisas incríveis, desde as casas mais simples até os maiores castelos. Jogue no modo criativo com recursos ilimitados ou cave fundo no mundo no modo sobrevivência.",
    price: 119.00,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1672970/header.jpg",
    screenshots: [],
    developer: "Mojang Studios",
    publisher: "Xbox Game Studios",
    releaseDate: "18 de novembro de 2011",
    genres: ["Sandbox", "Sobrevivência", "Aventura"],
    tags: ["Construção", "Multiplayer", "Criativo"],
    rating: 4.8,
    reviewCount: 345678,
    positivePercentage: 92,
    features: ["Um jogador", "Multiplayer", "Cross-play", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i3-3210", memory: "4 GB RAM", graphics: "Intel HD Graphics 4000", storage: "2 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4690", memory: "8 GB RAM", graphics: "GTX 700 Series", storage: "4 GB SSD" }
    }
  },
  {
    id: "13",
    title: "Forza Horizon 5",
    description: "Sua maior aventura Horizon espera! Explore as paisagens vibrantes e em constante evolução do México.",
    longDescription: "Explore as paisagens vibrantes e em constante evolução do México com condução livre ilimitada no maior mundo aberto da série Forza Horizon. Descubra aventuras emocionantes através de centenas de eventos.",
    price: 249.90,
    originalPrice: 299.90,
    discount: 17,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
    screenshots: [],
    developer: "Playground Games",
    publisher: "Xbox Game Studios",
    releaseDate: "9 de novembro de 2021",
    genres: ["Corrida", "Mundo Aberto", "Simulador"],
    tags: ["Carros", "Arcade", "Multiplayer"],
    rating: 4.7,
    reviewCount: 156789,
    positivePercentage: 91,
    features: ["Um jogador", "Multiplayer", "Cross-play", "Ray Tracing"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-4460", memory: "8 GB RAM", graphics: "GTX 970", storage: "110 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-8400", memory: "16 GB RAM", graphics: "RTX 3080", storage: "110 GB SSD" }
    }
  },
  {
    id: "14",
    title: "Horizon Zero Dawn",
    description: "Experimente o lendário RPG de ação que redefiniu o gênero. Torne-se a caçadora Aloy e desvende os mistérios de um mundo dominado por máquinas.",
    longDescription: "Em um futuro pós-apocalíptico onde máquinas dominam a terra, a caçadora Aloy embarca em uma jornada para descobrir os segredos do passado e desvendar os mistérios de seu próprio destino.",
    price: 199.90,
    originalPrice: 249.90,
    discount: 20,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg",
    screenshots: [],
    developer: "Guerrilla",
    publisher: "PlayStation PC LLC",
    releaseDate: "7 de agosto de 2020",
    genres: ["RPG", "Ação", "Mundo Aberto"],
    tags: ["Máquinas", "Pós-Apocalíptico", "Arco e Flecha"],
    rating: 4.5,
    reviewCount: 89123,
    positivePercentage: 86,
    features: ["Um jogador", "New Game+", "Photo Mode"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-2500K", memory: "8 GB RAM", graphics: "GTX 780", storage: "100 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-4770K", memory: "16 GB RAM", graphics: "RTX 2060", storage: "100 GB SSD" }
    }
  },
  {
    id: "15",
    title: "Sekiro: Shadows Die Twice",
    description: "Entre em conflito contra inimigos monstruosos em um mundo sombrio e retorcido. Liberte a vingança do Lobo Solitário.",
    longDescription: "Sekiro: Shadows Die Twice é um RPG de ação da FromSoftware, desenvolvedores de Bloodborne e da série Dark Souls. Carve your own clever path to vengeance in this award-winning adventure.",
    price: 199.90,
    originalPrice: 249.90,
    discount: 20,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg",
    screenshots: [],
    developer: "FromSoftware",
    publisher: "Activision",
    releaseDate: "22 de março de 2019",
    genres: ["Ação", "Aventura", "Souls-like"],
    tags: ["Difícil", "Ninja", "Japão Feudal"],
    rating: 4.7,
    reviewCount: 145678,
    positivePercentage: 89,
    features: ["Um jogador", "GOTY Edition", "Conquistas"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Intel Core i3-2100", memory: "4 GB RAM", graphics: "GTX 760", storage: "25 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-2500K", memory: "8 GB RAM", graphics: "GTX 970", storage: "25 GB SSD" }
    }
  },
  {
    id: "16",
    title: "DOOM Eternal",
    description: "O inferno invadiu a Terra. Torne-se o Doom Slayer e extermine as hordas demoníacas.",
    longDescription: "Rasgue e destrua demônios como o lendário Doom Slayer. DOOM Eternal é a sequência direta do premiado DOOM (2016), trazendo combate ainda mais intenso e brutal.",
    price: 149.90,
    originalPrice: 229.90,
    discount: 35,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg",
    screenshots: [],
    developer: "id Software",
    publisher: "Bethesda Softworks",
    releaseDate: "20 de março de 2020",
    genres: ["FPS", "Ação", "Shooter"],
    tags: ["Gore", "Demônios", "Rápido"],
    rating: 4.8,
    reviewCount: 189234,
    positivePercentage: 93,
    features: ["Um jogador", "Battlemode", "Master Levels"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-6600", memory: "8 GB RAM", graphics: "GTX 1050 Ti", storage: "80 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-6700K", memory: "16 GB RAM", graphics: "RTX 2060", storage: "80 GB SSD" }
    }
  },
  {
    id: "17",
    title: "Hades",
    description: "Desafie o deus dos mortos enquanto luta para sair do Submundo neste roguelike premiado.",
    longDescription: "Hades é um jogo roguelike onde você joga como Zagreus, filho de Hades, tentando escapar do Submundo. Receba ajuda dos Deuses do Olimpo enquanto enfrenta inimigos em combate frenético.",
    price: 46.99,
    originalPrice: 93.99,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
    screenshots: [],
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: "17 de setembro de 2020",
    genres: ["Roguelike", "Ação", "RPG"],
    tags: ["Mitologia Grega", "Indie", "Hack and Slash"],
    rating: 4.9,
    reviewCount: 234567,
    positivePercentage: 98,
    features: ["Um jogador", "Conquistas", "Desbloqueáveis"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Dual Core 2.4 GHz", memory: "4 GB RAM", graphics: "GTX 750 Ti", storage: "20 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4670K", memory: "8 GB RAM", graphics: "GTX 1060", storage: "20 GB SSD" }
    }
  },
  {
    id: "18",
    title: "Hollow Knight",
    description: "Explore cavernas sinuosas, cidades antigas e terras devastadas, lute contra criaturas corrompidas e faça amizade com insetos bizarros.",
    longDescription: "Forje seu próprio caminho em Hollow Knight! Um épico metroidvania de ação-aventura ambientado em um vasto reino de insetos e heróis. Explore profundezas sinuosas, enfrente criaturas corrompidas e desvende antigos mistérios.",
    price: 27.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
    screenshots: [],
    developer: "Team Cherry",
    publisher: "Team Cherry",
    releaseDate: "24 de fevereiro de 2017",
    genres: ["Metroidvania", "Ação", "Indie"],
    tags: ["Difícil", "Atmosférico", "2D"],
    rating: 4.9,
    reviewCount: 312456,
    positivePercentage: 97,
    features: ["Um jogador", "Conquistas", "DLCs Gratuitos"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Intel Core 2 Duo E5200", memory: "4 GB RAM", graphics: "GeForce 9800 GTX", storage: "9 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-2500K", memory: "8 GB RAM", graphics: "GTX 650 Ti", storage: "9 GB SSD" }
    }
  },
  {
    id: "19",
    title: "Monster Hunter: World",
    description: "Entre em um mundo vivo e pulsante, onde você assume o papel de um caçador que abate feras selvagens em batalhas épicas.",
    longDescription: "Bem-vindo a um novo mundo! Assuma o papel de um caçador e abata feras em um ecossistema vivo. Use a paisagem e sua fauna selvagem para sua vantagem enquanto caça monstros maiores e mais ferozes.",
    price: 149.90,
    originalPrice: 199.90,
    discount: 25,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg",
    screenshots: [],
    developer: "CAPCOM",
    publisher: "CAPCOM",
    releaseDate: "9 de agosto de 2018",
    genres: ["Ação", "RPG", "Cooperativo"],
    tags: ["Caça", "Monstros", "Multiplayer"],
    rating: 4.6,
    reviewCount: 198765,
    positivePercentage: 88,
    features: ["Um jogador", "Cooperativo 4 jogadores", "Cross-play"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-4460", memory: "8 GB RAM", graphics: "GTX 760", storage: "48 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-3770", memory: "16 GB RAM", graphics: "GTX 1060", storage: "48 GB SSD" }
    }
  },
  {
    id: "20",
    title: "Death Stranding",
    description: "Uma jornada épica através de uma América fragmentada pela morte. Conecte um mundo destruído e reconstrua a civilização.",
    longDescription: "Do lendário criador de jogos Hideo Kojima vem uma experiência completamente nova. Sam Bridges deve viajar por uma terra devastada e reconectar cidades e pessoas isoladas, enquanto carrega os restos vivos de nosso futuro.",
    price: 159.90,
    originalPrice: 239.90,
    discount: 33,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg",
    screenshots: [],
    developer: "KOJIMA PRODUCTIONS",
    publisher: "505 Games",
    releaseDate: "14 de julho de 2020",
    genres: ["Ação", "Aventura", "Mundo Aberto"],
    tags: ["Walking Simulator", "Sci-Fi", "História Rica"],
    rating: 4.4,
    reviewCount: 78234,
    positivePercentage: 85,
    features: ["Um jogador", "Social Online", "Photo Mode"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-3470", memory: "8 GB RAM", graphics: "GTX 1050 3GB", storage: "80 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-3770", memory: "16 GB RAM", graphics: "RTX 2060", storage: "80 GB SSD" }
    }
  },
  {
    id: "21",
    title: "Disco Elysium",
    description: "Um RPG inovador que reinventa o gênero. Você é um detetive com um sistema de habilidades único.",
    longDescription: "Disco Elysium - The Final Cut é o RPG definitivo. Você é um detetive com um sistema de habilidades único ao seu dispor e um bloco de cidade inteiro para vasculhar. Interrogue personagens inesquecíveis, resolva casos ou aceite subornos.",
    price: 74.99,
    originalPrice: 149.99,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg",
    screenshots: [],
    developer: "ZA/UM",
    publisher: "ZA/UM",
    releaseDate: "15 de outubro de 2019",
    genres: ["RPG", "Aventura", "Detective"],
    tags: ["Narrativo", "Escolhas Importam", "Indie"],
    rating: 4.9,
    reviewCount: 89012,
    positivePercentage: 95,
    features: ["Um jogador", "Final Cut", "Dublado"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Intel Core i5-2400", memory: "4 GB RAM", graphics: "HD 4600", storage: "20 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-4790", memory: "8 GB RAM", graphics: "GTX 1060", storage: "20 GB SSD" }
    }
  },
  {
    id: "22",
    title: "Dark Souls III",
    description: "Como o fogo desaparece e os senhores não voltam a seus tronos, mergulhe na escuridão corajosamente com novas armas e magias.",
    longDescription: "Dark Souls III é a conclusão épica da série que definiu um gênero. As brasas estão desaparecendo e os Senhores do Cinzas se recusam a voltar aos seus tronos. Um guerreiro sem luz surge das cinzas.",
    price: 179.90,
    originalPrice: 249.90,
    discount: 28,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg",
    screenshots: [],
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    releaseDate: "12 de abril de 2016",
    genres: ["Ação", "RPG", "Souls-like"],
    tags: ["Difícil", "Fantasia Sombria", "PvP"],
    rating: 4.8,
    reviewCount: 456123,
    positivePercentage: 94,
    features: ["Um jogador", "PvP", "Cooperativo"],
    systemRequirements: {
      minimum: { os: "Windows 7/8/10", processor: "Intel Core i3-2100", memory: "4 GB RAM", graphics: "GTX 750 Ti", storage: "25 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-3770", memory: "8 GB RAM", graphics: "GTX 970", storage: "25 GB SSD" }
    }
  },
  {
    id: "23",
    title: "Stardew Valley",
    description: "Você herdou a velha fazenda de seu avô em Stardew Valley. Armado com ferramentas e algumas moedas, você parte para começar sua nova vida.",
    longDescription: "Você herdou a velha fazenda de seu avô em Stardew Valley. Armado com ferramentas de segunda mão e algumas moedas, você parte para começar sua nova vida. Plante, crie animais, pesque e interaja com os moradores.",
    price: 24.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
    screenshots: [],
    developer: "ConcernedApe",
    publisher: "ConcernedApe",
    releaseDate: "26 de fevereiro de 2016",
    genres: ["Simulação", "Fazenda", "RPG"],
    tags: ["Relaxante", "Pixel Art", "Cooperativo"],
    rating: 4.9,
    reviewCount: 567890,
    positivePercentage: 98,
    features: ["Um jogador", "Cooperativo 4 jogadores", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows Vista", processor: "2 GHz", memory: "2 GB RAM", graphics: "256 MB Video Memory", storage: "500 MB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-2500K", memory: "4 GB RAM", graphics: "GTX 660", storage: "500 MB SSD" }
    }
  },
  {
    id: "24",
    title: "Terraria",
    description: "Cave, lute, explore, construa! Nada é impossível neste jogo de ação e aventura.",
    longDescription: "Cave, lute, explore, construa! Nada é impossível neste RPG de ação e aventura repleto de ação. O mundo é sua tela e o terreno em si é sua tinta. Agarre suas ferramentas e vá em frente!",
    price: 19.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg",
    screenshots: [],
    developer: "Re-Logic",
    publisher: "Re-Logic",
    releaseDate: "16 de maio de 2011",
    genres: ["Sandbox", "Aventura", "Sobrevivência"],
    tags: ["2D", "Pixel Art", "Crafting"],
    rating: 4.9,
    reviewCount: 987654,
    positivePercentage: 97,
    features: ["Um jogador", "Multiplayer", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows XP", processor: "2.0 GHz", memory: "2.5 GB RAM", graphics: "128 MB Video Memory", storage: "400 MB" },
      recommended: { os: "Windows 10/11", processor: "Dual Core 3.0 GHz", memory: "4 GB RAM", graphics: "512 MB Video Memory", storage: "400 MB SSD" }
    }
  },
  {
    id: "25",
    title: "Among Us",
    description: "Um jogo de trabalho em equipe e traição. Jogue com 4-15 jogadores online ou via WiFi local.",
    longDescription: "Jogue com 4-15 jogadores online ou via WiFi local enquanto você tenta preparar sua nave para a partida, mas cuidado pois um impostor vai tentar sabotar tudo. Complete tarefas, descubra o impostor ou seja o impostor.",
    price: 10.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
    screenshots: [],
    developer: "Innersloth",
    publisher: "Innersloth",
    releaseDate: "16 de novembro de 2018",
    genres: ["Multiplayer", "Social", "Casual"],
    tags: ["Dedução Social", "Indie", "Engraçado"],
    rating: 4.5,
    reviewCount: 789012,
    positivePercentage: 87,
    features: ["Multiplayer", "Cross-play", "Acessibilidade"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "SSE2", memory: "1 GB RAM", graphics: "DirectX 10", storage: "250 MB" },
      recommended: { os: "Windows 10/11", processor: "SSE2", memory: "2 GB RAM", graphics: "DirectX 10", storage: "250 MB SSD" }
    }
  },
  {
    id: "26",
    title: "Apex Legends",
    description: "Domine a competição em um Battle Royale tático onde personagens Lendários com habilidades poderosas se unem.",
    longDescription: "Apex Legends é o premiado Battle Royale gratuito do Respawn Entertainment. Escolha entre uma lista crescente de Lendários poderosos, cada um com habilidades únicas que ajudam sua equipe a vencer.",
    price: 0,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
    screenshots: [],
    developer: "Respawn Entertainment",
    publisher: "Electronic Arts",
    releaseDate: "4 de fevereiro de 2019",
    genres: ["Battle Royale", "FPS", "Ação"],
    tags: ["Free to Play", "Esports", "Squad"],
    rating: 4.3,
    reviewCount: 654321,
    positivePercentage: 82,
    features: ["Multiplayer", "Free to Play", "Cross-play"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i3-6300", memory: "6 GB RAM", graphics: "GTX 640", storage: "75 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-3570K", memory: "8 GB RAM", graphics: "GTX 970", storage: "75 GB SSD" }
    }
  },
  {
    id: "27",
    title: "Dota 2",
    description: "Todos os dias, milhões de jogadores em todo o mundo entram em batalha como um dos mais de cem heróis Dota.",
    longDescription: "Dota 2 é um jogo MOBA competitivo jogado entre duas equipes de cinco jogadores. Cada jogador controla um herói poderoso com habilidades únicas. O objetivo é destruir a estrutura Ancient inimiga.",
    price: 0,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
    screenshots: [],
    developer: "Valve",
    publisher: "Valve",
    releaseDate: "9 de julho de 2013",
    genres: ["MOBA", "Estratégia", "Free to Play"],
    tags: ["Esports", "Competitivo", "Multiplayer"],
    rating: 4.4,
    reviewCount: 1987654,
    positivePercentage: 83,
    features: ["Multiplayer", "Free to Play", "Workshop"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Dual Core 2.8 GHz", memory: "4 GB RAM", graphics: "NVIDIA 8600", storage: "60 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-3470", memory: "8 GB RAM", graphics: "GTX 660", storage: "60 GB SSD" }
    }
  },
  {
    id: "28",
    title: "Valheim",
    description: "Um brutal jogo de exploração e sobrevivência para 1-10 jogadores, ambientado em um limbo gerado proceduralmente inspirado na cultura Viking.",
    longDescription: "Valheim é um brutal jogo de exploração e sobrevivência para 1-10 jogadores, ambientado em um limbo purgatorial inspirado na cultura Viking. Lute para sobreviver, construa bases e derrote os antigos deuses.",
    price: 69.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg",
    screenshots: [],
    developer: "Iron Gate AB",
    publisher: "Coffee Stain Publishing",
    releaseDate: "2 de fevereiro de 2021",
    genres: ["Sobrevivência", "Mundo Aberto", "Cooperativo"],
    tags: ["Viking", "Crafting", "Construção"],
    rating: 4.8,
    reviewCount: 345678,
    positivePercentage: 95,
    features: ["Um jogador", "Cooperativo 10 jogadores", "Servidor Dedicado"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "2.6 GHz Dual Core", memory: "8 GB RAM", graphics: "GTX 950", storage: "1 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-3570K", memory: "16 GB RAM", graphics: "GTX 1060", storage: "1 GB SSD" }
    }
  },
  {
    id: "29",
    title: "Dead by Daylight",
    description: "Sobreviva junto com seus amigos ou domine como o Assassino. Dead by Daylight é um jogo de terror multiplayer assimétrico.",
    longDescription: "Dead by Daylight é um jogo de terror multiplayer (4vs1) onde um jogador assume o papel do Assassino selvagem e os outros 4 jogadores jogam como Sobreviventes, tentando escapar e evitar ser capturados.",
    price: 75.99,
    originalPrice: 94.99,
    discount: 20,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg",
    screenshots: [],
    developer: "Behaviour Interactive",
    publisher: "Behaviour Interactive",
    releaseDate: "14 de junho de 2016",
    genres: ["Terror", "Multiplayer", "Sobrevivência"],
    tags: ["Assimétrico", "Horror", "Online Co-Op"],
    rating: 4.3,
    reviewCount: 543210,
    positivePercentage: 80,
    features: ["Multiplayer", "Crossplay", "DLCs"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i3-4170", memory: "8 GB RAM", graphics: "GTX 460", storage: "50 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-6700", memory: "16 GB RAM", graphics: "GTX 760", storage: "50 GB SSD" }
    }
  },
  {
    id: "30",
    title: "It Takes Two",
    description: "Embarque na aventura mais louca de suas vidas. Jogue como os pais em conflito Cody e May, presos em um mundo fantástico.",
    longDescription: "Embarque na aventura mais louca de suas vidas em It Takes Two! Convide um amigo para uma jornada selvagem onde só uma coisa é certa: vamos aprender a ficar juntos ou morrer tentando.",
    price: 99.90,
    originalPrice: 199.90,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg",
    screenshots: [],
    developer: "Hazelight Studios",
    publisher: "Electronic Arts",
    releaseDate: "26 de março de 2021",
    genres: ["Cooperativo", "Aventura", "Plataforma"],
    tags: ["Local Co-Op", "Couch Co-Op", "História Rica"],
    rating: 4.9,
    reviewCount: 123456,
    positivePercentage: 97,
    features: ["Cooperativo Obrigatório", "Pass de Amigo", "Local Co-Op"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i3-530", memory: "8 GB RAM", graphics: "GTX 660", storage: "50 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-3570K", memory: "16 GB RAM", graphics: "GTX 980", storage: "50 GB SSD" }
    }
  },
  {
    id: "31",
    title: "Celeste",
    description: "Ajude Madeline a sobreviver aos demônios internos em sua jornada até o topo da Montanha Celeste.",
    longDescription: "Ajude Madeline a sobreviver aos demônios internos em sua jornada até o topo da Montanha Celeste, neste super tight platformer dos criadores de TowerFall. Enfrente centenas de desafios feitos à mão.",
    price: 34.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg",
    screenshots: [],
    developer: "Extremely OK Games, Ltd.",
    publisher: "Extremely OK Games, Ltd.",
    releaseDate: "25 de janeiro de 2018",
    genres: ["Plataforma", "Indie", "Precisão"],
    tags: ["Pixel Art", "Difícil", "Speedrun"],
    rating: 4.9,
    reviewCount: 78901,
    positivePercentage: 98,
    features: ["Um jogador", "Assist Mode", "Conquistas"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Intel Core i3-2100", memory: "2 GB RAM", graphics: "Intel HD Graphics 5000", storage: "1.2 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-2500K", memory: "4 GB RAM", graphics: "GTX 750 Ti", storage: "1.2 GB SSD" }
    }
  },
  {
    id: "32",
    title: "Civilization VI",
    description: "Construa um império que resista ao teste do tempo. Pesquise, explore, expanda, explore e conquiste.",
    longDescription: "Civilization VI oferece novas maneiras de interagir com seu mundo, expandir seu império pelo mapa, fazer avançar sua cultura e competir com os maiores líderes da história para construir uma civilização que resistirá ao teste do tempo.",
    price: 149.90,
    originalPrice: 199.90,
    discount: 25,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg",
    screenshots: [],
    developer: "Firaxis Games",
    publisher: "2K",
    releaseDate: "21 de outubro de 2016",
    genres: ["Estratégia", "Turno", "4X"],
    tags: ["História", "Multiplayer", "Mod Support"],
    rating: 4.5,
    reviewCount: 234567,
    positivePercentage: 85,
    features: ["Um jogador", "Multiplayer", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Intel Core i3-2400", memory: "4 GB RAM", graphics: "GTX 460", storage: "12 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4690", memory: "8 GB RAM", graphics: "GTX 770", storage: "12 GB SSD" }
    }
  },
  {
    id: "33",
    title: "Subnautica",
    description: "Desça nas profundezas de um mundo oceânico alienígena repleto de maravilhas e perigos.",
    longDescription: "Desça nas profundezas de um mundo oceânico alienígena repleto de maravilhas e perigos. Colete recursos, construa ferramentas, bases e submersíveis. Descubra a vida selvagem do oceano.",
    price: 69.99,
    originalPrice: 114.99,
    discount: 39,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg",
    screenshots: [],
    developer: "Unknown Worlds Entertainment",
    publisher: "Unknown Worlds Entertainment",
    releaseDate: "23 de janeiro de 2018",
    genres: ["Sobrevivência", "Mundo Aberto", "Aventura"],
    tags: ["Subaquático", "Exploração", "Crafting"],
    rating: 4.8,
    reviewCount: 289012,
    positivePercentage: 95,
    features: ["Um jogador", "VR Support", "Conquistas"],
    systemRequirements: {
      minimum: { os: "Windows Vista", processor: "Intel Haswell", memory: "4 GB RAM", graphics: "Intel HD 4600", storage: "20 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4670K", memory: "8 GB RAM", graphics: "GTX 970", storage: "20 GB SSD" }
    }
  },
  {
    id: "34",
    title: "Satisfactory",
    description: "Satisfactory é um jogo de simulação de fábrica em primeira pessoa de mundo aberto com uma pitada de exploração e combate.",
    longDescription: "Satisfactory é um jogo de simulação de fábrica em primeira pessoa. Você é um engenheiro enviado para um planeta alienígena para construir uma mega-fábrica para uma corporação espacial.",
    price: 149.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg",
    screenshots: [],
    developer: "Coffee Stain Studios",
    publisher: "Coffee Stain Publishing",
    releaseDate: "10 de setembro de 2024",
    genres: ["Simulação", "Automação", "Mundo Aberto"],
    tags: ["Construção", "Base Building", "Multiplayer"],
    rating: 4.8,
    reviewCount: 156789,
    positivePercentage: 96,
    features: ["Um jogador", "Cooperativo 4 jogadores", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-3570K", memory: "8 GB RAM", graphics: "GTX 770", storage: "20 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4670K", memory: "16 GB RAM", graphics: "GTX 1660", storage: "20 GB SSD" }
    }
  },
  {
    id: "35",
    title: "Factorio",
    description: "Construa e mantenha fábricas massivas. Automatize a produção de itens cada vez mais complexos.",
    longDescription: "Factorio é um jogo sobre construir e criar fábricas automatizadas para produzir itens de complexidade crescente, dentro de um mundo aberto infinito. Use sua imaginação para projetar sua fábrica.",
    price: 100.00,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg",
    screenshots: [],
    developer: "Wube Software",
    publisher: "Wube Software",
    releaseDate: "14 de agosto de 2020",
    genres: ["Simulação", "Estratégia", "Automação"],
    tags: ["Base Building", "Crafting", "Multiplayer"],
    rating: 4.9,
    reviewCount: 178234,
    positivePercentage: 98,
    features: ["Um jogador", "Multiplayer", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Dual Core 3.0 GHz", memory: "4 GB RAM", graphics: "512 MB VRAM", storage: "3 GB" },
      recommended: { os: "Windows 10/11", processor: "Quad Core 3.0 GHz", memory: "8 GB RAM", graphics: "2 GB VRAM", storage: "3 GB SSD" }
    }
  },
  {
    id: "36",
    title: "Portal 2",
    description: "A sequência aclamada pela crítica do inovador Portal. Resolva quebra-cabeças com portais e física em primeira pessoa.",
    longDescription: "A sequência aclamada pela crítica do inovador Portal (2007), Portal 2 explora os limites da narrativa e dos quebra-cabeças baseados em física. Descubra novas mecânicas e enfrente câmaras de teste desafiadoras.",
    price: 37.99,
    originalPrice: 75.99,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
    screenshots: [],
    developer: "Valve",
    publisher: "Valve",
    releaseDate: "19 de abril de 2011",
    genres: ["Puzzle", "Primeira Pessoa", "Plataforma"],
    tags: ["Cooperativo", "Ficção Científica", "Humor"],
    rating: 4.9,
    reviewCount: 456789,
    positivePercentage: 99,
    features: ["Um jogador", "Cooperativo 2 jogadores", "Workshop"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "3.0 GHz", memory: "2 GB RAM", graphics: "NVIDIA GeForce 6600", storage: "8 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-2500K", memory: "4 GB RAM", graphics: "GTX 660", storage: "8 GB SSD" }
    }
  },
  {
    id: "37",
    title: "Half-Life: Alyx",
    description: "Half-Life: Alyx é o retorno da Valve à série Half-Life. É um jogo VR completo que apresenta novos personagens.",
    longDescription: "Half-Life: Alyx é o retorno da Valve à série Half-Life. É um jogo VR que ocorre entre os eventos de Half-Life e Half-Life 2. Jogue como Alyx Vance lutando contra a invasão Combine.",
    price: 209.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/546560/header.jpg",
    screenshots: [],
    developer: "Valve",
    publisher: "Valve",
    releaseDate: "23 de março de 2020",
    genres: ["VR", "Ação", "Aventura"],
    tags: ["Realidade Virtual", "FPS", "Horror"],
    rating: 4.9,
    reviewCount: 123456,
    positivePercentage: 98,
    features: ["VR Obrigatório", "Workshop", "Conquistas"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-7500", memory: "12 GB RAM", graphics: "GTX 1060", storage: "67 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-8400", memory: "16 GB RAM", graphics: "RTX 2070", storage: "67 GB SSD" }
    }
  },
  {
    id: "38",
    title: "Left 4 Dead 2",
    description: "Enfrente o apocalipse zumbi cooperativamente. Quatro sobreviventes, hordas de infectados, armas e caos total.",
    longDescription: "Ambientado no apocalipse zumbi, Left 4 Dead 2 (L4D2) é o tão aguardado sequel do premiado Left 4 Dead. Este shooter cooperativo com IA avançada te coloca no meio de hordas de infectados.",
    price: 37.99,
    originalPrice: 75.99,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/550/header.jpg",
    screenshots: [],
    developer: "Valve",
    publisher: "Valve",
    releaseDate: "17 de novembro de 2009",
    genres: ["FPS", "Cooperativo", "Terror"],
    tags: ["Zumbis", "Multiplayer", "Clássico"],
    rating: 4.8,
    reviewCount: 789012,
    positivePercentage: 96,
    features: ["Cooperativo 4 jogadores", "Versus Mode", "Workshop"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Pentium 4 3.0 GHz", memory: "2 GB RAM", graphics: "8600M/9600M", storage: "13 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-2500K", memory: "4 GB RAM", graphics: "GTX 660", storage: "13 GB SSD" }
    }
  },
  {
    id: "39",
    title: "Rust",
    description: "O único objetivo em Rust é sobreviver. Para fazer isso você precisa superar lutas como fome, sede e frio.",
    longDescription: "O único objetivo em Rust é sobreviver. Supere lutas como fome, sede e frio. Construa um abrigo, mate animais para comer, proteja-se de outros jogadores e mate-os por seus recursos.",
    price: 149.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",
    screenshots: [],
    developer: "Facepunch Studios",
    publisher: "Facepunch Studios",
    releaseDate: "8 de fevereiro de 2018",
    genres: ["Sobrevivência", "Multiplayer", "Mundo Aberto"],
    tags: ["PvP", "Base Building", "Crafting"],
    rating: 4.5,
    reviewCount: 654321,
    positivePercentage: 86,
    features: ["Multiplayer", "Servidor Dedicado", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i7-3770", memory: "10 GB RAM", graphics: "GTX 670 2GB", storage: "25 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "AMD Ryzen 5 1600", memory: "16 GB RAM", graphics: "GTX 1080", storage: "25 GB SSD" }
    }
  },
  {
    id: "40",
    title: "ARK: Survival Evolved",
    description: "Preso em uma ilha misteriosa, você deve dominar dinossauros, criar armas, construir abrigos e explorar para sobreviver.",
    longDescription: "Preso em uma ilha misteriosa chamada ARK, você precisa caçar, colher recursos, criar itens, plantar, pesquisar tecnologias e construir abrigos para resistir aos elementos. Use habilidade e astúcia para matar ou domar as criaturas primitivas.",
    price: 54.99,
    originalPrice: 109.99,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/346110/header.jpg",
    screenshots: [],
    developer: "Studio Wildcard",
    publisher: "Studio Wildcard",
    releaseDate: "29 de agosto de 2017",
    genres: ["Sobrevivência", "Mundo Aberto", "Aventura"],
    tags: ["Dinossauros", "Multiplayer", "Base Building"],
    rating: 4.2,
    reviewCount: 567890,
    positivePercentage: 78,
    features: ["Um jogador", "Multiplayer", "Mods"],
    systemRequirements: {
      minimum: { os: "Windows 7/8.1/10", processor: "Intel Core i5-2400", memory: "8 GB RAM", graphics: "GTX 670 2GB", storage: "60 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4670K", memory: "16 GB RAM", graphics: "GTX 1060", storage: "60 GB SSD" }
    }
  },
  {
    id: "41",
    title: "Divinity: Original Sin 2",
    description: "O RPG definitivo com combate baseado em turnos e liberdade total para explorar, experimentar e interagir com um mundo vivo.",
    longDescription: "O RPG definitivo com combate baseado em turnos, um mundo detalhado e liberdade sem precedentes para explorar e experimentar. Jogue sozinho ou em cooperativo com até 3 amigos.",
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/435150/header.jpg",
    screenshots: [],
    developer: "Larian Studios",
    publisher: "Larian Studios",
    releaseDate: "14 de setembro de 2017",
    genres: ["RPG", "Estratégia", "Turno"],
    tags: ["Cooperativo", "Escolhas Importam", "Fantasia"],
    rating: 4.9,
    reviewCount: 178234,
    positivePercentage: 95,
    features: ["Um jogador", "Cooperativo 4 jogadores", "Game Master Mode"],
    systemRequirements: {
      minimum: { os: "Windows 7 SP1", processor: "Intel Core i5-2400", memory: "4 GB RAM", graphics: "GTX 550 Ti", storage: "60 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-4770K", memory: "16 GB RAM", graphics: "GTX 970", storage: "60 GB SSD" }
    }
  },
  {
    id: "42",
    title: "PAYDAY 2",
    description: "PAYDAY 2 é um FPS cooperativo em ação focado em assaltos de 4 jogadores. Equipe-se e faça o maior assalto de todos os tempos.",
    longDescription: "PAYDAY 2 é um FPS cooperativo de ação focado em heists. Junte-se a gangue e execute heists elaborados, desde trabalhos simples de uma loja de conveniência até grandes golpes em bancos.",
    price: 37.99,
    originalPrice: 75.99,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/218620/header.jpg",
    screenshots: [],
    developer: "OVERKILL Software",
    publisher: "Starbreeze Publishing",
    releaseDate: "13 de agosto de 2013",
    genres: ["Ação", "FPS", "Cooperativo"],
    tags: ["Assalto", "Tático", "Multiplayer"],
    rating: 4.6,
    reviewCount: 345678,
    positivePercentage: 91,
    features: ["Um jogador", "Cooperativo 4 jogadores", "Stealth"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Intel Core 2 Duo E8400", memory: "4 GB RAM", graphics: "NVIDIA GeForce 8800", storage: "45 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-2500K", memory: "8 GB RAM", graphics: "GTX 660", storage: "45 GB SSD" }
    }
  },
  {
    id: "43",
    title: "Dying Light 2",
    description: "Sobre uma das últimas grandes cidades humanas, infectados e conflitos ameaçam destruir o pouco que resta.",
    longDescription: "Sobre uma das últimas grandes fortalezas humanas, infectados atormentam as ruas e conflitos entre facções ameaçam destruir o pouco que resta. Suas escolhas mudarão o destino da cidade.",
    price: 199.90,
    originalPrice: 299.90,
    discount: 33,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/534380/header.jpg",
    screenshots: [],
    developer: "Techland",
    publisher: "Techland",
    releaseDate: "4 de fevereiro de 2022",
    genres: ["Ação", "Mundo Aberto", "Zumbi"],
    tags: ["Parkour", "Cooperativo", "Horror"],
    rating: 4.3,
    reviewCount: 145678,
    positivePercentage: 81,
    features: ["Um jogador", "Cooperativo 4 jogadores", "Cross-gen"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i3-9100", memory: "8 GB RAM", graphics: "GTX 1050 Ti", storage: "60 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-8600K", memory: "16 GB RAM", graphics: "RTX 2060", storage: "60 GB SSD" }
    }
  },
  {
    id: "44",
    title: "Cities: Skylines II",
    description: "Crie a cidade dos seus sonhos no mais realista simulador de construção de cidades já feito.",
    longDescription: "Cities: Skylines II é a próxima geração em simulação de cidades. Eleve cada elemento da construção de cidades a um novo patamar de realismo com mapas imensos e sistemas econômicos detalhados.",
    price: 199.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/949230/header.jpg",
    screenshots: [],
    developer: "Colossal Order",
    publisher: "Paradox Interactive",
    releaseDate: "24 de outubro de 2023",
    genres: ["Simulação", "Construção", "Estratégia"],
    tags: ["City Builder", "Sandbox", "Gerenciamento"],
    rating: 3.8,
    reviewCount: 34567,
    positivePercentage: 62,
    features: ["Um jogador", "Mods", "Map Editor"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i7-6700K", memory: "8 GB RAM", graphics: "GTX 970", storage: "60 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-9700K", memory: "16 GB RAM", graphics: "RTX 3080", storage: "60 GB SSD" }
    }
  },
  {
    id: "45",
    title: "The Forest",
    description: "Como único sobrevivente de um acidente de avião, você se encontra em uma floresta misteriosa lutando para sobreviver.",
    longDescription: "Como único sobrevivente de um acidente de avião, você se encontra em uma floresta misteriosa lutando para sobreviver contra uma sociedade de mutantes canibais. Construa, explore, sobreviva.",
    price: 37.99,
    originalPrice: 75.99,
    discount: 50,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/242760/header.jpg",
    screenshots: [],
    developer: "Endnight Games Ltd",
    publisher: "Endnight Games Ltd",
    releaseDate: "30 de abril de 2018",
    genres: ["Sobrevivência", "Terror", "Mundo Aberto"],
    tags: ["Horror", "Crafting", "Multiplayer"],
    rating: 4.7,
    reviewCount: 234567,
    positivePercentage: 93,
    features: ["Um jogador", "Cooperativo", "VR Support"],
    systemRequirements: {
      minimum: { os: "Windows 7", processor: "Intel Core i5-2400", memory: "4 GB RAM", graphics: "GTX 560", storage: "5 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4670K", memory: "8 GB RAM", graphics: "GTX 770", storage: "5 GB SSD" }
    }
  },
  {
    id: "46",
    title: "Sons of the Forest",
    description: "Enviado para encontrar um bilionário desaparecido em uma ilha remota, você se encontra em um pesadelo infestado de canibais.",
    longDescription: "Enviado para encontrar um bilionário desaparecido em uma ilha remota, você se encontra em um pesadelo infestado de canibais. Crie, construa e lute para sobreviver, sozinho ou com amigos.",
    price: 116.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/header.jpg",
    screenshots: [],
    developer: "Endnight Games Ltd",
    publisher: "Newnight",
    releaseDate: "23 de fevereiro de 2023",
    genres: ["Sobrevivência", "Terror", "Mundo Aberto"],
    tags: ["Horror", "Cooperativo", "Crafting"],
    rating: 4.5,
    reviewCount: 178234,
    positivePercentage: 87,
    features: ["Um jogador", "Cooperativo 8 jogadores", "Base Building"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-8400", memory: "12 GB RAM", graphics: "GTX 1060 3GB", storage: "20 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i7-8700K", memory: "16 GB RAM", graphics: "RTX 3070", storage: "20 GB SSD" }
    }
  },
  {
    id: "47",
    title: "Palworld",
    description: "Lute, cultive, construa e trabalhe ao lado de criaturas misteriosas chamadas Pals neste mundo aberto de sobrevivência e crafting.",
    longDescription: "Palworld é um novo jogo de sobrevivência e crafting em mundo aberto onde você pode fazer amizade e coletar criaturas misteriosas chamadas 'Pals'. Construa bases, automatize tarefas e explore.",
    price: 99.90,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
    screenshots: [],
    developer: "Pocketpair",
    publisher: "Pocketpair",
    releaseDate: "19 de janeiro de 2024",
    genres: ["Sobrevivência", "Mundo Aberto", "Crafting"],
    tags: ["Creature Collector", "Multiplayer", "Base Building"],
    rating: 4.6,
    reviewCount: 456789,
    positivePercentage: 88,
    features: ["Um jogador", "Multiplayer 32 jogadores", "Servidor Dedicado"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-3570K", memory: "16 GB RAM", graphics: "GTX 1050", storage: "40 GB SSD" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i9-9900K", memory: "32 GB RAM", graphics: "RTX 2070", storage: "40 GB SSD" }
    }
  },
  {
    id: "48",
    title: "Lethal Company",
    description: "Um jogo de terror cooperativo sobre coletar sucata em luas abandonadas para cumprir cotas de lucro para a Companhia.",
    longDescription: "Lethal Company é um jogo de terror cooperativo onde você e sua equipe devem explorar luas industriais abandonadas para coletar sucata valiosa. Cuidado com os monstros e cumpra a cota da Companhia.",
    price: 19.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg",
    screenshots: [],
    developer: "Zeekerss",
    publisher: "Zeekerss",
    releaseDate: "23 de outubro de 2023",
    genres: ["Terror", "Cooperativo", "Ação"],
    tags: ["Indie", "Multiplayer", "Horror"],
    rating: 4.9,
    reviewCount: 234567,
    positivePercentage: 98,
    features: ["Cooperativo 4 jogadores", "Voice Chat", "Mod Support"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i3-4150", memory: "4 GB RAM", graphics: "GTX 750 Ti", storage: "1 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4670K", memory: "8 GB RAM", graphics: "GTX 1060", storage: "1 GB SSD" }
    }
  },
  {
    id: "49",
    title: "Phasmophobia",
    description: "Phasmophobia é um jogo de terror psicológico cooperativo para 4 jogadores. Caçadores de fantasmas paramormais.",
    longDescription: "Phasmophobia é um jogo de terror psicológico cooperativo para 4 jogadores. Você e sua equipe de caçadores paranormais investigam locais assombrados repletos de atividade fantasmagórica.",
    price: 50.99,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg",
    screenshots: [],
    developer: "Kinetic Games",
    publisher: "Kinetic Games",
    releaseDate: "18 de setembro de 2020",
    genres: ["Terror", "Cooperativo", "Simulação"],
    tags: ["Fantasmas", "VR Support", "Horror Psicológico"],
    rating: 4.7,
    reviewCount: 345678,
    positivePercentage: 94,
    features: ["Cooperativo 4 jogadores", "VR Support", "Voice Recognition"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i5-4590", memory: "8 GB RAM", graphics: "GTX 970", storage: "18 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-10600K", memory: "16 GB RAM", graphics: "RTX 2060", storage: "18 GB SSD" }
    }
  },
  {
    id: "50",
    title: "Sea of Thieves",
    description: "Sea of Thieves oferece a experiência essencial de pirata, desde navegar e lutar até explorar e saquear.",
    longDescription: "Sea of Thieves oferece a experiência essencial de pirata, desde navegar e lutar até explorar e saquear - tudo o que você precisa para viver a vida de pirata e se tornar uma lenda.",
    price: 149.90,
    originalPrice: 199.90,
    discount: 25,
    coverImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg",
    screenshots: [],
    developer: "Rare Ltd",
    publisher: "Xbox Game Studios",
    releaseDate: "3 de junho de 2020",
    genres: ["Aventura", "Ação", "Multiplayer"],
    tags: ["Piratas", "Cooperativo", "Mundo Aberto"],
    rating: 4.5,
    reviewCount: 189234,
    positivePercentage: 87,
    features: ["Multiplayer", "Cross-play", "PvPvE"],
    systemRequirements: {
      minimum: { os: "Windows 10", processor: "Intel Core i3-4170", memory: "8 GB RAM", graphics: "GTX 650", storage: "50 GB" },
      recommended: { os: "Windows 10/11", processor: "Intel Core i5-4690", memory: "16 GB RAM", graphics: "GTX 1080", storage: "50 GB SSD" }
    }
  }
];

export const reviews: Review[] = [
  { id: "r1", gameId: "1", userId: "u1", userName: "GamerPro2024", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GamerPro", rating: "positive", hoursPlayed: 245, content: "Obra-prima absoluta. FromSoftware se superou mais uma vez. O mundo aberto é simplesmente incrível e o combate é o melhor que já joguei.", date: "2024-03-15", helpful: 1234, funny: 56 },
  { id: "r2", gameId: "1", userId: "u2", userName: "CasualPlayer", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casual", rating: "positive", hoursPlayed: 89, content: "Difícil mas recompensador. Cada vitória contra um boss é uma conquista enorme.", date: "2024-03-10", helpful: 456, funny: 12 },
  { id: "r3", gameId: "1", userId: "u3", userName: "SoulsVeteran", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Veteran", rating: "positive", hoursPlayed: 500, content: "Melhor jogo da FromSoftware até agora. O mundo é gigantesco e cheio de segredos.", date: "2024-02-28", helpful: 789, funny: 23 },
  { id: "r4", gameId: "2", userId: "u4", userName: "NightCityRunner", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Night", rating: "positive", hoursPlayed: 156, content: "Depois das atualizações, o jogo está incrível. A história é envolvente e o mundo é lindo.", date: "2024-03-12", helpful: 567, funny: 34 },
  { id: "r5", gameId: "3", userId: "u5", userName: "WesternFan", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Western", rating: "positive", hoursPlayed: 200, content: "A melhor história já contada em um videogame. Arthur Morgan é um personagem inesquecível.", date: "2024-03-08", helpful: 2345, funny: 89 }
];

export const genres = [
  "Todos", "Ação", "Aventura", "RPG", "FPS", "Estratégia", "Simulação", 
  "Terror", "Indie", "Corrida", "Esportes", "Puzzle", "Plataforma", 
  "Mundo Aberto", "Cooperativo", "Multiplayer", "Free to Play"
];

export const sortOptions = [
  { value: "relevance", label: "Relevância" },
  { value: "release-date", label: "Data de Lançamento" },
  { value: "name", label: "Nome" },
  { value: "lowest-price", label: "Menor Preço" },
  { value: "highest-price", label: "Maior Preço" },
  { value: "reviews", label: "Avaliações do Usuário" }
];
