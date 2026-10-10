import type { Block, Page } from '../types/blocks';

const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const publicMapEmbedUrl = process.env.PUBLIC_GOOGLE_MAPS_EMBED_URL
  ?? astroEnv?.PUBLIC_GOOGLE_MAPS_EMBED_URL
  ?? 'https://www.google.com/maps?q=Ul.%20kralja%20Zvonimira%2046%2C%2021210%2C%20Solin&output=embed';

const image = (name: string, alt: string) => ({
  src: `/legacy-assets/${name}`,
  alt
});

export const navBlock: Block = {
  type: 'site_nav',
  logo: image('novilogowhite.png', 'Konoba Pizzeria River logo'),
  items: [
    { label: 'Home', href: '/' },
    { label: 'Wine', href: '/vine' },
    { label: 'Drinks', href: '/drinks' },
    { label: 'Pizza', href: '/pizza' }
  ],
  cta: { label: 'Call', href: 'tel:+38521260081' }
};

export const footerBlock: Block = {
  type: 'site_footer',
  logo: image('novilogowhite.png', 'Konoba Pizzeria River logo'),
  address: 'Ul. kralja Zvonimira 46, 21210, Solin',
  phone: '+385 021 260 081',
  email: 'antetopic355@gmail.com',
  hours: [
    { label: 'Mon - Fri', value: '10:00 - 24:00' },
    { label: 'Sat', value: '10:00 - 24:00' },
    { label: 'Sun', value: '10:00 - 24:00' }
  ],
  socialLinks: [
    { label: 'Facebook', href: 'https://www.facebook.com/p/Konoba-Pizzeria-River-100054423162174/' },
    { label: 'Instagram', href: 'https://www.instagram.com/river_pizzeria_restoran/' },
    { label: 'Tripadvisor', href: 'https://www.tripadvisor.com/Restaurant_Review-g1203167-d3410911-Reviews-Konoba_Pizzeria_River-Solin_Split_Dalmatia_County_Dalmatia.html' },
    { label: 'Email', href: 'mailto:antetopic355@gmail.com' }
  ],
  supportLogos: [
    image('esif.jpg', 'ESIF support logo'),
    image('eu.jpg', 'European Union support logo'),
    image('hamag.jpg', 'HAMAG support logo')
  ]
};

export const pages: Page[] = [
  {
    slug: 'home',
    title: 'Konoba Pizzeria River',
    seo: {
      title: 'Konoba Pizzeria River | Solin',
      description: 'Konoba Pizzeria River in Solin: pizza, drinks, wines, and Dalmatian hospitality.'
    },
    blocks: [
      navBlock,
      {
        type: 'home_hero',
        eyebrow: 'Welcome to Our Restaurant',
        title: 'Konoba-pizzeria River',
        body: 'Mediterenian food',
        slides: [
          image('interior.jpeg', 'River restaurant interior'),
          image('exterior.jpeg', 'River restaurant exterior')
        ],
        primaryCta: { label: 'View pizza', href: '/pizza' },
        secondaryCta: { label: 'Call us', href: 'tel:+38521260081' }
      },
      {
        type: 'category_recap',
        heading: 'Menus',
        items: [
          { title: 'APPETIZERS', body: '', href: '/menu', image: image('appetizers.png', 'Appetizers icon') },
          { title: 'MAIN MEALS', body: '', href: '/menu', image: image('burgersvg.svg', 'Main meals icon') },
          { title: 'DESERTS', body: '', href: '/menu', image: image('deserts.png', 'Desserts icon') },
          { title: 'DRINKS', body: '', href: '/drinks', image: image('drinks.png', 'Drinks icon') }
        ]
      },
      {
        type: 'info_cards',
        heading: 'Restaurant Info',
        cards: [
          { title: 'Working Hours', text: 'Mon - Sun: 10:00 - 24:00', href: 'tel:+385 021 260 081', label: 'CONTACT US' },
          { title: 'Need a table?', text: '+385 021 260 081', href: 'tel:+385 021 260 081', label: 'BOOK A TABLE' }
        ]
      },
      {
        type: 'contact_location',
        icon: image('pin.svg', 'Location pin icon'),
        heading: 'OUR LOCATION',
        body: 'River is located at Ul. kralja Zvonimira 46, 21210, Solin.',
        address: 'Ul. kralja Zvonimira 46, 21210, Solin',
        phone: '+385 021 260 081',
        email: 'antetopic355@gmail.com',
        ctas: [
          { label: 'GOOGLE MAPS', href: 'https://www.google.com/maps/place/River+Pizzeria+Konoba/@43.5357525,16.4867657,17z/data=!3m1!4b1!4m6!3m5!1s0x13355f00736d972f:0x289bc0cd2af01b9b!8m2!3d43.5357525!4d16.489346!16s%2Fg%2F11b7q555_6?entry=ttu' }
        ]
      },
      {
        type: 'story',
        eyebrow: 'Discover',
        heading: 'OUR STORY',
        body: 'Nestled in the picturesque small town of Solin, near the vibrant city of Split, a hidden gem awaits along the serene banks of River Jadro. This charming restaurant, simply known as "River" holds the key to an unforgettable culinary experience. With a dedication to Mediterranean cuisine, every dish is carefully prepared using the freshest ingredients sourced from local farmers and markets ensuring an authentic taste of the region.',
        images: [
          image('oven.jpeg', 'River pizza oven'),
          image('oven2.jpeg', 'River pizza oven')
        ]
      },
      {
        type: 'section_heading',
        eyebrow: 'Our',
        heading: 'Dishes'
      },
      {
        type: 'gallery',
        heading: 'Gallery',
        images: [
          image('food2.jpeg', 'River dish 1'),
          image('food3.jpeg', 'River dish 2'),
          image('food8.jpeg', 'River dish 3'),
          image('food5.jpeg', 'River dish 4'),
          image('food9.jpeg', 'River dish 5'),
          image('pizza.jpeg', 'River pizza')
        ]
      },
      {
        type: 'map',
        title: 'Find River',
        address: 'Ul. kralja Zvonimira 46, 21210, Solin',
        embedUrl: publicMapEmbedUrl
      },
      footerBlock
    ]
  }
];

export const fixtureSlugs = pages.map((page) => page.slug);

export function getFixturePage(slug: string): Page {
  const normalized = slug === '' || slug === '/' ? 'home' : slug.replace(/^\/+|\/+$/g, '');
  const page = pages.find((candidate) => candidate.slug === normalized);
  if (!page) {
    throw new Error(`No River fixture page found for slug "${slug}".`);
  }
  return page;
}
