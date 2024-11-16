// src/lib/utils/category-icons.ts
import type { SvelteComponent } from 'svelte';

// Main category icons
import ShirtIcon from '~icons/mdi/tshirt-crew';  // Changed from tshirt
import HomeIcon from '~icons/mdi/home';
import WrenchIcon from '~icons/mdi/wrench';
import LaptopIcon from '~icons/mdi/laptop';
import TentIcon from '~icons/mdi/tent';
import SofaIcon from '~icons/mdi/sofa';
import ScissorsIcon from '~icons/mdi/scissors';
import UtensilsIcon from '~icons/mdi/silverware';

// Subcategory icons
import FootprintsIcon from '~icons/mdi/foot-print';
import JacketIcon from '~icons/icon-park-outline/women-coat';  // Changed from jacket to coat
import TshirtIcon from '~icons/mdi/tshirt-crew';  // Changed from tshirt
import PantsIcon from '~icons/ph/pants-light';
import UnderwearIcon from '~icons/mdi/underwear';
import WatchIcon from '~icons/mdi/watch';
import BackpackIcon from '~icons/mdi/backpack';
import ChefHatIcon from '~icons/mdi/chef-hat';
import RefrigeratorIcon from '~icons/mdi/fridge';
import KitchenUtensilsIcon from '~icons/mdi/silverware-fork-knife';
import WineIcon from '~icons/mdi/glass-wine';
import PackageIcon from '~icons/mdi/package';
import TrashIcon from '~icons/mdi/trash-can';
import BedIcon from '~icons/mdi/bed';
import HandIcon from '~icons/mdi/hand';
import DrillIcon from '~icons/material-symbols/tools-power-drill';
import TreesIcon from '~icons/mdi/tree';
import ToolboxIcon from '~icons/mdi/toolbox';
import ScrewdriverIcon from '~icons/mdi/screwdriver';
import RulerIcon from '~icons/mdi/ruler';
import MonitorIcon from '~icons/mdi/monitor';
import SmartphoneIcon from '~icons/mdi/cellphone';
import HeadphonesIcon from '~icons/mdi/headphones';
import CameraIcon from '~icons/mdi/camera';
import TvIcon from '~icons/mdi/television';
import SmartWatchIcon from '~icons/mdi/watch-variant';
import CampingTentIcon from '~icons/mdi/tent';
import MountainIcon from '~icons/mdi/mountain';
import BikeIcon from '~icons/mdi/bike';
import DumbbellIcon from '~icons/mdi/dumbbell';
import ChairIcon from '~icons/mdi/chair-rolling';
import FireplaceIcon from '~icons/mdi/fireplace';
import ArmchairIcon from '~icons/mdi/chair';
import TableIcon from '~icons/mdi/table-furniture';
import BedDoubleIcon from '~icons/mdi/bed-double';
import BoxIcon from '~icons/mdi/box';
import LampIcon from '~icons/mdi/lamp';
import RazorIcon from '~icons/icon-park-outline/straight-razor';
import HairScissorsIcon from '~icons/mdi/scissors';
import ToothIcon from '~icons/mdi/tooth';
import SprayIcon from '~icons/mdi/spray';
import VacuumIcon from '~icons/mdi/vacuum';
import SockIcon from '~icons/icon-park-outline/socks';
import HatIcon from '~icons/mdi/hat-fedora'; // or could use mdi/safety-goggles for protective headwear
import KnifeIcon from '~icons/mdi/knife-military'; // or mdi/knife-kitchen for kitchen knives

export interface CategoryIcon {
    icon: new (...args: any[]) => SvelteComponent;
    color: string;
}

export const mainCategoryIcons = {
    'Clothing': { icon: ShirtIcon, color: 'text-gray-500' },
    'Kitchen & Home': { icon: HomeIcon, color: 'text-gray-500' },
    'Tools & Hardware': { icon: WrenchIcon, color: 'text-gray-500' },
    'Electronics': { icon: LaptopIcon, color: 'text-gray-500' },
    'Outdoor & Recreation': { icon: TentIcon, color: 'text-gray-500' },
    'Furniture': { icon: SofaIcon, color: 'text-gray-500' },
    'Personal Care & Grooming': { icon: ScissorsIcon, color: 'text-gray-500' }
} as const;

