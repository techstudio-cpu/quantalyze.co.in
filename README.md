# Quantalyze Digital Marketing Agency Website

A modern, responsive, and feature-rich website for Quantalyze Digital Marketing Agency built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### Design & UI
- **Modern & Responsive Design**: Fully responsive layout that looks great on all devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Smooth Animations**: Engaging animations and transitions throughout
- **Gradient Accents**: Beautiful gradient colors for a premium feel
- **Custom Scrollbar**: Styled scrollbar matching the brand theme

### Sections
1. **Hero Section**: Eye-catching hero with CTA buttons, animated background, and key statistics
2. **Services**: Comprehensive service showcase with 12 different offerings
3. **Why Us**: Value propositions highlighting what makes Quantalyze unique
4. **Process**: 5-step workflow showing how we work with clients
5. **Stats Counter**: Animated counters showing key achievements
6. **Brands**: Showcase of client brands and partnerships
7. **Portfolio**: Highlights of recent projects with case studies
8. **Testimonials**: Client reviews and success stories
9. **Newsletter**: Email subscription form
10. **Contact Form**: Full-featured contact form with validation
11. **Footer**: Comprehensive footer with links, social media, and legal information

### Interactive Features
- **Smooth Scrolling Navigation**: Click navigation links to smoothly scroll to sections
- **Floating Contact Button**: Quick access to contact options (WhatsApp, Email, Phone)
- **Mobile Menu**: Responsive mobile navigation with smooth animations
- **Form Validation**: Client-side form validation with React Hook Form
- **EmailJS Integration**: Ready for email sending functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 15.0.0
- **UI Library**: React 19 (RC)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Font Awesome)
- **Forms**: React Hook Form
- **Email**: EmailJS Browser
- **Smooth Scroll**: React Scroll
- **Validation**: Zod

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quantalyze-digital-agency
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### EmailJS Setup (Optional)

To enable the contact form email functionality:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Update the EmailJS credentials in `src/components/Contact.tsx`:

```typescript
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  data,
  'YOUR_PUBLIC_KEY'
);
```

### Dark Mode

Dark mode is implemented using Tailwind CSS classes. The toggle button in the navigation switches between light and dark themes by adding/removing the `dark` class from the document root.

## 📁 Project Structure

```
quantalyze-digital-agency/
├── src/
│   ├── app/
│   │   ├── brands/          # Brands page
│   │   ├── contact/         # Contact page
│   │   ├── portfolio/       # Portfolio page
│   │   ├── services/        # Services page
│   │   ├── testimonials/    # Testimonials page
│   │   ├── why-us/          # Why Us page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   └── components/
│       ├── Navbar.tsx       # Navigation component
│       ├── Hero.tsx         # Hero section
│       ├── Services.tsx     # Services section
│       ├── WhyUs.tsx        # Why Us section
│       ├── Process.tsx      # Process section
│       ├── Stats.tsx        # Animated stats
│       ├── Brands.tsx       # Brands section
│       ├── Portfolio.tsx    # Portfolio section
│       ├── Testimonials.tsx # Testimonials section
│       ├── Newsletter.tsx   # Newsletter section
│       ├── Contact.tsx      # Contact form
│       ├── FloatingContact.tsx # Floating button
│       └── Footer.tsx       # Footer section
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## 🎨 Customization

### Colors

The color scheme uses Tailwind's default colors with custom gradients. To change the primary colors, update the `tailwind.config.ts` file:

```typescript
colors: {
  primary: {
    // Your custom color palette
  }
}
```

### Content

All content is stored directly in the component files. To update:

1. **Services**: Edit the `services` array in `src/components/Services.tsx`
2. **Testimonials**: Edit the `testimonials` array in `src/components/Testimonials.tsx`
3. **Portfolio**: Edit the `projects` array in `src/components/Portfolio.tsx`
4. **Brands**: Edit the `brands` array in `src/components/Brands.tsx`

### Images

The portfolio section uses Unsplash images. Replace them with your own images by updating the `image` property in the `projects` array.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 Key Features Highlights

### Performance
- Next.js 15 with App Router for optimal performance
- Server-side rendering for better SEO
- Image optimization (when using Next.js Image component)
- Code splitting and lazy loading

### Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states

### SEO
- Meta tags configured
- Structured data ready
- Sitemap support with next-sitemap

## 🤝 Contributing

This is a client project for Quantalyze Digital Marketing Agency. For modifications or issues, please contact the development team.

## 👨‍💻 Technology Partner

**Shubham Tiwari**

## 📝 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

## 📧 Support

For support or inquiries:
- Email: info@quantalyze.com
- Phone: +1 (555) 123-4567
- Website: [Quantalyze](http://localhost:3000)

---

Built with ❤️ by Quantalyze Digital Marketing Agency
