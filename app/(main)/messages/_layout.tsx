import React from "react"
import { Stack } from "expo-router"

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          tabBarStyle: { display: "none" },
        }}
      />
      <Stack.Screen name="new-chat" />
    </Stack>
  )
}

