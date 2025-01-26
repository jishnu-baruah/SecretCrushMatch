import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Alert, Image, ScrollView } from "react-native"
import { useAuth, useUser } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    instagramId: user?.unsafeMetadata.instagramId || "",
    instagramUrl: "",
    bio: user?.unsafeMetadata.bio || "",
    interests: user?.unsafeMetadata.interests || "",
    age: user?.unsafeMetadata.age || "",
  })
  const [profileImage, setProfileImage] = useState(user?.imageUrl || "")
  const [fadeAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const handleSignOut = async () => {
    await signOut()
    router.push("/(auth)/sign-in")
  }

  const handleSaveProfile = async () => {
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          ...profileData,
        },
      })
      setIsEditing(false)
      Alert.alert("Success", "Your profile has been updated.")
    } catch (err) {
      console.error("Failed to update profile", err)
      Alert.alert("Error", "Failed to update your profile. Please try again.")
    }
  }

  const extractInstagramUsername = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname === "www.instagram.com" || urlObj.hostname === "instagram.com") {
        const pathname = urlObj.pathname
        if (pathname.startsWith("/")) {
          return pathname.substring(1)
        }
        return null
      }
      return null
    } catch (error) {
      return null
    }
  }

  const handleChangeProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access your photos.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      try {
        await user?.setProfileImage({ file: result.assets[0] })
        setProfileImage(result.assets[0].uri)
        Alert.alert("Success", "Profile picture updated successfully.")
      } catch (err) {
        console.error("Failed to update profile picture", err)
        Alert.alert("Error", "Failed to update profile picture. Please try again.")
      }
    }
  }

  return (
    <ScrollView style={styles.scrollView}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <TouchableOpacity onPress={handleChangeProfilePicture}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <View style={styles.editImageButton}>
              <FontAwesome name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.info}>
            Name: {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.info}>Email: {user?.primaryEmailAddress?.emailAddress}</Text>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={profileData.instagramId}
                onChangeText={(text) => setProfileData({ ...profileData, instagramId: text })}
                placeholder="Enter your Instagram ID"
              />
              <TextInput
                style={styles.input}
                value={profileData.instagramUrl}
                onChangeText={(text) => {
                  setProfileData({ ...profileData, instagramUrl: text })
                  const username = extractInstagramUsername(text)
                  if (username) {
                    setProfileData((prev) => ({ ...prev, instagramId: username }))
                  }
                }}
                placeholder="Paste your Instagram profile URL"
              />
              <TextInput
                style={styles.input}
                value={profileData.bio}
                onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
                placeholder="Enter your bio"
                multiline
              />
              <TextInput
                style={styles.input}
                value={profileData.interests}
                onChangeText={(text) => setProfileData({ ...profileData, interests: text })}
                placeholder="Enter your interests (comma-separated)"
              />
              <TextInput
                style={styles.input}
                value={profileData.age}
                onChangeText={(text) => setProfileData({ ...profileData, age: text })}
                placeholder="Enter your age"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <FontAwesome name="check" size={20} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.info}>Instagram ID: {profileData.instagramId || "Not set"}</Text>
              <Text style={styles.info}>Bio: {profileData.bio || "Not set"}</Text>
              <Text style={styles.info}>Interests: {profileData.interests || "Not set"}</Text>
              <Text style={styles.info}>Age: {profileData.age || "Not set"}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <FontAwesome name="pencil" size={20} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <FontAwesome name="sign-out" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    width: "100%",
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#4299E1",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1A202C",
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: "#4A5568",
  },
  editContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4299E1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#48BB78",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F56565",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
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
})

