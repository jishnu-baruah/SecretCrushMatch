export default {
    expo: {
      name: "SecretCrushApp",
      slug: "SecretCrushApp",
      scheme: "secretcrush",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
      },
      web: {
        bundler: "metro",
      },
      plugins: ["expo-router"],
      extra: {
        clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        eas: {
          projectId: "your-project-id",
        },
      },
    },
  }
  
  