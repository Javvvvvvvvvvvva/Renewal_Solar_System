# Solar System Explorer - Interactive 3D Experience

A stunning, interactive 3D solar system built with Three.js featuring realistic orbital motion, beautiful UI, and immersive space exploration.

## 🌟 Features

### Realistic Orbital Motion
- **Accurate orbital speeds** based on real astronomical data
- **Proper axial tilts** for each planet
- **Smooth rotation** of planets on their axes
- **Realistic orbital paths** with visual orbit rings

### Interactive UI
- **Planet selection buttons** with cosmic styling
- **Real-time information panels** with detailed planet data
- **Smooth camera transitions** when selecting planets
- **Animation controls** (play/pause, speed adjustment)
- **Responsive design** for all screen sizes

### Visual Enhancements
- **Galaxy particle background** with 10,000 animated stars
- **Ambient lighting** and dynamic shadows
- **Enhanced materials** with proper shininess and reflections
- **Saturn's rings** and Earth's moon
- **Professional tone mapping** for cinematic quality

### User Experience
- **Click-to-select planets** with raycaster detection
- **Smooth camera animations** with easing functions
- **Real-time statistics** (distance, orbital period, rotation period)
- **Modern glassmorphism UI** with backdrop blur effects
- **Keyboard and mouse controls** for navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Controls

### Mouse Controls
- **Left Click**: Select planets
- **Drag**: Rotate camera view
- **Scroll**: Zoom in/out
- **Right Click + Drag**: Pan camera

### UI Controls
- **Planet Buttons**: Click to focus on specific planets
- **Pause/Resume**: Toggle animation
- **Speed Slider**: Adjust animation speed (0.1x to 5x)

## Planet Information

Each planet includes:
- **Detailed descriptions** of characteristics
- **Real orbital periods** and distances
- **Rotation speeds** and axial tilts
- **Visual representations** with accurate textures

### Planets Included
- **Sun**: Central star with dynamic lighting
- **Mercury**: Fastest orbiting planet
- **Venus**: Thick atmosphere, retrograde rotation
- **Earth**: Our home planet with moon
- **Mars**: The Red Planet
- **Jupiter**: Largest gas giant
- **Saturn**: Famous ring system
- **Uranus**: Tilted ice giant
- **Neptune**: Windiest planet

## Technical Details

### Built With
- **Three.js**: 3D graphics library
- **Vite**: Fast build tool
- **Lil-GUI**: Debug interface
- **Modern CSS**: Glassmorphism and gradients

### Performance Features
- **Optimized rendering** with proper culling
- **Efficient particle systems** for background stars
- **Responsive design** for mobile devices
- **Smooth 60fps animations**

### File Structure
```
├── index.html          # Main HTML file
├── script.js           # Three.js application logic
├── style.css           # Modern UI styling
├── package.json        # Dependencies and scripts
├── public/           # Planet texture images
└── readme.md          # This documentation
```

## Customization

### Adding New Planets
1. Add planet data to the `planetData` object in `script.js`
2. Include texture file in the `textures/` folder
3. Update the UI buttons and information

### Modifying Visual Effects
- Adjust particle count in the galaxy background
- Modify lighting intensity and colors
- Change camera transition speeds
- Customize UI colors and styling

### Performance Tuning
- Reduce particle count for lower-end devices
- Adjust shadow map resolution
- Modify texture quality settings
- Optimize geometry detail levels

## Future Enhancements

- [ ] Add more moons and satellites
- [ ] Include asteroid belt
- [ ] Add sound effects and ambient audio
- [ ] Implement VR support
- [ ] Add educational overlays and facts
- [ ] Include time controls (past/future dates)
- [ ] Add spacecraft and missions
- [ ] Implement multiplayer features

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

##  License

This project is open source and available under the MIT License.

##  Acknowledgments

- Three.js community for the excellent 3D library
- NASA for planetary texture images
- Astronomical data sources for accurate orbital information

---

**Explore the cosmos from your browser!** 
