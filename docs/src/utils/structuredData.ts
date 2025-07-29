import type { AstroGlobal } from 'astro';

export interface StructuredDataOptions {
  entry?: any;
  url: AstroGlobal['url'];
}

export function generateStructuredData({ entry, url }: StructuredDataOptions) {
  const currentPage = entry?.data;
  const currentPath = url.pathname;

  // Extract page information from URL when entry is not available
  const getPageInfo = () => {
    if (currentPage?.title && currentPage?.description) {
      return {
        title: currentPage.title,
        description: currentPage.description
      };
    }

    // Fallback to URL-based page detection
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    if (currentPath === '/' || currentPath === '/vue') {
      return {
        title: "Fluid DnD Documentation",
        description: "Official documentation for Fluid DnD, a fluid, agnostic and versatile drag and drop library for lists with Vue, React, and Svelte"
      };
    }

    if (currentPath.includes('/guides/')) {
      const framework = pathSegments[0] || 'vue';
      const guideName = pathSegments[pathSegments.length - 1] || 'guide';
      const formattedGuideName = guideName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      return {
        title: `${framework.charAt(0).toUpperCase() + framework.slice(1)} Guide - ${formattedGuideName}`,
        description: `Guide for Fluid DnD ${framework} library - ${guideName.replace(/-/g, ' ')}`
      };
    }

    if (currentPath.includes('/example/')) {
      const framework = pathSegments[0] || 'vue';
      const exampleType = pathSegments[pathSegments.length - 1] || 'example';
      const formattedExampleType = exampleType
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      return {
        title: `${framework.charAt(0).toUpperCase() + framework.slice(1)} Example - ${formattedExampleType}`,
        description: `Example for Fluid DnD ${framework} library - ${exampleType.replace(/-/g, ' ')}`
      };
    }

    if (currentPath.includes('/introduction/')) {
      const framework = pathSegments[0] || 'vue';
      return {
        title: `${framework.charAt(0).toUpperCase() + framework.slice(1)} Introduction - Fluid DnD`,
        description: `Introduction to Fluid DnD ${framework} library - Getting started guide`
      };
    }

    // Default fallback
    return {
      title: "Fluid DnD Documentation",
      description: "Official documentation for Fluid DnD, a fluid, agnostic and versatile drag and drop library for lists with Vue, React, and Svelte"
    };
  };

  const pageInfo = getPageInfo();

  // Base organization data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fluid DnD",
    "url": "https://fluid-dnd.netlify.app/",
    "logo": "https://fluid-dnd.netlify.app/fluid-dnd.svg",
    "description": "A fluid, agnostic and versatile drag and drop library for lists with Vue, React, and Svelte",
    "sameAs": [
      "https://github.com/carlosjorger/fluid-dnd"
    ],
    "founder": {
      "@type": "Person",
      "name": "Carlos Jorge",
      "url": "https://www.linkedin.com/in/carlosjorger/"
    }
  };

  // Software application data
  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fluid DnD",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "description": "A fluid, agnostic and versatile drag and drop library for lists with Vue, React, and Svelte",
    "url": "https://fluid-dnd.netlify.app/",
    "author": {
      "@type": "Person",
      "name": "Carlos Jorge",
      "url": "https://www.linkedin.com/in/carlosjorger/"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "softwareVersion": "2.6.0",
    "downloadUrl": "https://www.npmjs.com/package/fluid-dnd",
    "installUrl": "https://www.npmjs.com/package/fluid-dnd"
  };

  // Determine page type and generate appropriate schema
  let pageData;
  
  if (currentPath === '/' || currentPath === '/vue') {
    // Homepage or main documentation page
    pageData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": pageInfo.title,
      "description": pageInfo.description,
      "url": url.href,
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": "Fluid DnD"
      }
    };
  } else if (currentPath.includes('/guides/')) {
    // Guide pages
    pageData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": pageInfo.title,
      "description": pageInfo.description,
      "url": url.href,
      "author": {
        "@type": "Person",
        "name": "Carlos Jorge",
        "url": "https://www.linkedin.com/in/carlosjorger/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Fluid DnD",
        "logo": {
          "@type": "ImageObject",
          "url": "https://fluid-dnd.netlify.app/fluid-dnd.svg"
        }
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url.href
      },
      "about": [
        {
          "@type": "Thing",
          "name": "Drag and Drop"
        },
        {
          "@type": "Thing", 
          "name": "Vue.js"
        },
        {
          "@type": "Thing",
          "name": "React"
        },
        {
          "@type": "Thing",
          "name": "Svelte"
        },
        {
          "@type": "Thing",
          "name": "JavaScript"
        },
        {
          "@type": "Thing",
          "name": "TypeScript"
        }
      ],
      "keywords": "drag and drop, vue, react, svelte, javascript, typescript, library, fluid, agnostic, versatile"
    };
  } else {
    // Default documentation page
    pageData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": pageInfo.title,
      "description": pageInfo.description,
      "url": url.href,
      "author": {
        "@type": "Person",
        "name": "Carlos Jorge",
        "url": "https://www.linkedin.com/in/carlosjorger/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Fluid DnD",
        "logo": {
          "@type": "ImageObject",
          "url": "https://fluid-dnd.netlify.app/fluid-dnd.svg"
        }
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url.href
      }
    };
  }

  // Breadcrumb data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fluid-dnd.netlify.app/"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Documentation",
        "item": "https://fluid-dnd.netlify.app/vue"
      }
    ]
  };

  // Add framework-specific breadcrumb if on a framework page
  if (currentPath.includes('/vue/') || currentPath.includes('/react/') || currentPath.includes('/svelte/')) {
    const framework = currentPath.split('/')[1];
    breadcrumbData.itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": framework.charAt(0).toUpperCase() + framework.slice(1),
      "item": `https://fluid-dnd.netlify.app/${framework}`
    });
  }

  // WebSite data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fluid DnD Documentation",
    "url": "https://fluid-dnd.netlify.app/",
    "description": "Official documentation for Fluid DnD, a fluid, agnostic and versatile drag and drop library for lists with Vue, React, and Svelte",
    "publisher": {
      "@type": "Organization",
      "name": "Fluid DnD"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://fluid-dnd.netlify.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // FAQ data for specific pages
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Fluid DnD?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fluid DnD is a fluid, agnostic and versatile drag and drop library for lists with Vue, React, and Svelte. It provides smooth drag and drop functionality for web applications."
        }
      },
      {
        "@type": "Question",
        "name": "Which frameworks does Fluid DnD support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fluid DnD supports Vue.js, React, and Svelte frameworks, making it a versatile solution for different JavaScript frameworks."
        }
      },
      {
        "@type": "Question",
        "name": "Is Fluid DnD free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Fluid DnD is completely free to use and is available as an open-source project on GitHub."
        }
      }
    ]
  };

  // Combine all structured data
  const structuredData = [
    organizationData,
    softwareApplicationData,
    pageData,
    breadcrumbData,
    websiteData
  ];

  // Add FAQ data for homepage
  if (currentPath === '/' || currentPath === '/vue') {
    structuredData.push(faqData as any);
  }

  return structuredData;
}