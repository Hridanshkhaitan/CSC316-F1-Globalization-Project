// Data for each F1 race.
window.tracks = [
    {
        id: 1,
        name: 'Las Vegas Grand Prix',
        hostingFee: 0,
        ticketPrice: 1617,
        revenue: '$1.2B',
        funFact: 'Introduced in 2023, the Las Vegas race is contested on a street circuit that spans a portion of the iconic Las Vegas Strip.',
        trackImage: 'https://via.placeholder.com/300?text=Vegas+Track'
    },
    {
        id: 2,
        name: 'Qatar Grand Prix',
        hostingFee: 55,
        ticketPrice: 330,
        revenue: '$900M',
        funFact: 'First held in 2021, the race takes place in Doha on a purpose-built street circuit designed specifically for Formula 1.',
        trackImage: 'https://via.placeholder.com/300?text=Qatar+Track'
    },
    {
        id: 3,
        name: 'Saudi Arabian Grand Prix',
        hostingFee: 55,
        ticketPrice: 391,
        revenue: '$1.0B',
        funFact: 'Debuting in 2021 at the Jeddah Corniche Circuit, this race is one of the fastest street circuits on the calendar, symbolizing F1’s growing presence in the Gulf region.',
        trackImage: 'https://via.placeholder.com/300?text=Saudi+Track'
    },
    {
        id: 4,
        name: 'Monaco Grand Prix',
        hostingFee: 20,
        ticketPrice: 764,
        revenue: '$700M',
        funFact: 'Running since 1929 (in various formats), Monaco remains one of the most prestigious races, drawing a worldwide audience that underscores the sport’s historic glamour and international allure.',
        trackImage: 'https://via.placeholder.com/300?text=Monaco+Track'
    },
    {
        id: 5,
        name: 'Miami Grand Prix',
        hostingFee: 15,
        ticketPrice: 878,
        revenue: '$950M',
        funFact: 'Debuted in 2022, this race on a purpose-built circuit is part of F1’s drive to capture the American audience with modern, urban venues.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 6,
        name: 'Chinese Grand Prix',
        hostingFee: 15,
        ticketPrice: 199,
        revenue: '$950M',
        funFact: ' Held annually at the Shanghai International Circuit from 2004 to 2019, the event played a key role in expanding Formula 1’s presence in Asia before its cancellation due to the COVID-19 pandemic.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 7,
        name: 'Hungarian Grand Prix',
        hostingFee: 40,
        ticketPrice: 207,
        revenue: '$950M',
        funFact: 'Debuted in 1986 at the Hungaroring, it was the first F1 race held behind the Iron Curtain, marking a significant moment in F1’s globalization into Eastern Europe.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 8,
        name: 'Japanese Grand Prix',
        hostingFee: 25,
        ticketPrice: 264,
        revenue: '$950M',
        funFact: 'Held at Suzuka, the circuits figure-eight layout is unique in world motorsport and a testament to Japan’s technical and cultural influence on F1.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 9,
        name: 'Bahrain Grand Prix',
        hostingFee: 52,
        ticketPrice: 265,
        revenue: '$950M',
        funFact: ' Bahrain was the first F1 race in the Middle East and paved the way for further expansion into emerging markets.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 10,
        name: 'Australian Grand Prix',
        hostingFee: 37,
        ticketPrice: 290,
        revenue: '$950M',
        funFact: 'The Australian Grand Prix was held in Adelaide until 1995 and has been hosted at Melbourne\'s Albert Park since 1996, often serving as the season\'s opening round',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 11,
        name: 'Italian Grand Prix',
        hostingFee: 25,
        ticketPrice: 328,
        revenue: '$950M',
        funFact: 'Held at Monza, cars at the Italian Grand Prix have clocked average lap speeds of over 260 km/h, cementing its reputation as the "Temple of Speed" on the F1 calendar.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 12,
        name: 'Canadian Grand Prix',
        hostingFee: 32,
        ticketPrice: 336,
        revenue: '$950M',
        funFact: 'The track’s notorious final chicane earned the nickname “Wall of Champions” after multiple former F1 World Champions—such as Michael Schumacher, Damon Hill, and Jacques Villeneuve—crashed there.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 13,
        name: 'Spanish Grand Prix',
        hostingFee: 25,
        ticketPrice: 365,
        revenue: '$950M',
        funFact: 'Hosted at Circuit de Barcelona-Catalunya, which has been on and off the calendar since 1913, the event has evolved to become a testbed for technological and aerodynamic advancements.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 14,
        name: 'Austrian Grand Prix',
        hostingFee: 25,
        ticketPrice: 365,
        revenue: '$950M',
        funFact: 'Known as the Red Bull Ring since 2014, this home circuit for Red Bull Racing features one of the shortest lap times in F1—often under 70 seconds—making every tiny mistake costly.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 15,
        name: 'Emilia Romgania Grand Prix',
        hostingFee: 21,
        ticketPrice: 367,
        revenue: '$950M',
        funFact: 'Imola is one of the few anti-clockwise circuits on the F1 calendar, making it a uniquely demanding test of drivers’ physical endurance.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 16,
        name: 'Belgium Grand Prix',
        hostingFee: 22,
        ticketPrice: 407,
        revenue: '$950M',
        funFact: 'Running at the historic Spa-Francorchamps since 1950, its legendary Eau Rouge corner and unpredictable weather have made it a perennial favorite among fans worldwide.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 17,
        name: 'Azerbaijan Grand Prix',
        hostingFee: 57,
        ticketPrice: 417,
        revenue: '$950M',
        funFact: 'Introduced in 2017 in Baku, it features one of the longest straight sections in F1 and has repeatedly produced unexpected safety car periods, emphasizing dynamic street-circuit challenges.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 18,
        name: 'Sao Paulo Grand Prix',
        hostingFee: 25,
        ticketPrice: 441,
        revenue: '$950M',
        funFact: 'Held at Interlagos since the 1970s, this race has frequently been the championship decider and remains a symbol of F1’s deep roots and fervor in Latin America.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 19,
        name: 'Dutch Grand Prix',
        hostingFee: 32,
        ticketPrice: 503,
        revenue: '$950M',
        funFact: 'In its modern layout, Zandvoort features a steeply banked Turn 3—up to 18 degrees—creating an unusual high-speed challenge and setting it apart from most other F1 circuits.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 20,
        name: 'Abu Dhabi Grand Prix',
        hostingFee: 42,
        ticketPrice: 526,
        revenue: '$950M',
        funFact: 'Abu Dhabi pays one of the highest hosting fees on the F1 calendar to guarantee its status as the season’s finale, adding premium exclusivity to the twilight race at Yas Marina.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 21,
        name: 'Singapore Grand Prix',
        hostingFee: 35,
        ticketPrice: 557,
        revenue: '$950M',
        funFact: ' Due to the punishing humidity, high temperatures, and tight street layout under floodlights, Singapore is often cited as the most physically demanding Grand Prix—drivers routinely lose up to three kilograms of body weight during the race and undergo special heat-acclimation training.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 22,
        name: 'US Grand Prix',
        hostingFee: 30,
        ticketPrice: 671,
        revenue: '$950M',
        funFact: 'Since 2012 at Circuit of the Americas in Austin, this race has helped F1 build a significant following in North America, contributing to record attendance and viewership numbers.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 23,
        name: 'British Grand Prix',
        hostingFee: 26,
        ticketPrice: 689,
        revenue: '$950M',
        funFact: 'Held at Silverstone since 1950 (the inaugural World Championship season), this race is a cornerstone of F1 heritage and a continual nod to the sport’s British roots.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    },
    {
        id: 24,
        name: 'Mexican Grand Prix',
        hostingFee: 30,
        ticketPrice: 783,
        revenue: '$950M',
        funFact: 'Held at around 2,285 meters above sea level, the thin air at Autódromo Hermanos Rodríguez forces teams to adopt high-downforce setups normally reserved for slower circuits, resulting in a unique aerodynamic paradox on a fast track.',
        trackImage: 'https://via.placeholder.com/300?text=Miami+Track'
    }





];
