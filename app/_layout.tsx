import { Slot, useRouter, useSegments } from "expo-router"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo"
import Constants from "expo-constants"
import * as SecureStore from "expo-secure-store"
import { useEffect } from "react"

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey ?? ""} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  )
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    const inAuthGroup = segments[0] === "(auth)"

    if (isSignedIn && inAuthGroup) {
      router.replace("/(main)/home")
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/sign-in")
    }
  }, [isLoaded, isSignedIn, segments])

  return <Slot />
}

