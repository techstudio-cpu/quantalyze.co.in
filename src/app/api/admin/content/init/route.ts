import { NextRequest, NextResponse } from 'next/server';
import { initContentTables } from '@/lib/content-utils';
import { fallbackQuery } from '@/lib/fallback-db';

// Content structure definition
const websiteStructure = {
  hero: {
    sectionName: "Hero Section",
    components: {
      hero: {
        badge: { type: "text", value: "Quantalyze, your unfair growth advantage" },
        title: { type: "textarea", value: "Build magnetic digital experiences powered by AI strategy" },
        subtitle: { type: "textarea", value: "From automation copilots to demand engines, we stitch systems that feel premium, convert harder, and scale with your momentum." },
        primaryButton: { type: "text", value: "Book a strategy call" },
        secondaryButton: { type: "text", value: "Explore our playbooks" },
        statsLabel1: { type: "text", value: "Brands partnered" },
        statsValue1: { type: "text", value: "150+" },
        statsLabel2: { type: "text", value: "Retention rate" },
        statsValue2: { type: "text", value: "90%" },
        statsLabel3: { type: "text", value: "Launches delivered" },
        statsValue3: { type: "text", value: "102+" },
        highlightsTitle: { type: "text", value: "Real wins from our growth labs" },
        highlight1Value: { type: "text", value: "69x" },
        highlight1Label: { type: "text", value: "Faster campaign throughput" },
        highlight1Copy: { type: "textarea", value: "Automation playbooks launch new funnels in hours, not weeks." },
        highlight2Value: { type: "text", value: "4.8x" },
        highlight2Label: { type: "text", value: "Average ROAS across paid channels" },
        highlight2Copy: { type: "textarea", value: "Full-funnel optimisation ties performance ads with retention." },
        highlight3Value: { type: "text", value: "+320%" },
        highlight3Label: { type: "text", value: "Organic visibility lift" },
        highlight3Copy: { type: "textarea", value: "Compound SEO engines blend founders' POV with topical clusters." },
        insideTitle: { type: "text", value: "Inside the pod" },
        insideCopy: { type: "textarea", value: "Strategy sprints, AI build squads, and creative ops all synced to a single growth map. Every engagement unlocks your own Quantalyze war room." }
      }
    }
  },
  services: {
    sectionName: "Services Section",
    components: {
      services: {
        title: { type: "text", value: "Our Services" },
        subtitle: { type: "textarea", value: "Comprehensive digital solutions to accelerate your growth" },
        service1Name: { type: "text", value: "Automation Workflow / AI Agents" },
        service1Tagline: { type: "textarea", value: "Automate customer journeys with AI-first workflows." },
        service1Sub1: { type: "text", value: "AI Agents & Copilots" },
        service1Sub2: { type: "text", value: "Workflow Automation (n8n, Zapier)" },
        service1Sub3: { type: "text", value: "Custom Chatbots" },
        service1Sub4: { type: "text", value: "Analytics Dashboards" },
        service2Name: { type: "text", value: "Digital Marketing" },
        service2Tagline: { type: "textarea", value: "Performance marketing that turns attention into revenue." },
        service2Sub1: { type: "text", value: "Social Media Campaigns" },
        service2Sub2: { type: "text", value: "Content & Influencer Strategy" },
        service2Sub3: { type: "text", value: "SEO & ASO" },
        service2Sub4: { type: "text", value: "Performance Ads" },
        service3Name: { type: "text", value: "Web / App Development" },
        service3Tagline: { type: "textarea", value: "High-converting web and mobile experiences built fast." },
        service3Sub1: { type: "text", value: "Corporate Websites" },
        service3Sub2: { type: "text", value: "Ecommerce Stores" },
        service3Sub3: { type: "text", value: "Progressive Web Apps" },
        service3Sub4: { type: "text", value: "Mobile Apps (iOS & Android)" }
      }
    }
  },
  navbar: {
    sectionName: "Navigation Bar",
    components: {
      navbar: {
        logoAlt: { type: "text", value: "Quantalyze Logo" },
        navLink1: { type: "text", value: "Home" },
        navLink2: { type: "text", value: "About Us" },
        navLink3: { type: "text", value: "Courses" },
        navLink4: { type: "text", value: "Services" },
        navLink5: { type: "text", value: "Contact" }
      }
    }
  },
  contact: {
    sectionName: "Contact Section",
    components: {
      contact: {
        title: { type: "text", value: "Get in Touch" },
        subtitle: { type: "textarea", value: "Ready to transform your digital presence? Let's talk about your goals." },
        email: { type: "email", value: "info@quantalyze.co.in" },
        phone: { type: "tel", value: "+91 8770338369" },
        address: { type: "textarea", value: "Remote Digital Agency - Serving Clients Worldwide" },
        formTitle: { type: "text", value: "Send us a message" },
        formName: { type: "text", value: "Your Name" },
        formEmail: { type: "text", value: "Your Email" },
        formMessage: { type: "text", value: "Your Message" },
        formButton: { type: "text", value: "Send Message" }
      }
    }
  },
  footer: {
    sectionName: "Footer",
    components: {
      footer: {
        companyName: { type: "text", value: "Quantalyze" },
        tagline: { type: "text", value: "Learn Digital, Earn Digital, Live Digital" },
        description: { type: "textarea", value: "Transform your digital presence with AI-powered marketing solutions and automation." },
        quickLinksTitle: { type: "text", value: "Quick Links" },
        servicesTitle: { type: "text", value: "Services" },
        contactTitle: { type: "text", value: "Contact Info" },
        copyright: { type: "text", value: "© 2024 Quantalyze. All rights reserved." },
        partnerText: { type: "text", value: "Technology Partner:" },
        partnerName: { type: "text", value: "Tech Studio" }
      }
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting content initialization...');
    
    // Initialize tables first
    console.log('📋 Initializing content tables...');
    await initContentTables();
    console.log('✅ Content tables initialized successfully');
    
    let insertedSections = 0;
    let insertedContent = 0;
    
    console.log('📊 Starting to insert sections and content...');
    
    // Insert sections and content
    for (const [sectionId, sectionData] of Object.entries(websiteStructure)) {
      const section = sectionData as any;
      console.log(`📝 Processing section: ${sectionId}`);
      
      // Insert section
      await fallbackQuery(`
        INSERT OR REPLACE INTO website_sections 
        (section_id, section_name, section_order) 
        VALUES (?, ?, ?)
      `, [sectionId, section.sectionName, insertedSections]);
      insertedSections++;
      console.log(`✅ Section "${sectionId}" inserted (${insertedSections}/${Object.keys(websiteStructure).length})`);
      
      // Insert content for each component
      for (const [componentId, componentData] of Object.entries(section.components)) {
        const component = componentData as any;
        console.log(`🔧 Processing component: ${componentId} in section ${sectionId}`);
        
        for (const [fieldName, fieldData] of Object.entries(component)) {
          const field = fieldData as any;
          
          await fallbackQuery(`
            INSERT OR REPLACE INTO website_content 
            (section, component, field_name, field_value, field_type) 
            VALUES (?, ?, ?, ?, ?)
          `, [sectionId, componentId, fieldName, field.value, field.type]);
          insertedContent++;
        }
      }
      console.log(`✅ Section "${sectionId}" completed with ${Object.keys(section.components).length} components`);
    }
    
    console.log(`🎉 Initialization complete: ${insertedSections} sections, ${insertedContent} content items`);
    
    return NextResponse.json({
      success: true,
      message: 'Website content initialized successfully',
      data: {
        sectionsInserted: insertedSections,
        contentItemsInserted: insertedContent
      }
    });
  } catch (error) {
    console.error('❌ Error initializing content:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize content',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
