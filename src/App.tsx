import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  ArrowRight, 
  Menu, 
  X,
  Heart,
  Shield,
  Clock,
  Award,
  Phone,
  Mail,
  Globe,
  Calendar,
  CheckCircle2,
  Minus,
  Plus,
  Users,
  ChevronDown
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const getPackageDays = (duration: string) => Number.parseInt(duration, 10);

const getEndDate = (startDate: string, duration: string) => {
  if (!startDate) return '';

  const endDate = new Date(`${startDate}T00:00:00`);
  endDate.setDate(endDate.getDate() + getPackageDays(duration));
  return endDate.toISOString().split('T')[0];
};

const splitItineraryEntry = (entry: string) => {
  const match = entry.match(/^(Day \d+[^:]*):\s*(.*)$/);
  return match ? { heading: match[1], details: match[2] } : null;
};

const dayTripDialogImages = [
  '/images/Nairobidaytrip/optimized/20251027_075518.jpg',
  '/images/Nairobidaytrip/optimized/20251027_075906.jpg',
  '/images/Nairobidaytrip/optimized/20251027_080128.jpg',
  '/images/Nairobidaytrip/optimized/20251027_081421.jpg',
  '/images/Nairobidaytrip/optimized/20251027_114949.jpg',
  '/images/Nairobidaytrip/optimized/20251027_125133.jpg',
  '/images/Nairobidaytrip/optimized/20260306_090944.jpg',
  '/images/Nairobidaytrip/optimized/20260306_100841.jpg',
  '/images/Nairobidaytrip/optimized/20260306_124817.jpg',
  '/images/Nairobidaytrip/optimized/IMG-20260114-WA0003.jpg',
  '/images/Nairobidaytrip/optimized/IMG_1298.jpg',
  '/images/Nairobidaytrip/optimized/IMG_1333.jpg',
  '/images/Nairobidaytrip/optimized/IMG_1358.jpg',
  '/images/Nairobidaytrip/optimized/IMG_20260316_171617_724.jpg',
  '/images/Nairobidaytrip/optimized/IMG_20260317_152736_541.jpg',
  '/images/Nairobidaytrip/optimized/IMG_20260317_152745_822.jpg'
];

const packageInclusions = [
  'Airport, hotel or residence pickup and drop-off',
  'Transport in a customized 4x4 Safari Land Cruiser',
  'Services of a professional English-speaking driver-guide',
  'Accommodation as per the itinerary',
  'Meals as specified in the itinerary (Breakfast, Lunch & Dinner)',
  'Park and conservation entry fees',
  'Unlimited game drives as per the itinerary',
  'Bottled drinking water during safari'
];

const packageExclusions = [
  'International flights',
  'Kenya visa fees',
  'Travel insurance (highly recommended)',
  'Optional activities (hot air balloon safari, Maasai village visits, etc.)',
  'Alcoholic and soft drinks unless specified',
  'Personal expenses (laundry, telephone, souvenirs, etc.)',
  'Tips and gratuities for guides and lodge staff',
  'Items of a personal nature',
  'Any meals not mentioned in the itinerary'
];

