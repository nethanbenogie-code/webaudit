/**
 * Web Audit Utilities
 * Provides functions to check and audit websites for SEO and performance
 */

// ============ META TAGS UTILITIES ============

/**
 * Check if meta tags are present and valid
 * @param {Document} doc - The document object
 * @returns {Object} Meta tags audit results
 */
function checkMetaTags(doc) {
  const results = {
    hasTitle: false,
    titleLength: 0,
    titleStatus: 'missing',
    hasMetaDescription: false,
    descriptionLength: 0,
    descriptionStatus: 'missing',
    hasMetaKeywords: false,
    hasMetaViewport: false,
    hasCharset: false,
    issues: []
  };

  // Check title tag
  const title = doc.querySelector('title');
  if (title && title.textContent) {
    results.hasTitle = true;
    results.titleLength = title.textContent.length;
    if (results.titleLength < 30) {
      results.titleStatus = 'too-short';
      results.issues.push('Title tag is too short (min 30 characters recommended)');
    } else if (results.titleLength > 60) {
      results.titleStatus = 'too-long';
      results.issues.push('Title tag is too long (max 60 characters recommended)');
    } else {
      results.titleStatus = 'good';
    }
  } else {
    results.issues.push('Title tag is missing');
  }

  // Check meta description
  const metaDescription = doc.querySelector('meta[name="description"]');
  if (metaDescription && metaDescription.getAttribute('content')) {
    results.hasMetaDescription = true;
    results.descriptionLength = metaDescription.getAttribute('content').length;
    if (results.descriptionLength < 120) {
      results.descriptionStatus = 'too-short';
      results.issues.push('Meta description is too short (min 120 characters recommended)');
    } else if (results.descriptionLength > 160) {
      results.descriptionStatus = 'too-long';
      results.issues.push('Meta description is too long (max 160 characters recommended)');
    } else {
      results.descriptionStatus = 'good';
    }
  } else {
    results.issues.push('Meta description is missing');
  }

  // Check meta keywords
  const metaKeywords = doc.querySelector('meta[name="keywords"]');
  results.hasMetaKeywords = metaKeywords && metaKeywords.getAttribute('content') ? true : false;

  // Check viewport meta tag
  const metaViewport = doc.querySelector('meta[name="viewport"]');
  results.hasMetaViewport = metaViewport ? true : false;
  if (!results.hasMetaViewport) {
    results.issues.push('Viewport meta tag is missing (important for mobile responsiveness)');
  }

  // Check charset
  const charset = doc.querySelector('meta[charset], meta[http-equiv="Content-Type"]');
  results.hasCharset = charset ? true : false;
  if (!results.hasCharset) {
    results.issues.push('Character set is not defined');
  }

  return results;
}

// ============ HEADING STRUCTURE UTILITIES ============

/**
 * Check heading structure (H1, H2, H3, etc.)
 * @param {Document} doc - The document object
 * @returns {Object} Heading structure audit results
 */
function checkHeadingStructure(doc) {
  const results = {
    h1Count: 0,
    h1Tags: [],
    hasMultipleH1: false,
    headingHierarchy: {
      h1: 0,
      h2: 0,
      h3: 0,
      h4: 0,
      h5: 0,
      h6: 0
    },
    issues: []
  };

  for (let i = 1; i <= 6; i++) {
    const headings = doc.querySelectorAll(`h${i}`);
    results.headingHierarchy[`h${i}`] = headings.length;

    if (i === 1) {
      results.h1Count = headings.length;
      headings.forEach(h => {
        if (h.textContent) {
          results.h1Tags.push(h.textContent.trim());
        }
      });
    }
  }

  // Validate H1 count
  if (results.h1Count === 0) {
    results.issues.push('No H1 tag found. Every page should have exactly one H1 tag');
  } else if (results.h1Count > 1) {
    results.hasMultipleH1 = true;
    results.issues.push(`Multiple H1 tags found (${results.h1Count}). Only one H1 tag per page is recommended`);
  }

  // Check for duplicate H1s
  if (new Set(results.h1Tags).size < results.h1Tags.length) {
    results.issues.push('Duplicate H1 tags found');
  }

  return results;
}

// ============ IMAGE UTILITIES ============

/**
 * Check images for alt text and optimization
 * @param {Document} doc - The document object
 * @returns {Object} Image audit results
 */
