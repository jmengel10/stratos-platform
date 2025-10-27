const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupStripe() {
  console.log('🚀 Setting up Stripe products and prices...\n');
  
  try {
    // Create main StratOS product
    const product = await stripe.products.create({
      name: 'StratOS Platform',
      description: 'AI-powered strategic consulting platform',
      metadata: {
        type: 'main_product'
      }
    });
    
    console.log(`✅ Created product: ${product.name} (${product.id})`);
    
    // Create tier prices
    const tiers = [
      {
        name: 'Starter',
        price: 9900, // $99.00
        limits: { projects: 3, tokens: 100000, storage: 10737418240 }
      },
      {
        name: 'Pro',
        price: 29900, // $299.00
        limits: { projects: 10, tokens: 500000, storage: 53687091200 }
      },
      {
        name: 'Firm',
        price: 79900, // $799.00
        limits: { projects: 25, tokens: 2000000, storage: 214748364800 }
      },
      {
        name: 'Enterprise',
        price: 149900, // $1,499.00
        limits: { projects: 50, tokens: 5000000, storage: 536870912000 }
      }
    ];
    
    const tierPrices = {};
    
    for (const tier of tiers) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.price,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        metadata: {
          tier: tier.name.toLowerCase(),
          type: 'tier'
        }
      });
      
      tierPrices[tier.name.toLowerCase()] = price.id;
      console.log(`✅ Created ${tier.name} price: ${price.id} ($${(tier.price / 100).toFixed(2)}/month)`);
    }
    
    // Create add-on products
    const addons = [
      {
        name: 'Agent Builder Toolkit',
        description: 'Advanced AI agent creation tools',
        price: 1900 // $19.00
      },
      {
        name: 'Dedicated Search Index',
        description: 'Enhanced search capabilities',
        price: 20000 // $200.00
      }
    ];
    
    const addonPrices = {};
    
    for (const addon of addons) {
      const addonProduct = await stripe.products.create({
        name: addon.name,
        description: addon.description,
        metadata: {
          type: 'addon'
        }
      });
      
      const price = await stripe.prices.create({
        product: addonProduct.id,
        unit_amount: addon.price,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        metadata: {
          type: 'addon'
        }
      });
      
      const addonKey = addon.name.toLowerCase().replace(/\s+/g, '');
      addonPrices[addonKey] = price.id;
      console.log(`✅ Created ${addon.name} price: ${price.id} ($${(addon.price / 100).toFixed(2)}/month)`);
    }
    
    // Output configuration for database
    console.log('\n📋 Add these price IDs to your stratos_config:');
    console.log('\nTier Prices:');
    Object.entries(tierPrices).forEach(([tier, priceId]) => {
      console.log(`  ${tier}: "${priceId}"`);
    });
    
    console.log('\nAdd-on Prices:');
    Object.entries(addonPrices).forEach(([addon, priceId]) => {
      console.log(`  ${addon}: "${priceId}"`);
    });
    
    console.log('\n🎉 Stripe setup complete!');
    console.log('\nNext steps:');
    console.log('1. Copy the price IDs above to your stratos_config');
    console.log('2. Run: npm run seed-config');
    console.log('3. Test webhook endpoint: GET /webhooks/stripe/test');
    
  } catch (error) {
    console.error('❌ Stripe setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupStripe();
}

module.exports = setupStripe;