// Destination data for Kenya - Safari Focused
const destinations = [
  {
    id: 1,
    name: 'Nairobi National Park',
    location: 'Nairobi',
    images: [
      '/images/nairobi%20national%20park/nairobi-national-park-1.jpg',
      '/images/nairobi%20national%20park/nairobi-national-park-2.jpg',
      '/images/nairobi%20national%20park/nairobi-national-park-3.jpg',
      '/images/nairobi%20national%20park/nairobi-national-park-4.jpg'
    ],
    rating: 4.7,
    reviews: 2340,
    category: 'Safari',
    description: 'Wildlife sanctuary in the heart of Kenya\'s capital city',
    fullDescription: "Just a short drive from Kenya's capital city, Nairobi National Park is the only national park in the world located on the doorstep of a major city. Despite its urban setting, the park is home to an incredible variety of wildlife, including lions, rhinos, giraffes, buffaloes, zebras, cheetahs, and over 400 bird species. Its unique skyline backdrop creates one of Africa's most distinctive safari experiences, making it an ideal destination for travelers with limited time or those beginning or ending their Kenyan adventure."
  },
  {
    id: 2,
    name: 'Maasai Mara',
    location: 'Rift Valley',
    images: [
      '/images/Maasai%20mara/maasai-mara-1.jpg',
      '/images/Maasai%20mara/maasai-mara-2.jpeg',
      '/images/Maasai%20mara/maasai-mara-3.jpeg',
      '/images/Maasai%20mara/maasai-mara-4.jpg',
      '/images/Maasai%20mara/maasai-mara-5.jpg'
    ],
    rating: 4.9,
    reviews: 3521,
    category: 'Safari',
    description: 'World-famous wildlife reserve and Great Migration',
    fullDescription: "The Maasai Mara National Reserve is Kenya's most famous safari destination and one of Africa's premier wildlife reserves. Renowned for its vast golden savannahs, abundant wildlife, and exceptional game viewing, the reserve is home to the iconic Big Five, lion, leopard, elephant, buffalo, and black rhino. Between July and October, the Mara hosts the spectacular Great Wildebeest Migration, when over a million wildebeest, zebras, and gazelles cross the Mara River in search of greener pastures. Whether you're a first-time visitor or a seasoned safari enthusiast, the Maasai Mara offers unforgettable wildlife encounters throughout the year."
  },
  {
    id: 3,
    name: 'Amboseli National Park',
    location: 'Rift Valley',
    images: [
      '/images/amboseli/amboseli-1.jpg',
      '/images/amboseli/amboseli-2.jpg',
      '/images/amboseli/amboseli-3.jpg'
    ],
    rating: 4.8,
    reviews: 2934,
    category: 'Safari',
    description: 'Home to large elephant herds with Kilimanjaro views',
    fullDescription: "Amboseli National Park is one of Kenya's most iconic safari destinations, renowned for its large herds of free-ranging elephants and breathtaking views of Mount Kilimanjaro, Africa's highest peak. The park's open plains, seasonal swamps, and acacia woodlands provide excellent opportunities to spot lions, cheetahs, giraffes, zebras, buffaloes, and a wide variety of birdlife. Amboseli is especially popular with photographers thanks to its dramatic scenery and unforgettable elephant encounters set against the snow-capped backdrop of Kilimanjaro."
  },
  {
    id: 4,
    name: 'Lake Nakuru National Park',
    location: 'Rift Valley',
    images: [
      '/images/Lake%20Nakuru/lake-nakuru-1.jpg',
      '/images/Lake%20Nakuru/lake-nakuru-2.jpg',
      '/images/Lake%20Nakuru/lake-nakuru-3.jpg',
      '/images/Lake%20Nakuru/lake-nakuru-4.jpg',
      '/images/Lake%20Nakuru/lake-nakuru-5.jpeg'
    ],
    rating: 4.7,
    reviews: 2156,
    category: 'Safari',
    description: 'Famous for flamingos, rhinos, and diverse birdlife',
    fullDescription: "Lake Nakuru National Park is one of Kenya's most scenic wildlife parks, celebrated for its thriving rhino populations and diverse ecosystems. The park is one of the country's best places to see both black and white rhinos, as well as the endangered Rothschild's giraffe. Although once famous for its vast flocks of flamingos, the lake continues to attract numerous waterbirds alongside pelicans, cormorants, and other species. Lions, leopards, buffaloes, zebras, and baboons are also commonly spotted, making Lake Nakuru a rewarding safari destination rich in wildlife and stunning landscapes."
  },
  {
    id: 5,
    name: 'Lake Naivasha',
    location: 'Rift Valley',
    images: [
      '/images/lake%20naivasha/lake-naivasha-1.jpg',
      '/images/lake%20naivasha/lake-naivasha-2.jpg',
      '/images/lake%20naivasha/lake-naivasha-3.webp'
    ],
    rating: 4.6,
    reviews: 1843,
    category: 'Safari',
    description: 'Freshwater lake with hippos, boat safaris, and Crescent Island',
    fullDescription: "Nestled in the heart of the Great Rift Valley, Lake Naivasha is a beautiful freshwater lake surrounded by lush landscapes and abundant birdlife. The lake is famous for its resident hippos, fish eagles, and over 400 bird species, making it a paradise for birdwatchers and nature lovers. Visitors can enjoy relaxing boat safaris, guided walking tours on Crescent Island, or explore the nearby Hell's Gate National Park on foot or by bicycle. Its peaceful atmosphere and scenic beauty make Lake Naivasha the perfect complement to a classic wildlife safari."
  },
  {
    id: 6,
    name: 'Ol Pejeta Conservancy',
    location: 'Central Kenya',
    images: [
      '/images/olpejeta/olpejeta-1.jpg',
      '/images/olpejeta/olpejeta-2.jpg',
      '/images/olpejeta/olpejeta-3.jpg'
    ],
    rating: 4.8,
    reviews: 1678,
    category: 'Safari',
    description: 'Private conservancy with endangered species and exclusive experiences',
    fullDescription: "Located between the foothills of Mount Kenya and the Aberdare Ranges, Ol Pejeta Conservancy is one of Africa's leading wildlife conservation success stories. The conservancy is home to East Africa's largest population of black rhinos and the world's last two remaining northern white rhinos. It also offers excellent opportunities to see the Big Five, alongside cheetahs, hyenas, giraffes, and numerous plains game. Visitors can also tour the Jane Goodall Institute's Chimpanzee Sanctuary, the only sanctuary for rescued chimpanzees in Kenya. Combining outstanding wildlife viewing with world-class conservation efforts, Ol Pejeta offers a truly meaningful safari experience."
  },
  {
    id: 7,
    name: 'Samburu National Reserve',
    location: 'Northern Kenya',
    images: [
      '/images/samburu/samburu-1.jpg',
      '/images/samburu/samburu-2.jpeg',
      '/images/samburu/samburu-3.jpg',
      '/images/samburu/samburu-4.webp'
    ],
    rating: 4.9,
    reviews: 2245,
    category: 'Safari',
    description: 'Home to unique species like Grevy\'s zebra and reticulated giraffe',
    fullDescription: "Samburu National Reserve is a rugged and remote wilderness in northern Kenya, known for its unique landscapes and rare wildlife species found nowhere else in the country. The reserve is famous for the \"Samburu Special Five\" the Grevy's zebra, reticulated giraffe, Somali ostrich, Beisa oryx, and gerenuk. The life-giving Ewaso Nyiro River attracts elephants, lions, leopards, crocodiles, and numerous bird species throughout the year. Combined with its rich Samburu culture, dramatic scenery, and uncrowded game viewing, Samburu offers an authentic and unforgettable safari experience."
  },
  {
    id: 8,
    name: 'Giraffe Centre',
    location: 'Nairobi',
    images: [
      '/images/giraffe%20centre/giraffe-centre-1.jpg',
      '/images/giraffe%20centre/giraffe-centre-2.jpg',
      '/images/giraffe%20centre/giraffe-centre-3.jpg'
    ],
    rating: 4.7,
    reviews: 1560,
    category: 'Safari',
    description: 'Hand-feed endangered Rothschild giraffes up close in Langata',
    fullDescription: "The Giraffe Centre is one of Nairobi's most popular wildlife attractions and a great destination for visitors of all ages. Established to protect the endangered Rothschild's giraffe, the centre offers a unique opportunity to feed these gentle giants from an elevated platform while learning about giraffe conservation. Visitors can also explore the nature trails and educational exhibits, making it an enjoyable and informative stop before or after a safari."
  },
  {
    id: 9,
    name: 'Sheldrick Wildlife Trust Elephant Orphanage',
    location: 'Nairobi',
    images: [
      '/images/sheldrick/sheldrick-1.jpg',
      '/images/sheldrick/sheldrick-2.jpg',
      '/images/sheldrick/sheldrick-3.jpg',
      '/images/sheldrick/sheldrick-4.jpg'
    ],
    rating: 4.9,
    reviews: 2870,
    category: 'Safari',
    description: 'Watch rescued baby elephants being cared for and fed',
    fullDescription: "The Sheldrick Wildlife Trust Elephant Orphanage is a world-renowned elephant rescue and rehabilitation centre dedicated to saving orphaned elephants and rhinos. During the daily public viewing, visitors can watch young elephants being fed, playing in the mud, and interacting with their keepers while learning about the conservation efforts that prepare them for eventual release back into the wild. A visit to the orphanage offers a heartwarming and inspiring insight into Kenya's commitment to wildlife conservation."
  }
];

