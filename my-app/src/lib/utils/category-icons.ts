// src/lib/utils/category-icons.ts
import type { SvelteComponent } from 'svelte';
import {
    Shirt,
    Home,
    Wrench,
    Laptop,
    Tent,
    Sofa,
    Scissors,
    UtensilsCrossed,
    // Subcategory icons
    Footprints,
    JacketIcon,
    ShirtIcon,
    Pants,
    Underwear,
    Watch,
    BackpackIcon,
    ChefHat,
    Refrigerator,
    UtensilsCrossed as KitchenUtensils,
    Wine,
    Package,
    Trash2,
    Bed,
    HandIcon,
    Drill,
    Trees,
    ToolboxIcon,
    Screwdriver,
    Ruler,
    Monitor,
    Smartphone,
    Headphones,
    Camera,
    Tv,
    Watch as SmartWatch,
    Tent as CampingTent,
    Mountain,
    Bike,
    Dumbbell,
    SofaIcon,
    FlameKindling,
    Armchair,
    Table,
    BedDouble,
    BoxIcon,
    Lamp,
    Razor,
    Scissors as HairScissors,
    Tooth,
    SprayCanIcon,
    VacuumCleaner,
    Sock,
    Hat,
    Knife,
    Clock
} from 'lucide-svelte';

export interface CategoryIcon {
    icon: new (...args: any[]) => SvelteComponent;
    color: string;
}

export const mainCategoryIcons = {
    'Clothing': { icon: Shirt, color: 'text-gray-500' },
    'Kitchen & Home': { icon: Home, color: 'text-gray-500' },
    'Tools & Hardware': { icon: Wrench, color: 'text-gray-500' },
    'Electronics': { icon: Laptop, color: 'text-gray-500' },
    'Outdoor & Recreation': { icon: Tent, color: 'text-gray-500' },
    'Furniture': { icon: Sofa, color: 'text-gray-500' },
    'Personal Care & Grooming': { icon: Scissors, color: 'text-gray-500' }
} as const;

export const subCategoryIcons = {
    // Clothing
    'Footwear': { icon: Footprints, color: 'text-gray-500' },
    'Outerwear': { icon: JacketIcon, color: 'text-gray-500' },
    'Shirts & Tops': { icon: ShirtIcon, color: 'text-gray-500' },
    'Pants & Bottoms': { icon: Pants, color: 'text-gray-500' },
    'Underwear & Socks': { icon: Underwear, color: 'text-gray-500' },
    'Accessories': { icon: Watch, color: 'text-gray-500' },
    'Bags & Luggage': { icon: BackpackIcon, color: 'text-gray-500' },
    'Socks': { icon: Sock, color: 'text-gray-500' },
    'Headwear': { icon: Hat, color: 'text-gray-500' },
    'Watches': { icon: Clock, color: 'text-gray-500' },

    // Kitchen & Home
    'Cookware': { icon: ChefHat, color: 'text-gray-500' },
    'Appliances': { icon: Refrigerator, color: 'text-gray-500' },
    'Utensils & Gadgets': { icon: KitchenUtensils, color: 'text-gray-500' },
    'Dishware & Glassware': { icon: Wine, color: 'text-gray-500' },
    'Food Storage': { icon: Package, color: 'text-gray-500' },
    'Cleaning Supplies': { icon: Trash2, color: 'text-gray-500' },
    'Bedding & Linens': { icon: Bed, color: 'text-gray-500' },
    'Vacuum Cleaners': { icon: VacuumCleaner, color: 'text-gray-500' },
    'Organizers': { icon: BoxIcon, color: 'text-gray-500' },

    // Tools & Hardware
    'Hand Tools': { icon: HandIcon, color: 'text-gray-500' },
    'Power Tools': { icon: Drill, color: 'text-gray-500' },
    'Garden Tools': { icon: Trees, color: 'text-gray-500' },
    'Tool Storage': { icon: ToolboxIcon, color: 'text-gray-500' },
    'Hardware & Fasteners': { icon: Screwdriver, color: 'text-gray-500' },
    'Measuring & Marking Tools': { icon: Ruler, color: 'text-gray-500' },
    'Knives': { icon: Knife, color: 'text-gray-500' },

    // Electronics
    'Computers & Laptops': { icon: Monitor, color: 'text-gray-500' },
    'Smartphones & Tablets': { icon: Smartphone, color: 'text-gray-500' },
    'Audio Equipment': { icon: Headphones, color: 'text-gray-500' },
    'Cameras & Photography': { icon: Camera, color: 'text-gray-500' },
    'Home Entertainment': { icon: Tv, color: 'text-gray-500' },
    'Wearable Technology': { icon: SmartWatch, color: 'text-gray-500' },

    // Outdoor & Recreation
    'Camping Gear': { icon: CampingTent, color: 'text-gray-500' },
    'Hiking Equipment': { icon: Mountain, color: 'text-gray-500' },
    'Bicycles & Accessories': { icon: Bike, color: 'text-gray-500' },
    'Fitness Equipment': { icon: Dumbbell, color: 'text-gray-500' },
    'Outdoor Furniture': { icon: SofaIcon, color: 'text-gray-500' },
    'Grills & Outdoor Cooking': { icon: FlameKindling, color: 'text-gray-500' },

    // Furniture
    'Seating': { icon: Armchair, color: 'text-gray-500' },
    'Tables & Desks': { icon: Table, color: 'text-gray-500' },
    'Beds & Mattresses': { icon: BedDouble, color: 'text-gray-500' },
    'Storage & Organization': { icon: BoxIcon, color: 'text-gray-500' },
    'Lighting': { icon: Lamp, color: 'text-gray-500' },

    // Personal Care & Grooming
    'Razors & Grooming Tools': { icon: Razor, color: 'text-gray-500' },
    'Hair Care Tools': { icon: HairScissors, color: 'text-gray-500' },
    'Oral Care Products': { icon: Tooth, color: 'text-gray-500' },
    'Skincare Tools': { icon: SprayCanIcon, color: 'text-gray-500' },
    'Dental Care': { icon: Tooth, color: 'text-gray-500' }
} as const;

type MainCategoryKey = keyof typeof mainCategoryIcons;
type SubCategoryKey = keyof typeof subCategoryIcons;

export function getCategoryIcon(
    category: string | null,
    isMain: boolean
): CategoryIcon | undefined {
    if (!category) return undefined;

    const normalizedCategory = category.trim();
    
    if (isMain) {
        return mainCategoryIcons[normalizedCategory as MainCategoryKey];
    }
    
    return subCategoryIcons[normalizedCategory as SubCategoryKey];
}