# 🎬 Animation Guide

Your Riyal Estate website now has comprehensive animations for a modern, smooth user experience! Here's how to use them.

## 📚 Available Animations

### Fade Animations
- **`animate-fade-in`** - Simple fade in effect (0.6s)
- **`animate-fade-in-up`** - Fade in while sliding up from bottom (0.8s)
- **`animate-fade-in-down`** - Fade in while sliding down from top (0.8s)
- **`animate-fade-in-left`** - Fade in while sliding from left (0.8s)
- **`animate-fade-in-right`** - Fade in while sliding from right (0.8s)

### Slide Animations
- **`animate-slide-up`** - Slide up from bottom with fade (0.8s)
- **`animate-slide-down`** - Slide down from top with fade (0.8s)
- **`animate-slide-left`** - Slide from left with fade (0.8s)
- **`animate-slide-right`** - Slide from right with fade (0.8s)

### Scale & Rotate Animations
- **`animate-scale-in`** - Scale up from small to normal (0.6s)
- **`animate-rotate-in`** - Rotate while scaling in (0.8s)
- **`animate-flip`** - 3D flip rotation (1s)

### Glow & Pulse Animations
- **`animate-pulse-glow`** - Pulsing glow effect for emphasis (2s loop)
- **`animate-pulse-ring`** - Expanding ring pulse (1.5s)
- **`animate-shadow-pop`** - Shadow expanding outward (0.6s)
- **`animate-bounce`** - Classic bouncing effect (1s loop)

### Stagger Animations
- **`animate-stagger`** - Apply to parent, children fade in with delays
  - Each child gets 0.1s delay increment (1st: 0.1s, 2nd: 0.2s, etc.)
  - Great for lists, grids, and card collections

## 🎯 Usage Examples

### Hero Section - Staggered Entrance
```jsx
<div className="animate-fade-in-down">
  <span>Trusted by 10,000+ Users</span>
</div>

<h1 className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
  Find Your Perfect Property
</h1>

<p className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
  Buy, sell, or rent property...
</p>
```

### Card Grid with Stagger
```jsx
<div className="grid grid-cols-3 gap-6 animate-stagger">
  {properties.map((property) => (
    <div key={property.id} className="animate-fade-in-up">
      {/* Property card content */}
    </div>
  ))}
</div>
```

### List with Individual Animations
```jsx
<ul className="animate-stagger">
  <li className="animate-fade-in-up">Item 1</li>
  <li className="animate-fade-in-up">Item 2</li>
  <li className="animate-fade-in-up">Item 3</li>
</ul>
```

### Button with Glow Effect on Hover
```jsx
<button className="hover:animate-pulse-ring px-6 py-3 rounded-lg">
  Click Me
</button>
```

### Pulsing Feature Cards
```jsx
<div className="card animate-pulse-glow">
  <h3>Featured</h3>
  <p>Premium property listings</p>
</div>
```

## ⏱️ Animation Timing Control

### Using Inline Delays
```jsx
<div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
  This fades in after 0.3 seconds
</div>
```

### Custom Duration (via CSS classes)
Modify durations in `globals.css`:
```css
.animate-custom-slow {
  animation: fadeInUp 1.2s ease-out;
}
```

## 🎨 CSS Classes for Animation

All animations are defined in `globals.css`. Key classes:

```css
/* Fade animations */
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }

/* Slide animations */
.animate-slide-up { animation: slideUp 0.8s ease-out; }

/* Glow effects */
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
```

## 🚀 Where Animations Are Already Applied

✅ **Homepage**
- Hero section badge: `animate-fade-in-down`
- Hero heading: `animate-fade-in-up` with delays
- Stats section: `animate-stagger`
- Browse by Category cards: `animate-stagger` + `animate-fade-in-up`
- Featured Properties grid: `animate-stagger`

✅ **Navigation**
- Navbar: `animate-slide-down` for smooth top entrance

✅ **Property Cards**
- Card entrance: `animate-fade-in-up`
- Card hover effects maintained with smooth transitions

## 💡 Best Practices

1. **Don't Overdo It** - Use animations sparingly; 2-3 per page section is ideal
2. **Stagger for Lists** - Use `animate-stagger` for multiple items to avoid overwhelming
3. **Performance** - Animations run at 60fps; use `will-change: transform` for heavy animations
4. **Accessibility** - Some users may prefer reduced motion; consider adding:
   ```css
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; }
   }
   ```
5. **Delays** - Use delays (0.1s, 0.2s, etc.) to create cascade effects

## 🎬 Keyframes Available

All keyframes are defined in `globals.css` and `tailwind.config.ts`:

- `fadeIn` / `fadeInUp` / `fadeInDown` / `fadeInLeft` / `fadeInRight`
- `slideUp` / `slideDown` / `slideLeft` / `slideRight`
- `scaleIn` / `rotateIn` / `flip`
- `pulse-glow` / `pulse-ring` / `shadow-pop`
- `bounce` / `float` / `shimmer`

## 📱 Responsive Animations

Animations automatically adjust for mobile devices:
- Hero section property card hover: `translateY(-8px)` on mobile, `-12px` on desktop
- Stagger delays work on all screen sizes

## 🔧 Extending Animations

To add custom animations:

1. **Add keyframes to `globals.css`:**
```css
@keyframes custom-animation {
  from { /* start state */ }
  to { /* end state */ }
}
```

2. **Add utility class to `globals.css`:**
```css
.animate-custom {
  animation: custom-animation 1s ease-out;
}
```

3. **Or in `tailwind.config.ts`:**
```js
extend: {
  keyframes: {
    'custom': { /* ... */ }
  },
  animation: {
    'custom': 'custom 1s ease-out'
  }
}
```

## ✨ Current Animation Implementation

- **Total Animations Added**: 20+ unique animations
- **CSS Classes**: 30+ available utility classes
- **Performance**: Optimized with `will-change` and GPU acceleration
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

Enjoy your smooth, modern animations! 🎉