function checkImages(doc) {
  const results = {
    totalImages: 0,
    imagesWithAlt: 0,
    imagesWithoutAlt: 0,
    largeImages: [],
    issues: []
  };

  const images = doc.querySelectorAll('img');
  results.totalImages = images.length;

  images.forEach((img, index) => {
    const hasAlt = img.hasAttribute('alt') && img.getAttribute('alt').trim() !== '';
    const altText = img.getAttribute('alt') || '';

    if (hasAlt) {
      results.imagesWithAlt++;
    } else {
      results.imagesWithoutAlt++;
      results.issues.push(`Image ${index + 1} is missing alt text`);
    }

    // Check image file size (basic check)
    if (img.src) {
      const img_obj = new Image();
      img_obj.src = img.src;
      if (img_obj.naturalWidth > 1920 || img_obj.naturalHeight > 1080) {
        results.largeImages.push({
          src: img.src,
          width: img_obj.naturalWidth,
          height: img_obj.naturalHeight
        });
      }
    }
  });

  if (results.imagesWithoutAlt > 0) {
    results.issues.push(`${results.imagesWithoutAlt} image(s) missing alt text. Alt text improves accessibility and SEO`);
  }

  return results;
}

// ============ LINK UTILITIES ============

/**
 * Check internal and external links
 * @param {Document} doc - The document object
 * @returns {Object} Link audit results
 */
function checkLinks(doc) {
  const results = {
    totalLinks: 0,
    internalLinks: 0,
    externalLinks: 0,
    linksWithoutText: [],
    brokenLinks: [],
    issues: []
  };

  const links = doc.querySelectorAll('a');
  results.totalLinks = links.length;

  const currentDomain = window.location.hostname;

  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();

    // Check for missing link text
    if (!text) {
      results.linksWithoutText.push({
        index: index,
        href: href
      });
      results.issues.push(`Link ${index + 1} has no anchor text`);
    }

    // Check if link is internal or external
    if (href) {
      if (href.startsWith('http') || href.startsWith('//')) {
        const linkDomain = new URL(href).hostname;
        if (linkDomain === currentDomain) {
          results.internalLinks++;
        } else {
          results.externalLinks++;
        }
      } else if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
        results.internalLinks++;
      }
    }
  });

  return results;
}

// ============ PERFORMANCE UTILITIES ============

/**
 * Check page performance basics
 * @param {Document} doc - The document object
 * @returns {Object} Performance audit results
 */
function checkPerformance(doc) {
  const results = {
    scriptCount: 0,
    stylesheetCount: 0,
    inlineScripts: 0,
    inlineStyles: 0,
    issues: []
  };

  // Count scripts
  results.scriptCount = doc.querySelectorAll('script[src]').length;
  results.inlineScripts = doc.querySelectorAll('script:not([src])').length;

  // Count stylesheets
  results.stylesheetCount = doc.querySelectorAll('link[rel="stylesheet"]').length;
  results.inlineStyles = doc.querySelectorAll('style').length;

  // Check for render-blocking resources
  const head = doc.querySelector('head');
  if (head) {
    const headScripts = head.querySelectorAll('script[src]');
    if (headScripts.length > 0) {
      results.issues.push(`${headScripts.length} render-blocking script(s) found in head. Consider moving to bottom of body or using async/defer`);
    }
  }

  return results;
}

// ============ ACCESSIBILITY UTILITIES ============

/**
 * Check basic accessibility features
 * @param {Document} doc - The document object
 * @returns {Object} Accessibility audit results
 */
function checkAccessibility(doc) {
  const results = {
    hasLangAttribute: false,
    hasSkipLinks: false,
    formsWithLabels: 0,
    formsWithoutLabels: 0,
    issues: []
  };

  // Check lang attribute
  const html = doc.documentElement;
  results.hasLangAttribute = html.hasAttribute('lang');
  if (!results.hasLangAttribute) {
    results.issues.push('HTML element missing lang attribute');
  }

  // Check for skip links
  const skipLink = doc.querySelector('a[href="#main"], a[href="#content"]');
  results.hasSkipLinks = skipLink ? true : false;
  if (!results.hasSkipLinks) {
    results.issues.push('No skip navigation link found');
  }

  // Check form labels
  const inputs = doc.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const label = id ? doc.querySelector(`label[for="${id}"]`) : doc.querySelector('label');
    if (label) {
      results.formsWithLabels++;
    } else {
      results.formsWithoutLabels++;
      results.issues.push('Form field found without associated label');
    }
  });

  return results;
}

