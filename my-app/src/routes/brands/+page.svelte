<script lang="ts">
    import FeaturedBrands from '$lib/components/featured-brands.svelte';
    import { Sparkles, TrendingUp, Users } from 'lucide-svelte';
  </script>
  
  <div class="space-y-16">
    <!-- Carousel Section -->
    <FeaturedBrands />
  
    <!-- Additional Sections -->
    <section class="grid md:grid-cols-3 gap-8">
      <div class="p-6 rounded-lg bg-blue-50">
        <Sparkles class="h-8 w-8 text-blue-600 mb-4" />
        <h3 class="text-xl font-semibold mb-2">New Additions</h3>
        <p class="text-gray-600">Recently verified and added BIFL brands</p>
      </div>
      <!-- Add more highlight sections -->
    </section>
  </div>