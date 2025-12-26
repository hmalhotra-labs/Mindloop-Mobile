# Mindloop - Mindfulness & Meditation Mobile App

[![React Native](https://img.shields.io/badge/React%20Native-0.72.0-2f855a?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-2f855a?logo=firebase)](https://firebase.google.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

Mindloop is a comprehensive mindfulness and meditation mobile application built with React Native. The app provides users with guided breathing sessions, mood tracking, progress monitoring, and accessibility-first design to support mental wellness and mindfulness practices.

## 🌿 Features

### Mindfulness Sessions
- Guided breathing exercises with configurable durations (1, 3, 5 minutes or custom)
- Visual breathing animations to guide users through sessions
- Ambient sound options to enhance the meditation experience
- Session history and progress tracking

### Mood Tracking
- Intuitive mood selection interface with visual indicators
- Mood history tracking and analysis
- Personalized insights based on mood patterns

### Progress Monitoring
- Streak counters to maintain consistency
- Achievement badges for milestones
- Progress charts and statistics
- Historical session data

### Accessibility Features
- High contrast mode support
- Full screen reader compatibility
- Keyboard navigation support
- WCAG 2.1 AA compliance
- Customizable text sizes and contrast settings

### Authentication & Subscriptions
- Firebase authentication system
- Subscription management with paywall integration
- Content access control based on subscription status
- Secure data storage and retrieval

## 🛠️ Technical Stack

### Core Technologies
- **React Native** 0.72.0 - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript development
- **React Navigation** - Navigation and routing
- **Firebase** - Authentication, Firestore database, and cloud services

### Key Libraries & Services
- **React Native Sound** - Audio playback for ambient sounds
- **AsyncStorage** - Local data persistence
- **Jest** - Testing framework
- **React Native Gesture Handler** - Touch and gesture interactions
- **React Native Reanimated** - Smooth animations

### Architecture Components
- **SessionService** - Core session management with timer functionality
- **AccessibilityContext** - Comprehensive accessibility support
- **AudioService** - Ambient sound management
- **SubscriptionService** - Paywall and subscription handling
- **DatabaseService** - Firebase integration and data management

## 📁 Project Structure

```
mindloop-mobile/
├── src/
│   ├── animations/           # Animation components and utilities
│   ├── components/           # Reusable UI components
│   │   ├── audio/            # Audio controls and sound selection
│   │   ├── breathing/        # Breathing exercise components
│   │   ├── mood/             # Mood tracking components
│   │   ├── navigation/       # Navigation components
│   │   ├── onboarding/       # Onboarding flow components
│   │   ├── progress/         # Progress tracking components
│   │   ├── session/          # Session management components
│   │   └── subscription/     # Subscription and paywall components
│   ├── contexts/             # React contexts (AccessibilityContext)
│   ├── data/                 # Static data and configuration
│   ├── hooks/                # Custom React hooks
│   ├── models/               # TypeScript models (Session, User, Subscription)
│   ├── navigation/           # App navigation structure
│   ├── screens/              # Main app screens
│   ├── services/             # Business logic services
│   └── utils/                # Utility functions and helpers
├── __tests__/                # Test files and test utilities
├── assets/                   # App assets (images, audio files)
├── android/                  # Android native code
└── ios/                      # iOS native code
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native development environment (iOS: Xcode, Android: Android Studio)
- Firebase project configuration

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mindloop-mobile
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your iOS and Android apps to the project
   - Download the configuration files (`google-services.json` for Android, `GoogleService-Info.plist` for iOS)
   - Place them in the appropriate directories:
     - Android: `android/app/google-services.json`
     - iOS: `ios/YourAppName/GoogleService-Info.plist`

4. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

### Running the App

#### Development
```bash
# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

#### Production Build
```bash
# iOS
npx react-native run-ios --configuration Release

# Android
npx react-native run-android --variant=release
```

## 🧪 Testing

The project includes comprehensive test coverage using Jest and React Native Testing Library:

### Running Tests
```bash
# Run all tests
npm test
# or
yarn test

# Run tests with coverage
npm test -- --coverage
# or
yarn test -- --coverage

# Run tests in watch mode
npm test -- --watch
# or
yarn test -- --watch
```

### Test Structure
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions and service integrations
- **Accessibility Tests**: Verify accessibility features and WCAG compliance
- **Service Tests**: Test business logic and API integrations

## 🏗️ Architecture Highlights

### Session Management
The app uses a robust session management system with:
- Configurable session durations
- Real-time timer functionality
- Progress tracking
- Session history persistence

### Accessibility-First Design
Mindloop prioritizes accessibility with:
- High contrast mode implementation
- Screen reader support with proper ARIA labels
- Keyboard navigation for all interactive elements
- WCAG 2.1 AA compliance
- Custom accessibility hooks and utilities

### Data Management
- Firebase Firestore for user data and session history
- AsyncStorage for local preferences and temporary data
- Offline-first approach with data synchronization
- Secure authentication and authorization

### Audio Services
- Ambient sound management during sessions
- Audio file handling and playback controls
- Sound selection interface
- Background audio support

## 🎨 Customization

### Theme Configuration
The app supports theme customization through the AccessibilityContext:
- High contrast mode toggle
- Text size adjustments
- Color scheme preferences
- Visual indicator customizations

### Session Settings
Users can customize:
- Session durations
- Ambient sound preferences
- Breathing animation styles
- Notification settings

## 🤝 Contributing

We welcome contributions to Mindloop! Here's how you can help:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Maintain accessibility-first approach
- Write comprehensive tests for new features
- Update documentation as needed
- Follow existing code style and conventions

### Testing Requirements
- All new features must include unit tests
- Accessibility features must be tested with screen readers
- Integration tests for service interactions
- Visual regression tests for UI components

## 📋 API Documentation

### Core Services

#### SessionService
Manages breathing sessions and timers:
- `startSession(duration: number)`: Start a new session
- `pauseSession()`: Pause current session
- `resumeSession()`: Resume paused session
- `endSession()`: End current session
- `getSessionHistory()`: Get session history

#### AuthService
Handles user authentication:
- `login(email: string, password: string)`: User login
- `register(email: string, password: string)`: User registration
- `logout()`: User logout
- `getCurrentUser()`: Get current user info

#### MoodService
Manages mood tracking:
- `setMood(mood: string, timestamp: Date)`: Set user mood
- `getMoodHistory()`: Get mood history
- `getMoodStats()`: Get mood statistics

## 🚀 Deployment

### Environment Configuration
The app uses different configurations for development, staging, and production:
- Firebase project configurations
- API endpoints
- Feature flags
- Analytics settings

### Build Process
1. Update version numbers in `package.json` and native files
2. Create production builds for both platforms
3. Test on real devices
4. Deploy to app stores using appropriate tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

### Known Issues
- Some accessibility features may have limited support on older devices
- Audio playback may have issues in certain Android environments
- Network connectivity issues may affect data synchronization

## 🙏 Acknowledgments

- Built with React Native and Firebase
- Accessibility guidelines based on WCAG 2.1 standards
- Thanks to all contributors who help make mindfulness accessible to everyone

---

Made with ❤️ for better mental wellness