// ============ STRUCTURED DATA UTILITIES ============

/**
 * Check for structured data (JSON-LD, microdata)
 * @param {Document} doc - The document object
 * @returns {Object} Structured data audit results
 */
function checkStructuredData(doc) {
  const results = {
    hasJsonLd: false,
    hasMetadata: false,
    jsonLdCount: 0,
    issues: []
  };

  // Check for JSON-LD
  const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
  results.jsonLdCount = jsonLd.length;
  results.hasJsonLd = results.jsonLdCount > 0;

  // Check for microdata
  const microdata = doc.querySelectorAll('[itemscope]');
  results.hasMetadata = microdata.length > 0;

  if (!results.hasJsonLd && !results.hasMetadata) {
    results.issues.push('No structured data found. Consider adding JSON-LD or microdata for better SEO');
  }

  return results;
}

// ============ MAIN AUDIT FUNCTION ============

/**
 * Run complete website audit
 * @param {Document} doc - The document object (defaults to current document)
 * @returns {Object} Complete audit results
 */
function runFullAudit(doc = document) {
  const audit = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    metaTags: checkMetaTags(doc),
    headings: checkHeadingStructure(doc),
    images: checkImages(doc),
    links: checkLinks(doc),
    performance: checkPerformance(doc),
    accessibility: checkAccessibility(doc),
    structuredData: checkStructuredData(doc),
    summary: {
      totalIssues: 0,
      allIssues: []
    }
  };

  // Collect all issues
  const allIssues = [
    ...audit.metaTags.issues,
    ...audit.headings.issues,
    ...audit.images.issues,
    ...audit.links.issues,
    ...audit.performance.issues,
    ...audit.accessibility.issues,
    ...audit.structuredData.issues
  ];

  audit.summary.totalIssues = allIssues.length;
  audit.summary.allIssues = allIssues;

  return audit;
}

// ============ EXPORT UTILITIES ============

/**
 * Export audit results as JSON
 * @param {Object} auditResults - Results from runFullAudit
 * @returns {string} JSON string of results
 */
function exportAuditJSON(auditResults) {
  return JSON.stringify(auditResults, null, 2);
}

/**
 * Export audit results as HTML report
 * @param {Object} auditResults - Results from runFullAudit
 * @returns {string} HTML string of report
 */
function exportAuditHTML(auditResults) {
  let html = `<h1>Web Audit Report</h1>
<p><strong>URL:</strong> ${auditResults.url}</p>
<p><strong>Date:</strong> ${auditResults.timestamp}</p>
<p><strong>Total Issues:</strong> ${auditResults.summary.totalIssues}</p>

<h2>Meta Tags</h2>
<ul>
<li>Title: ${auditResults.metaTags.titleStatus}</li>
<li>Description: ${auditResults.metaTags.descriptionStatus}</li>
<li>Viewport: ${auditResults.metaTags.hasMetaViewport ? 'Present' : 'Missing'}</li>
</ul>

<h2>Headings</h2>
<ul>
<li>H1 Tags: ${auditResults.headings.h1Count}</li>
<li>Multiple H1: ${auditResults.headings.hasMultipleH1 ? 'Yes' : 'No'}</li>
</ul>

<h2>Images</h2>
<ul>
<li>Total: ${auditResults.images.totalImages}</li>
<li>With Alt Text: ${auditResults.images.imagesWithAlt}</li>
<li>Without Alt Text: ${auditResults.images.imagesWithoutAlt}</li>
</ul>

<h2>Links</h2>
<ul>
<li>Total: ${auditResults.links.totalLinks}</li>
<li>Internal: ${auditResults.links.internalLinks}</li>
<li>External: ${auditResults.links.externalLinks}</li>
</ul>

<h2>Issues Found</h2>
<ol>
${auditResults.summary.allIssues.map(issue => `<li>${issue}</li>`).join('\n')}
</ol>`;
  
  return html;
}

// Make utilities available globally if in browser environment
if (typeof window !== 'undefined') {
  window.webAuditUtils = {
    checkMetaTags,
    checkHeadingStructure,
    checkImages,
    checkLinks,
    checkPerformance,
    checkAccessibility,
    checkStructuredData,
    runFullAudit,
    exportAuditJSON,
    exportAuditHTML
  };
}