// Safari package tiers - each linked to its featured destinations
const packages = [
  {
    id: 1,
    title: 'Gold Package',
    subtitle: 'Samburu, Ol Pejeta, Lake Nakuru, Lake Naivasha & Maasai Mara',
    duration: '9 Days',
    basePrice: 3000,
    image: '/images/image.png',
    highlights: ['Samburu', 'Ol Pejeta', 'Lake Nakuru', 'Lake Naivasha', 'Maasai Mara'],
    destinationIds: [7, 6, 4, 5, 2],
    popular: true,
    overview: "Experience the very best of Kenya on a 9-day safari through diverse landscapes, unique wildlife habitats, and Africa's most iconic parks and conservancies. Discover Samburu's rare wildlife, Ol Pejeta's endangered rhinos, Lake Nakuru's birdlife, Lake Naivasha's tranquil waters, and the world-famous Maasai Mara.",
    itinerary: [
      'Day 1 - Nairobi to Samburu National Reserve: Travel north through Kenya\'s scenic central highlands, crossing the Equator before an afternoon game drive. Look for the Samburu Special Five: Grevy\'s zebra, reticulated giraffe, Somali ostrich, Beisa oryx, and gerenuk, alongside elephants, lions, leopards, and cheetahs.',
      'Day 2 - Samburu National Reserve: Enjoy morning and afternoon game drives around the Ewaso Nyiro River, a lifeline for wildlife. An optional visit to a traditional Samburu village can be arranged.',
      'Day 3 - Samburu to Ol Pejeta Conservancy: Continue to one of Kenya\'s leading conservation areas at the foothills of Mount Kenya. See black rhinos, the world\'s last two northern white rhinos, the Big Five, and optionally the chimpanzee sanctuary.',
      'Day 4 - Ol Pejeta to Lake Nakuru National Park: Journey south through the Great Rift Valley for an afternoon game drive. Lake Nakuru is known for white and black rhinos, Rothschild\'s giraffes, seasonal flamingos, lions, leopards, buffaloes, and waterbirds.',
      'Day 5 - Lake Nakuru to Lake Naivasha: Arrive at the freshwater lake for an afternoon at leisure. Optional experiences include a boat safari, Crescent Island walking safari, birdwatching, or cycling in Hell\'s Gate National Park.',
      'Day 6 - Lake Naivasha to Maasai Mara National Reserve: Travel through the Great Rift Valley to the Maasai Mara for your first afternoon game drive. The reserve is home to the Big Five and hosts the Great Wildebeest Migration from July to October.',
      'Day 7 - Maasai Mara: Spend a full day on morning and afternoon game drives, with the option of a picnic lunch, hot air balloon safari, or visit to a traditional Maasai village.',
      'Day 8 - Maasai Mara: Explore a different area of the Mara ecosystem with your guide, learning about wildlife behaviour, conservation, and the reserve\'s ecology.',
      'Day 9 - Maasai Mara to Nairobi: Depart after breakfast and return to Nairobi through the Great Rift Valley, with drop-off at your hotel or Jomo Kenyatta International Airport.'
    ]
  },
  {
    id: 2,
    title: 'Silver Package',
    subtitle: 'Maasai Mara, Lake Naivasha & Amboseli National Park',
    duration: '7 Days',
    basePrice: 1500,
    image: 'https://images.unsplash.com/photo-1549314829-1f5511dbf079?w=800&q=80',
    highlights: ['Maasai Mara', 'Lake Naivasha', 'Amboseli'],
    destinationIds: [2, 5, 3],
    popular: false,
    overview: "Discover Kenya's most iconic wildlife destinations on this 7-day safari. Journey through the Maasai Mara, relax beside Lake Naivasha, and finish in Amboseli National Park, famous for its large elephant herds and breathtaking views of Mount Kilimanjaro.",
    itinerary: [
      'Day 1 - Nairobi to Maasai Mara National Reserve: Drive through the Great Rift Valley, stopping at a scenic viewpoint before arriving for lunch. Set out on an afternoon game drive across the Mara\'s vast savannahs.',
      'Day 2 - Maasai Mara: Enjoy morning and afternoon game drives in search of the Big Five, cheetahs, hyenas, hippos, crocodiles, wildebeest, gazelles, and abundant birdlife. Optional activities include a sunrise balloon safari or Maasai village visit.',
      'Day 3 - Maasai Mara: Explore different areas of the ecosystem with your safari guide, who will share insights into wildlife behaviour, conservation, and the Mara\'s unique habitats.',
      'Day 4 - Maasai Mara to Lake Naivasha: Travel through the Rift Valley to Lake Naivasha. Optional activities include a boat safari, a Crescent Island walking safari, or cycling and hiking in Hell\'s Gate National Park.',
      'Day 5 - Lake Naivasha to Amboseli National Park: Travel via Nairobi to Amboseli, near the Kenya-Tanzania border. Enjoy an afternoon game drive with views of elephant herds beneath Mount Kilimanjaro.',
      'Day 6 - Amboseli National Park: Spend the day exploring open plains, swamps, and acacia woodlands. Amboseli offers close elephant encounters, diverse wildlife, and clear-morning views of Kilimanjaro.',
      'Day 7 - Amboseli to Nairobi: Take a final early game drive or breakfast at the lodge before returning to Nairobi for hotel or airport drop-off.'
    ]
  },
  {
    id: 3,
    title: 'Bronze Package',
    subtitle: 'Maasai Mara National Reserve',
    duration: '4 Days',
    basePrice: 1000,
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80',
    highlights: ['Great Rift Valley', 'Maasai Mara', 'Big Five Game Drives'],
    destinationIds: [2],
    popular: false,
    overview: "Experience the magic of Kenya's most celebrated wildlife destination on this 4-day Maasai Mara safari. Explore its vast golden plains, rich wildlife, Big Five sightings, and the spectacular Great Wildebeest Migration during season.",
    itinerary: [
      'Day 1 - Nairobi to Maasai Mara National Reserve: Journey through the Great Rift Valley, stopping at a scenic viewpoint before arriving for lunch. Take your first afternoon game drive in search of lions, elephants, buffaloes, giraffes, zebras, and antelopes.',
      'Day 2 - Maasai Mara: Spend a full day on morning and afternoon game drives. Search for the Big Five, cheetahs, hyenas, hippos, crocodiles, jackals, wildebeest, gazelles, and abundant birdlife. Optional activities include a sunrise balloon safari or a Maasai village visit.',
      'Day 3 - Maasai Mara: Discover new areas of the ecosystem with an experienced guide. Track predators, watch grazing herds, and learn about the reserve\'s ecology and wildlife behaviours.',
      'Day 4 - Maasai Mara to Nairobi: Leave after breakfast for a scenic return through the Great Rift Valley, with time for photographs and refreshments before hotel or airport drop-off in Nairobi.'
    ]
  },
  {
    id: 4,
    title: 'Day Package',
    subtitle: "Nairobi National Park, Sheldrick's Elephant Orphanage & Giraffe Centre",
    duration: '1 Day',
    basePrice: 300,
    image: 'https://images.unsplash.com/photo-1759483412971-1a77a7188ac5?w=800&q=80',
    highlights: ['Giraffe Center'],
    destinationIds: [1, 8, 9],
    popular: false,
    overview: "A perfect one-day introduction to Kenya's wildlife, combining a dawn game drive in Nairobi National Park with unforgettable close encounters at the Sheldrick Elephant Orphanage and the Giraffe Centre.",
    itinerary: [
      "Your day begins with an early morning pickup at around 6:00 AM from your hotel or residence in Nairobi. This is the ideal time for a safari, as wildlife, especially predators, are most active in the early hours. Enjoy a game drive in Nairobi National Park, where your experienced driver-guide will help you spot a variety of animals against the unique backdrop of the city skyline.",
      "Mid-morning, you'll visit the David Sheldrick Wildlife Trust Elephant Orphanage, where rescued baby elephants are cared for before being reintroduced to the wild. Public viewing runs from 11:00 AM to 12:00 PM, giving you a special opportunity to watch the elephants being fed and learn about their conservation story.",
      "Next, continue to the Giraffe Centre to learn about the endangered Rothschild's giraffe, with a unique up-close experience feeding them and taking photos. From the centre, you may also catch a glimpse of the famous Giraffe Manor. Afterwards, there's an optional stop at a local souvenir shop for authentic Kenyan crafts and gifts.",
      "Later, stop for lunch at the Carnivore Restaurant before returning to your hotel or residence, marking the end of this memorable Nairobi wildlife experience."
    ]
  }
];

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your safety is our priority with verified partners'
  },
  {
    icon: Award,
    title: 'Best Prices',
    description: 'Competitive pricing with no hidden charges'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round the clock customer support for all travelers'
  },
  {
    icon: Heart,
    title: 'Personalized',
    description: 'Custom itineraries tailored to your preferences'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mwangi',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    text: 'The Maasai Mara safari with K.Dan Safaris was absolutely incredible! We witnessed the Great Migration and saw all of the Big Five. Everything was perfectly organized.'
  },
  {
    id: 2,
    name: 'James Ochieng',
    location: 'Mombasa',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    text: 'Our Amboseli safari exceeded all expectations. The elephant herds against the backdrop of Kilimanjaro were breathtaking. Highly recommend K.Dan Safaris!'
  },
  {
    id: 3,
    name: 'Grace Kimani',
    location: 'Kisumu',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    text: 'The Samburu safari was magical! We saw rare species we\'d never seen before. The guides were incredibly knowledgeable and the lodges were luxurious.'
  }
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>({});
  const [packageFilter, setPackageFilter] = useState<{ packageId: number; title: string; destinationIds: number[] } | null>(null);
  const [expandedPackageId, setExpandedPackageId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ [key: number]: string }>({});
  const [dateConfirmed, setDateConfirmed] = useState<{ [key: number]: boolean }>({});
  const [travellers, setTravellers] = useState<{ [key: number]: { adults: number; children: number } }>({});
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isInclusionsExclusionsOpen, setIsInclusionsExclusionsOpen] = useState(false);
  const [expandedDestinationId, setExpandedDestinationId] = useState<number | null>(null);
  const [dayTripDialogImageIndex, setDayTripDialogImageIndex] = useState(0);
  const [areDayTripImagesReady, setAreDayTripImagesReady] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle through destination images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes(prev => {
        const newIndexes = { ...prev };
        destinations.forEach(dest => {
          const currentIndex = newIndexes[dest.id] || 0;
          newIndexes[dest.id] = (currentIndex + 1) % dest.images.length;
        });
        return newIndexes;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    // Wait for the browser to fully decode each bitmap, not just download the bytes,
    // so slower devices don't stall mid-crossfade on the first few rotations.
    const preloadImages = dayTripDialogImages.map((source) => {
      const image = new Image();
      image.src = source;
      return (image.decode ? image.decode() : Promise.resolve()).catch(() => new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      }));
    });

    Promise.all(preloadImages).then(() => {
      if (!isCancelled) setAreDayTripImagesReady(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (expandedPackageId !== 4 || !areDayTripImagesReady) return;

    const interval = window.setInterval(() => {
      setDayTripDialogImageIndex(previous => (previous + 1) % dayTripDialogImages.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [expandedPackageId, areDayTripImagesReady]);

  const filteredDestinations = packageFilter
    ? destinations.filter(d => packageFilter.destinationIds.includes(d.id))
    : activeCategory === 'All'
      ? destinations
      : destinations.filter(d => d.category === activeCategory);

  const categories = ['All', 'Safari'];

  const viewPackageDestinations = (pkg: typeof packages[number]) => {
    setPackageFilter({ packageId: pkg.id, title: pkg.title, destinationIds: pkg.destinationIds });
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openPackageDetails = (pkg: typeof packages[number]) => {
    setExpandedPackageId(pkg.id);
    setIsItineraryOpen(false);
    setIsInclusionsExclusionsOpen(false);
    if (pkg.id === 4) setDayTripDialogImageIndex(0);
  };

  const closePackageDetails = () => {
    setExpandedPackageId(null);
  };

  const handleDateChange = (packageId: number, value: string) => {
    setSelectedDates(prev => ({ ...prev, [packageId]: value }));
    setDateConfirmed(prev => ({ ...prev, [packageId]: false }));
  };

  const confirmPackageDate = (packageId: number) => {
    if (selectedDates[packageId]) {
      setDateConfirmed(prev => ({ ...prev, [packageId]: true }));
    }
  };

  const updateTravellerCount = (packageId: number, type: 'adults' | 'children', change: number) => {
    setTravellers(prev => {
      const current = prev[packageId] || { adults: 2, children: 0 };
      const minimum = type === 'adults' ? 2 : 0;
      return {
        ...prev,
        [packageId]: {
          ...current,
          [type]: Math.max(minimum, current[type] + change)
        }
      };
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    // Wait for the mobile menu collapse animation to finish before scrolling,
    // otherwise the layout shift in portrait mode can cause the scroll to land in the wrong spot.
    window.setTimeout(() => scrollToSection(sectionId), 320);
  };

  const navItems = [
    { label: 'Home', sectionId: 'home' },
    { label: 'Packages', sectionId: 'packages' },
    { label: 'Destinations', sectionId: 'destinations' },
    { label: 'About', sectionId: 'about' },
    { label: 'Contact', sectionId: 'contact' }
  ];

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${
          scrolled ? 'bg-white/25 shadow-lg' : 'bg-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                K.Dan<span className="text-emerald-500"> Safaris</span>
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className={`hidden md:flex items-center space-x-1 rounded-full backdrop-blur-md border px-2 py-1.5 ${
              scrolled ? 'bg-white/30 border-white/40' : 'bg-white/10 border-white/20'
            }`}>
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={`#${item.sectionId}`}
                  onClick={(e) => handleSmoothScroll(e, item.sectionId)}
                  className={`font-medium px-4 py-2 rounded-full transition-colors ${
                    scrolled ? 'text-gray-700 hover:bg-white/60 hover:text-emerald-600' : 'text-white/90 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-600/80 hover:bg-emerald-600 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Inquire Now
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${
                scrolled ? 'bg-white/30 border-white/40' : 'bg-white/10 border-white/20'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`w-5 h-5 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-5 h-5 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/30 backdrop-blur-xl border-t border-white/40"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={`#${item.sectionId}`}
                    onClick={(e) => handleMobileNavClick(e, item.sectionId)}
                    className="block text-gray-700 hover:text-emerald-600 font-medium py-2"
                  >
                    {item.label}
                  </a>
                ))}
                <button className="w-full bg-emerald-600 text-white px-6 py-3 rounded-full font-medium">
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-dvh flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/Heroimage .jpg"
            alt="Leopard walking along an acacia tree branch on safari"
            className="w-full h-full object-cover object-[center_58%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -left-16 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                🇪 Discover the Magic of Kenya
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Experience Kenya's
              <br />
              <span className="text-emerald-400">Natural Beauty</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
            >
              From serene lakes to breathtaking safaris, embark on unforgettable journeys across the heart of Africa
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-3 bg-white/80 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="text-center mb-16">
              <motion.span 
                variants={fadeInUp}
                className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              >
                Why Choose Us
              </motion.span>
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                Experience the Difference
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                We're committed to making your Kenyan safari unforgettable
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Packages Section */}
      <section id="packages" className="py-20 bg-gradient-to-b from-slate-50 to-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="text-center mb-16">
              <motion.span 
                variants={fadeInUp}
                className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              >
                Special Offers
              </motion.span>
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                Safari Package Deals
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Carefully curated safari experiences that showcase Kenya's incredible wildlife
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => openPackageDetails(pkg)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {pkg.popular && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Popular
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-6 flex-grow">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-600 font-semibold mb-1">
                          {pkg.id === 4 ? 'Day Trip' : pkg.title}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">{pkg.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">${pkg.basePrice.toLocaleString()}</p>
                        <p className="text-[11px] text-gray-500">Per person</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                      {pkg.id === 4
                        ? pkg.subtitle || pkg.highlights.join(' · ')
                        : `${pkg.duration} including ${pkg.subtitle || pkg.highlights.join(' · ')}`}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => { e.stopPropagation(); openPackageDetails(pkg); }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 mt-auto"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <motion.span 
                  variants={fadeInLeft}
                  className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
                >
                  Explore Kenya
                </motion.span>
                <motion.h2 
                  variants={fadeInLeft}
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                >
                  Top Destinations
                </motion.h2>
                <motion.p 
                  variants={fadeInLeft}
                  className="text-xl text-gray-600 max-w-2xl"
                >
                  Discover breathtaking locations across Kenya
                </motion.p>
              </div>

              {/* Category Filter */}
              <motion.div 
                variants={fadeInRight}
                className="flex flex-wrap gap-2 mt-6 md:mt-0"
              >
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setActiveCategory(category); setPackageFilter(null); }}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {packageFilter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 mb-8"
              >
                <p className="text-emerald-800 font-medium">
                  Showing top destinations for the <span className="font-bold">{packageFilter.title}</span>
                </p>
                <button
                  onClick={() => setPackageFilter(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold text-sm underline"
                >
                  Clear
                </button>
              </motion.div>
            )}

            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredDestinations.map((destination) => (
                  <motion.div
                    key={destination.id}
                    id={`destination-${destination.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -10 }}
                    className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 scroll-mt-24 ${
                      expandedDestinationId === destination.id ? 'z-30' : 'z-0'
                    }`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <AnimatePresence mode="sync">
                        <motion.img
                          key={imageIndexes[destination.id] || 0}
                          src={destination.images[imageIndexes[destination.id] || 0]}
                          alt={destination.name}
                          initial={{ opacity: 0, scale: 1.08 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: 'easeInOut' }}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </AnimatePresence>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {destination.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{destination.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{destination.name}</h3>
                      <p className="text-gray-600 mb-4">{destination.description}</p>
                      <div className="flex items-center justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setExpandedDestinationId(prev => prev === destination.id ? null : destination.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                        >
                          <span>{expandedDestinationId === destination.id ? 'Show Less' : 'Read More'}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedDestinationId === destination.id ? 'rotate-180' : ''}`} />
                        </motion.button>
                      </div>
                      <AnimatePresence initial={false}>
                        {expandedDestinationId === destination.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="absolute top-full left-0 right-0 z-20 overflow-hidden rounded-b-2xl bg-white px-6 pb-6 shadow-lg"
                          >
                            <p className="text-gray-600 leading-relaxed pt-4 border-t border-gray-100">
                              {destination.fullDescription}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="text-center mb-16">
              <motion.span 
                variants={fadeInUp}
                className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
              >
                Testimonials
              </motion.span>
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                What Our Travelers Say
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-white/80 max-w-2xl mx-auto"
              >
                Real experiences from real travelers who explored Kenya with us
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-white/70 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-bold">
                  K.Dan<span className="text-emerald-500"> Safaris</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Your trusted partner for unforgettable Kenyan travel experiences. Discover the magic of Africa with us.
              </p>
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((_, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['About Us', 'Our Packages', 'Destinations', 'Blog', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <span>Nairobi, Kenya</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  <span>+254 700 000 000</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  <span>info@dansafaris.co.ke</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe for exclusive deals and travel tips</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-3 focus:outline-none focus:border-emerald-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-r-lg font-medium transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 K.Dan Safaris. All rights reserved. Made with ❤️ in Kenya</p>
          </div>
        </div>
      </footer>

      {/* Package Details Modal */}
      <AnimatePresence>
        {expandedPackageId && (() => {
          const pkg = packages.find(p => p.id === expandedPackageId);
          if (!pkg) return null;
          const selectedDate = selectedDates[pkg.id] || '';
          const isConfirmed = dateConfirmed[pkg.id];
          const today = new Date().toISOString().split('T')[0];
          const packageDays = getPackageDays(pkg.duration);
          const isDayTrip = packageDays === 1;
          const endDate = getEndDate(selectedDate, pkg.duration);
          const packageTravellers = travellers[pkg.id] || { adults: 2, children: 0 };
          const totalTravellers = packageTravellers.adults + packageTravellers.children;
          const totalPrice = pkg.basePrice * totalTravellers;
          const dialogImage = isDayTrip ? dayTripDialogImages[dayTripDialogImageIndex] : pkg.image;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePackageDetails}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="scrollbar-hidden relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
              >
                <div className="relative h-64 sm:h-72 overflow-hidden rounded-t-3xl">
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={dialogImage}
                      src={dialogImage}
                      alt={pkg.title}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <button
                    onClick={closePackageDetails}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-800" />
                  </button>
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 font-semibold mb-1">
                      {pkg.duration}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold">{pkg.title}</h3>
                    {pkg.subtitle && <p className="text-white/80 text-sm mt-1">{pkg.subtitle}</p>}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${pkg.basePrice.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ person</span>
                      </p>
                    </div>
                    <button
                      onClick={() => { viewPackageDestinations(pkg); closePackageDetails(); }}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm underline underline-offset-2"
                    >
                      See featured destinations
                    </button>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Overview</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {pkg.overview || 'Full itinerary details for this package are coming soon. In the meantime, here\'s what\'s included:'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {pkg.highlights.map((h) => (
                        <span key={h} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {pkg.itinerary && (
                    <div className="border-t border-gray-100 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsItineraryOpen(!isItineraryOpen)}
                        aria-expanded={isItineraryOpen}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="text-lg font-bold text-gray-900">Package Itinerary</span>
                        <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${isItineraryOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isItineraryOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 pt-4">
                              {pkg.itinerary.map((paragraph, idx) => {
                                const entry = splitItineraryEntry(paragraph);

                                return (
                                  <p key={idx} className="text-gray-600 leading-relaxed text-base">
                                    {entry ? (
                                      <>
                                        <strong className="font-bold text-gray-900">{entry.heading}:</strong>{' '}
                                        {entry.details}
                                      </>
                                    ) : paragraph}
                                  </p>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {!isDayTrip && (
                    <div className="border-t border-gray-100 pt-5">
                      <button
                        type="button"
                        onClick={() => setIsInclusionsExclusionsOpen(!isInclusionsExclusionsOpen)}
                        aria-expanded={isInclusionsExclusionsOpen}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="text-lg font-bold text-gray-900">Inclusions & Exclusions</span>
                        <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${isInclusionsExclusionsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isInclusionsExclusionsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                              <div className="rounded-lg bg-emerald-50/70 p-4">
                                <h5 className="font-bold text-emerald-900 mb-3">Inclusions</h5>
                                <ul className="space-y-2.5">
                                  {packageInclusions.map((item) => (
                                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-emerald-950">
                                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="rounded-lg bg-rose-50/70 p-4">
                                <h5 className="font-bold text-rose-900 mb-3">Exclusions</h5>
                                <ul className="space-y-2.5">
                                  {packageExclusions.map((item) => (
                                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-rose-950">
                                      <X className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      {isDayTrip ? 'Select Your Preferred Date' : 'Select Your Travel Dates'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="text-sm font-medium text-gray-700">
                        Start date
                        <input
                          type="date"
                          min={today}
                          value={selectedDate}
                          onChange={(e) => handleDateChange(pkg.id, e.target.value)}
                          className="w-full mt-1.5 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </label>
                      {!isDayTrip && (
                        <label className="text-sm font-medium text-gray-700">
                          End date
                          <input
                            type="date"
                            value={endDate}
                            readOnly
                            className="w-full mt-1.5 border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-600 cursor-not-allowed"
                          />
                        </label>
                      )}
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        Travellers
                      </h4>
                      <div className="space-y-3">
                        {(['adults', 'children'] as const).map((type) => (
                          <div key={type} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{type === 'adults' ? 'Adults' : 'Children (12 and below)'}</p>
                              <p className="text-xs text-gray-500">${pkg.basePrice.toLocaleString()} per person</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                aria-label={`Remove ${type === 'adults' ? 'adult' : 'child'}`}
                                onClick={() => updateTravellerCount(pkg.id, type, -1)}
                                disabled={packageTravellers[type] === (type === 'adults' ? 2 : 0)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-600 hover:text-emerald-600"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-5 text-center font-semibold text-gray-900">{packageTravellers[type]}</span>
                              <button
                                type="button"
                                aria-label={`Add ${type === 'adults' ? 'adult' : 'child'}`}
                                onClick={() => updateTravellerCount(pkg.id, type, 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-emerald-600 hover:text-emerald-600"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-4 mt-6">
                      <div>
                        <p className="text-sm text-emerald-800">{totalTravellers} traveller{totalTravellers === 1 ? '' : 's'}</p>
                        <p className="text-2xl font-bold text-emerald-900">${totalPrice.toLocaleString()}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!selectedDate}
                        onClick={() => confirmPackageDate(pkg.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                      >
                        Confirm Date
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {isConfirmed && selectedDate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3 mt-3 overflow-hidden"
                        >
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            You're set for{' '}
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}. We'll follow up to confirm availability.
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

export default App;
