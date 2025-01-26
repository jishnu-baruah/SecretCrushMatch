import React, { useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { useOAuth } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function SignInScreen() {
  const router = useRouter()
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" })
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: "oauth_facebook" })

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(width)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim]) // Added fadeAnim to dependencies

  const handleSignIn = async (provider: "google" | "facebook") => {
    try {
      const startOAuthFlow = provider === "google" ? startGoogleOAuthFlow : startFacebookOAuthFlow
      const { createdSessionId, setActive } = await startOAuthFlow()
      if (createdSessionId) {
        setActive({ session: createdSessionId })
        router.push("/(main)/home")
      }
    } catch (err) {
      console.error(`${provider} OAuth error`, err)
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.title}>Sign In to Secret Crush</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={() => handleSignIn("google")}>
            <FontAwesome name="google" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.facebookButton]} onPress={() => handleSignIn("facebook")}>
            <FontAwesome name="facebook" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Sign in with Facebook</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
          <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1A202C",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
  signUpLink: {
    color: "#4A5568",
    textDecorationLine: "underline",
    marginTop: 16,
    fontSize: 14,
  },
})

