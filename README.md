# WebAudit - SEO Web Audit Tool

A comprehensive web audit tool for analyzing website performance, SEO metrics, accessibility, and best practices.

## Features

- 🔍 **SEO Analysis** - Meta tags, heading structure, keyword analysis
- ⚡ **Performance Metrics** - Page load time, Core Web Vitals, optimization suggestions
- ♿ **Accessibility Audit** - WCAG compliance, accessibility issues
- 🔗 **Link Analysis** - Internal/external links, broken link detection
- 📱 **Mobile Responsiveness** - Mobile-friendly analysis
- 📊 **Detailed Reports** - Generate audit reports with actionable insights

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts a local development server at `http://localhost:8080`

### Running Tests

```bash
npm test
```

### Build

```bash
npm run build
```

## Project Structure

```
webaudit/
├── index.html                 # Main dashboard UI
├── seo-dashboard.html         # SEO metrics dashboard
├── src/
│   ├── js/
│   │   ├── auditors/
│   │   │   ├── seo-auditor.js
│   │   │   ├── performance-auditor.js
│   │   │   ├── accessibility-auditor.js
│   │   │   ├── link-auditor.js
│   │   │   └── mobile-auditor.js
│   │   ├── utils/
│   │   │   ├── validator.js
│   │   │   └── report-generator.js
│   │   └── app.js             # Main application logic
│   ├── css/
│   │   └── styles.css
│   └── data/
│       └── audit-rules.json
├── package.json
├── .gitignore
└── README.md
```

## Usage

1. **Enter Website URL** - Input the website you want to audit
2. **Run Audit** - Click "Start Audit" to begin analysis
3. **View Results** - Review detailed findings in different categories
4. **Export Report** - Download audit results as PDF or JSON

## Audit Categories

### SEO Audit
- Meta tags (title, description, keywords)
- Heading hierarchy (H1, H2, H3)
- Image alt text
- URL structure
- Schema markup
- Robots.txt and sitemap

### Performance Audit
- Page load time
- Core Web Vitals (LCP, FID, CLS)
- Image optimization
- CSS/JavaScript minification
- Caching recommendations

### Accessibility Audit
- WCAG 2.1 compliance
- Color contrast ratios
- Form labels and validation
- Keyboard navigation
- Screen reader compatibility

### Link Audit
- Internal link count
- External links
- Broken links detection
- Redirect chains
- Anchor text quality

### Mobile Audit
- Mobile viewport configuration
- Mobile-friendly text sizing
- Touch target sizing
- Mobile performance

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier
- **HTTP Requests**: Axios

## API Integration

This tool can integrate with:
- Google Lighthouse API
- Google PageSpeed Insights
- Axe Accessibility API
- Custom audit endpoints

## License

MIT

## Author

nethanbenogie-code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

For bugs and feature requests, please open an issue on GitHub.
