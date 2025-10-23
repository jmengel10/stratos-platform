const dbManager = require('../config/database');

async function seedConfig() {
  console.log('🌱 Seeding StratOS configuration...\n');
  
  try {
    // Initialize database
    await dbManager.initialize();
    
    // Global StratOS configuration
    const stratosConfig = {
      id: 'stratos',
      tiers: {
        starter: {
          name: 'Starter',
          price: { 
            monthly: 9900, 
            stripePriceId: 'price_starter_placeholder' // Replace with actual Stripe price ID
          },
          limits: { 
            projects: 3, 
            tokens: 100000, 
            storage: 10737418240 // 10GB
          }
        },
        pro: {
          name: 'Pro',
          price: { 
            monthly: 29900, 
            stripePriceId: 'price_pro_placeholder' // Replace with actual Stripe price ID
          },
          limits: { 
            projects: 10, 
            tokens: 500000, 
            storage: 53687091200 // 50GB
          }
        },
        firm: {
          name: 'Firm',
          price: { 
            monthly: 79900, 
            stripePriceId: 'price_firm_placeholder' // Replace with actual Stripe price ID
          },
          limits: { 
            projects: 25, 
            tokens: 2000000, 
            storage: 214748364800 // 200GB
          }
        },
        enterprise: {
          name: 'Enterprise',
          price: { 
            monthly: 149900, 
            stripePriceId: 'price_enterprise_placeholder' // Replace with actual Stripe price ID
          },
          limits: { 
            projects: 50, 
            tokens: 5000000, 
            storage: 536870912000 // 500GB
          }
        }
      },
      addOns: {
        agentBuilder: {
          name: 'Agent Builder Toolkit',
          price: { 
            monthly: 1900, 
            stripePriceId: 'price_addon_agent_placeholder' // Replace with actual Stripe price ID
          }
        },
        searchIndex: {
          name: 'Dedicated Search Index',
          price: { 
            monthly: 20000, 
            stripePriceId: 'price_addon_search_placeholder' // Replace with actual Stripe price ID
          }
        }
      },
      thresholds: { 
        warning: 0.8, 
        critical: 0.9, 
        blocked: 1.0 
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create or update configuration
    const container = dbManager.getContainer('stratos_config');
    
    try {
      // Try to read existing config
      const { resource: existingConfig } = await container.item('stratos', 'stratos').read();
      
      // Update existing config
      const updatedConfig = {
        ...existingConfig,
        ...stratosConfig,
        updatedAt: new Date().toISOString()
      };
      
      const { resource } = await container.item('stratos', 'stratos').replace(updatedConfig);
      console.log('✅ Updated existing StratOS configuration');
      
    } catch (error) {
      if (error.code === 404) {
        // Create new config
        const { resource } = await container.items.create(stratosConfig);
        console.log('✅ Created new StratOS configuration');
      } else {
        throw error;
      }
    }
    
    // Create sample clients for testing
    const sampleClients = [
      {
        id: 'client_acme',
        name: 'Acme Corporation',
        tier: 'enterprise',
        subscription: {
          status: 'active',
          stripeCustomerId: 'cus_sample_acme',
          stripeSubscriptionId: 'sub_sample_acme'
        },
        addOns: {
          agentBuilder: true,
          searchIndex: false
        },
        overrides: {
          pricing: { enabled: false, monthly: null },
          limits: { enabled: false, projects: null, tokens: null, storage: null }
        },
        usage: {
          projects: 12,
          tokens: { total: 770000 },
          storage: 53687091200
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'client_techventures',
        name: 'TechVentures Group',
        tier: 'pro',
        subscription: {
          status: 'active',
          stripeCustomerId: 'cus_sample_techventures',
          stripeSubscriptionId: 'sub_sample_techventures'
        },
        addOns: {
          agentBuilder: false,
          searchIndex: true
        },
        overrides: {
          pricing: { enabled: false, monthly: null },
          limits: { enabled: false, projects: null, tokens: null, storage: null }
        },
        usage: {
          projects: 8,
          tokens: { total: 320000 },
          storage: 21474836480
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'client_healthfirst',
        name: 'HealthFirst Systems',
        tier: 'starter',
        subscription: {
          status: 'past_due',
          stripeCustomerId: 'cus_sample_healthfirst',
          stripeSubscriptionId: 'sub_sample_healthfirst'
        },
        addOns: {
          agentBuilder: false,
          searchIndex: false
        },
        overrides: {
          pricing: { enabled: false, monthly: null },
          limits: { enabled: false, projects: null, tokens: null, storage: null }
        },
        usage: {
          projects: 2,
          tokens: { total: 45000 },
          storage: 1073741824
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    const clientContainer = dbManager.getContainer('clients');
    
    for (const client of sampleClients) {
      try {
        await clientContainer.item(client.id, client.id).read();
        console.log(`⏭️  Client ${client.name} already exists, skipping`);
      } catch (error) {
        if (error.code === 404) {
          await clientContainer.items.create(client);
          console.log(`✅ Created sample client: ${client.name}`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('\n🎉 Configuration seeded successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update Stripe price IDs in the configuration');
    console.log('2. Start the server: npm run dev');
    console.log('3. Access admin UI at: http://localhost:3000');
    console.log('4. Test API endpoints with admin key in headers');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedConfig();
}

module.exports = seedConfig;
