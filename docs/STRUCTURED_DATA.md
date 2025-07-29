# Structured Data (JSON-LD) Implementation

This document describes the structured data implementation for the Fluid DnD documentation project.

## Overview

The documentation site uses comprehensive JSON-LD structured data to improve SEO and provide rich snippets in search results. The implementation includes multiple schema types tailored to different page types.

## Implementation Files

### 1. `src/components/overrides/CustomHead.astro`
The main component that injects structured data into the HTML head. It uses the utility function to generate appropriate schemas based on the current page.

### 2. `src/utils/structuredData.ts`
A utility function that generates structured data based on the current page type and content. This provides a clean, maintainable approach to structured data generation.

## Schema Types Implemented

### 1. Organization Schema
```json
{
  "@type": "Organization",
  "name": "Fluid DnD",
  "url": "https://fluid-dnd.netlify.app/",
  "logo": "https://fluid-dnd.netlify.app/fluid-dnd.svg",
  "description": "A fluid, agnostic and versatile drag and drop library for lists with Vue, React, and Svelte"
}
```

### 2. SoftwareApplication Schema
```json
{
  "@type": "SoftwareApplication",
  "name": "Fluid DnD",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "softwareVersion": "2.6.0",
  "downloadUrl": "https://www.npmjs.com/package/fluid-dnd"
}
```

### 3. TechArticle Schema (for guide pages)
```json
{
  "@type": "TechArticle",
  "headline": "Page Title",
  "description": "Page description",
  "author": {
    "@type": "Person",
    "name": "Carlos Jorge"
  },
  "about": [
    {"@type": "Thing", "name": "Drag and Drop"},
    {"@type": "Thing", "name": "Vue.js"},
    {"@type": "Thing", "name": "React"},
    {"@type": "Thing", "name": "Svelte"}
  ]
}
```

### 4. WebPage Schema (for homepage)
```json
{
  "@type": "WebPage",
  "name": "Fluid DnD Documentation",
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "Fluid DnD"
  }
}
```

### 5. BreadcrumbList Schema
```json
{
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
}
```

### 6. WebSite Schema
```json
{
  "@type": "WebSite",
  "name": "Fluid DnD Documentation",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://fluid-dnd.netlify.app/search?q={search_term_string}"
    }
  }
}
```

### 7. FAQPage Schema (for homepage)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Fluid DnD?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fluid DnD is a fluid, agnostic and versatile drag and drop library..."
      }
    }
  ]
}
```

## Page-Specific Logic

The structured data generation includes logic to provide different schemas based on the current page:

- **Homepage (`/` or `/vue`)**: WebPage + FAQPage schemas
- **Guide pages (`/guides/`)**: TechArticle schema with detailed about and keywords
- **Other pages**: Default TechArticle schema

## Framework-Specific Breadcrumbs

The implementation automatically adds framework-specific breadcrumbs for Vue, React, and Svelte pages:

- `/vue/guides/...` → Home > Documentation > Vue
- `/react/guides/...` → Home > Documentation > React
- `/svelte/guides/...` → Home > Documentation > Svelte

## Benefits

1. **SEO Improvement**: Rich snippets in search results
2. **Better Search Visibility**: Enhanced understanding by search engines
3. **User Experience**: Clear navigation structure through breadcrumbs
4. **Brand Recognition**: Organization and software application schemas
5. **Content Discovery**: Proper categorization of technical content

## Testing

You can test the structured data using:
- [Google's Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool)

## Maintenance

To update structured data:
1. Modify the `generateStructuredData` function in `src/utils/structuredData.ts`
2. Add new schema types as needed
3. Update page-specific logic for new page types
4. Test with Google's Rich Results Test

## Future Enhancements

Potential improvements:
- Add more specific schemas for different content types
- Implement dynamic FAQ generation based on page content
- Add review/rating schemas for community feedback
- Include more detailed author information
- Add video/audio schemas for multimedia content