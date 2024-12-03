<script lang="ts">
    // Import country flags from unplug-icons
    import UsFlag from '~icons/flag/us-4x3';
    import GbFlag from '~icons/flag/gb-4x3';
    import CnFlag from '~icons/flag/cn-4x3';
    import JpFlag from '~icons/flag/jp-4x3';
    import DeFlag from '~icons/flag/de-4x3';
    import FrFlag from '~icons/flag/fr-4x3';
    import InFlag from '~icons/flag/in-4x3';
    import ItFlag from '~icons/flag/it-4x3';
    import BrFlag from '~icons/flag/br-4x3';
    import CaFlag from '~icons/flag/ca-4x3';
    import RuFlag from '~icons/flag/ru-4x3';
    import KrFlag from '~icons/flag/kr-4x3'; // South Korea
    import EsFlag from '~icons/flag/es-4x3';
    import AuFlag from '~icons/flag/au-4x3';
    import MexicoFlag from '~icons/flag/mx-4x3';
    import IdFlag from '~icons/flag/id-4x3';
    import TrFlag from '~icons/flag/tr-4x3';
    import SaFlag from '~icons/flag/sa-4x3'; // Saudi Arabia
    import NgFlag from '~icons/flag/ng-4x3'; // Nigeria
    import ArFlag from '~icons/flag/ar-4x3'; // Argentina
    import NzFlag from '~icons/flag/nz-4x3'; // New Zealand
    import NlFlag from '~icons/flag/nl-4x3'; // Netherlands
    import ChFlag from '~icons/flag/ch-4x3'; // Switzerland
    import TwFlag from '~icons/flag/tw-4x3'; // Taiwan
    import PlFlag from '~icons/flag/pl-4x3'; // Poland
    import SeFlag from '~icons/flag/se-4x3'; // Sweden
    import BeFlag from '~icons/flag/be-4x3'; // Belgium
    import ThFlag from '~icons/flag/th-4x3'; // Thailand
    import AtFlag from '~icons/flag/at-4x3'; // Austria
    import IrFlag from '~icons/flag/ir-4x3'; // Iran
    import NoFlag from '~icons/flag/no-4x3'; // Norway
    import AeFlag from '~icons/flag/ae-4x3'; // United Arab Emirates
    import IlFlag from '~icons/flag/il-4x3'; // Israel
    import SiFlag from '~icons/flag/sg-4x3'; // Singapore
    import HkFlag from '~icons/flag/hk-4x3'; // Hong Kong
    import IeFlag from '~icons/flag/ie-4x3'; // Ireland
    import DkFlag from '~icons/flag/dk-4x3'; // Denmark
    import MyFlag from '~icons/flag/my-4x3'; // Malaysia
    import PhFlag from '~icons/flag/ph-4x3'; // Philippines
    import PkFlag from '~icons/flag/pk-4x3'; // Pakistan
    import CoFlag from '~icons/flag/co-4x3'; // Colombia
    import BgFlag from '~icons/flag/bg-4x3'; // Bulgaria
    import VnFlag from '~icons/flag/vn-4x3'; // Vietnam
    import EgFlag from '~icons/flag/eg-4x3'; // Egypt
    import GlobeIcon from '~icons/heroicons/globe-alt'; // Adjust the import path if necessary

    // Props
    export let country: string;
    export let size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';

    // Size mapping
    const sizeMap = {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
    };

    // Country mapping
    const countryMap: Record<string, { flag: typeof UsFlag; name: string }> = {
        'USA': { flag: UsFlag, name: 'USA' },
        'UK': { flag: GbFlag, name: 'UK' },
        'China': { flag: CnFlag, name: 'China' },
        'Japan': { flag: JpFlag, name: 'Japan' },
        'Germany': { flag: DeFlag, name: 'Germany' },
        'France': { flag: FrFlag, name: 'France' },
        'India': { flag: InFlag, name: 'India' },
        'Italy': { flag: ItFlag, name: 'Italy' },
        'Brazil': { flag: BrFlag, name: 'Brazil' },
        'Canada': { flag: CaFlag, name: 'Canada' },
        'Russia': { flag: RuFlag, name: 'Russia' },
        'South Korea': { flag: KrFlag, name: 'South Korea' },
        'Spain': { flag: EsFlag, name: 'Spain' },
        'Australia': { flag: AuFlag, name: 'Australia' },
        'Mexico': { flag: MexicoFlag, name: 'Mexico' },
        'Indonesia': { flag: IdFlag, name: 'Indonesia' },
        'Turkey': { flag: TrFlag, name: 'Turkey' },
        'Saudi Arabia': { flag: SaFlag, name: 'Saudi Arabia' },
        'Nigeria': { flag: NgFlag, name: 'Nigeria' },
        'Argentina': { flag: ArFlag, name: 'Argentina' },
        'New Zealand': { flag: NzFlag, name: 'New Zealand' },
        'Netherlands': { flag: NlFlag, name: 'Netherlands' },
        'Switzerland': { flag: ChFlag, name: 'Switzerland' },
        'Taiwan': { flag: TwFlag, name: 'Taiwan' },
        'Poland': { flag: PlFlag, name: 'Poland' },
        'Sweden': { flag: SeFlag, name: 'Sweden' },
        'Belgium': { flag: BeFlag, name: 'Belgium' },
        'Thailand': { flag: ThFlag, name: 'Thailand' },
        'Austria': { flag: AtFlag, name: 'Austria' },
        'Iran': { flag: IrFlag, name: 'Iran' },
        'Norway': { flag: NoFlag, name: 'Norway' },
        'United Arab Emirates': { flag: AeFlag, name: 'United Arab Emirates' },
        'Israel': { flag: IlFlag, name: 'Israel' },
        'Singapore': { flag: SiFlag, name: 'Singapore' },
        'Hong Kong': { flag: HkFlag, name: 'Hong Kong' },
        'Ireland': { flag: IeFlag, name: 'Ireland' },
        'Denmark': { flag: DkFlag, name: 'Denmark' },
        'Malaysia': { flag: MyFlag, name: 'Malaysia' },
        'Philippines': { flag: PhFlag, name: 'Philippines' },
        'Pakistan': { flag: PkFlag, name: 'Pakistan' },
        'Colombia': { flag: CoFlag, name: 'Colombia' },
        'Bulgaria': { flag: BgFlag, name: 'Bulgaria' },
        'Vietnam': { flag: VnFlag, name: 'Vietnam' },
        'Egypt': { flag: EgFlag, name: 'Egypt' }
    };

    // Get flag component
    const flagInfo = countryMap[country] || null;
</script>

{#if flagInfo}
    <div 
        class={`inline-block rounded-sm overflow-hidden ${sizeMap[size]}`}
        role="img" 
        aria-label={`Flag of ${flagInfo.name}`}
    >
        <svelte:component 
            this={flagInfo.flag}
            class="h-full w-full object-cover"
        />
    </div>
{:else}
    <!-- Fallback for unknown countries -->
    <div 
        class={`inline-block rounded-sm bg-gray-300 ${sizeMap[size]}`}
        role="img" 
        aria-label="Unknown Flag"
    >
        <!-- Optional: Add a default icon or leave it blank -->
        <GlobeIcon class="h-full w-full text-gray-500" />
    </div>
{/if}