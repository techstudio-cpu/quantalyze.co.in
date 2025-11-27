import { NextResponse } from 'next/server';
import { contactEmail } from '@/config/email';
import { initContentTables } from '@/lib/content-utils';
import { fallbackQuery } from '@/lib/fallback-db';

// Website structure data
const websiteStructure = {
  hero: {
    sectionName: "Hero Section",
    components: {
      hero: {
        title: { type: "text", value: "Transform Your Digital Presence with Quantalyze" },
        subtitle: { type: "text", value: "Your trusted partner for comprehensive digital marketing solutions" },
        ctaText: { type: "text", value: "Get Started Today" },
        secondaryCtaText: { type: "text", value: "View Our Work" }
      }
    }
  },
  services: {
    sectionName: "Our Services",
    components: {
      services: {
        title: { type: "text", value: "Our Services" },
        subtitle: { type: "text", value: "Comprehensive digital solutions to grow your business" },
        description: { type: "textarea", value: "We offer a complete range of digital marketing services tailored to your needs" }
      }
    }
  },
  about: {
    sectionName: "About Us",
    components: {
      about: {
        title: { type: "text", value: "About Quantalyze" },
        description: { type: "textarea", value: "We are a leading digital marketing agency dedicated to helping businesses succeed online." },
        mission: { type: "text", value: "To deliver exceptional digital marketing results that drive growth and success." }
      }
    }
  },
  contact: {
    sectionName: "Contact Section",
    components: {
      contact: {
        title: { type: "text", value: "Get In Touch" },
        subtitle: { type: "text", value: "Ready to transform your digital presence?" },
        email: { type: "text", value: contactEmail },
        phone: { type: "text", value: "+91 8770338369" },
        address: { type: "text", value: "Remote Digital Agency - Serving Clients Worldwide" }
      }
    }
  },
  footer: {
    sectionName: "Footer",
    components: {
      footer: {
        copyright: { type: "text", value: "© 2024 Quantalyze. All rights reserved." },
        partnerText: { type: "text", value: "Technology Partner:" },
        partnerName: { type: "text", value: "Tech Studio" }
      }
    }
  }
};

export async function POST() {
  try {
    // Initialize tables first
    await initContentTables();
    
    let insertedSections = 0;
    let insertedContent = 0;
    
    // Insert sections and content
    for (const [sectionId, sectionData] of Object.entries(websiteStructure)) {
      const section = sectionData as any;
      
      // Insert section
      await fallbackQuery(`
        INSERT OR REPLACE INTO website_sections 
        (section_id, section_name, section_order) 
        VALUES (?, ?, ?)
      `, [sectionId, section.sectionName, insertedSections]);
      insertedSections++;
      
      // Insert content for each component
      for (const [componentId, componentData] of Object.entries(section.components)) {
        const component = componentData as any;
        
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
    }
    
    return NextResponse.json({
      success: true,
      message: 'Website content initialized successfully',
      data: {
        sectionsInserted: insertedSections,
        contentItemsInserted: insertedContent
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize content',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