export const subCategoryIcons = {
    // Clothing
    'Footwear': { icon: FootprintsIcon, color: 'text-gray-500' },
    'Outerwear': { icon: JacketIcon, color: 'text-gray-500' },
    'Shirts & Tops': { icon: TshirtIcon, color: 'text-gray-500' },
    'Pants & Bottoms': { icon: PantsIcon, color: 'text-gray-500' },
    'Underwear & Socks': { icon: UnderwearIcon, color: 'text-gray-500' },
    'Accessories': { icon: WatchIcon, color: 'text-gray-500' },
    'Bags & Luggage': { icon: BackpackIcon, color: 'text-gray-500' },
    'Socks': { icon: SockIcon, color: 'text-gray-500' },
    'Headwear': { icon: HatIcon, color: 'text-gray-500' },
    'Watches': { icon: WatchIcon, color: 'text-gray-500' },

    // Kitchen & Home
    'Cookware': { icon: ChefHatIcon, color: 'text-gray-500' },
    'Appliances': { icon: RefrigeratorIcon, color: 'text-gray-500' },
    'Utensils & Gadgets': { icon: KitchenUtensilsIcon, color: 'text-gray-500' },
    'Dishware & Glassware': { icon: WineIcon, color: 'text-gray-500' },
    'Food Storage': { icon: PackageIcon, color: 'text-gray-500' },
    'Cleaning Supplies': { icon: TrashIcon, color: 'text-gray-500' },
    'Bedding & Linens': { icon: BedIcon, color: 'text-gray-500' },
    'Vacuum Cleaners': { icon: VacuumIcon, color: 'text-gray-500' },
    'Organizers': { icon: BoxIcon, color: 'text-gray-500' },

    // Tools & Hardware
    'Hand Tools': { icon: HandIcon, color: 'text-gray-500' },
    'Power Tools': { icon: DrillIcon, color: 'text-gray-500' },
    'Garden Tools': { icon: TreesIcon, color: 'text-gray-500' },
    'Tool Storage': { icon: ToolboxIcon, color: 'text-gray-500' },
    'Hardware & Fasteners': { icon: ScrewdriverIcon, color: 'text-gray-500' },
    'Measuring & Marking Tools': { icon: RulerIcon, color: 'text-gray-500' },
    'Knives': { icon: KnifeIcon, color: 'text-gray-500' },

    // Electronics
    'Computers & Laptops': { icon: MonitorIcon, color: 'text-gray-500' },
    'Smartphones & Tablets': { icon: SmartphoneIcon, color: 'text-gray-500' },
    'Audio Equipment': { icon: HeadphonesIcon, color: 'text-gray-500' },
    'Cameras & Photography': { icon: CameraIcon, color: 'text-gray-500' },
    'Home Entertainment': { icon: TvIcon, color: 'text-gray-500' },
    'Wearable Technology': { icon: SmartWatchIcon, color: 'text-gray-500' },

    // Outdoor & Recreation
    'Camping Gear': { icon: CampingTentIcon, color: 'text-gray-500' },
    'Hiking Equipment': { icon: MountainIcon, color: 'text-gray-500' },
    'Bicycles & Accessories': { icon: BikeIcon, color: 'text-gray-500' },
    'Fitness Equipment': { icon: DumbbellIcon, color: 'text-gray-500' },
    'Outdoor Furniture': { icon: ChairIcon, color: 'text-gray-500' },
    'Grills & Outdoor Cooking': { icon: FireplaceIcon, color: 'text-gray-500' },

    // Furniture
    'Seating': { icon: ArmchairIcon, color: 'text-gray-500' },
    'Tables & Desks': { icon: TableIcon, color: 'text-gray-500' },
    'Beds & Mattresses': { icon: BedDoubleIcon, color: 'text-gray-500' },
    'Storage & Organization': { icon: BoxIcon, color: 'text-gray-500' },
    'Lighting': { icon: LampIcon, color: 'text-gray-500' },

    // Personal Care & Grooming
    'Razors & Grooming Tools': { icon: RazorIcon, color: 'text-gray-500' },
    'Hair Care Tools': { icon: HairScissorsIcon, color: 'text-gray-500' },
    'Oral Care Products': { icon: ToothIcon, color: 'text-gray-500' },
    'Skincare Tools': { icon: SprayIcon, color: 'text-gray-500' },
    'Dental Care': { icon: ToothIcon, color: 'text-gray-500' }
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