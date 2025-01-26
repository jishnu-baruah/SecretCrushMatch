import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  FlatList,
  Alert,
  ScrollView,
} from "react-native"
import { useUser } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"

type Crush = {
  id: string
  instagramId: string
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

export default function CrushesScreen() {
  const { user } = useUser()
  const router = useRouter()
  const [crushes, setCrushes] = useState<Crush[]>([])
  const [newCrush, setNewCrush] = useState("")
  const [instagramUrl, setInstagramUrl] = useState("")
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()

    if (user?.unsafeMetadata.crushes) {
      setCrushes(user.unsafeMetadata.crushes as Crush[])
    }
  }, [fadeAnim, user?.unsafeMetadata.crushes])

  const handleAddCrush = async () => {
    if (newCrush.trim() === "") {
      Alert.alert("Error", "Please enter an Instagram ID")
      return
    }

    const updatedCrushes = [...crushes, { id: Date.now().toString(), instagramId: newCrush }]
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          crushes: updatedCrushes,
        },
      })
      setCrushes(updatedCrushes)
      setNewCrush("")
      setInstagramUrl("")
      Alert.alert("Success", "Crush added successfully")
    } catch (err) {
      console.error("Failed to add crush", err)
      Alert.alert("Error", "Failed to add crush. Please try again.")
    }
  }

  const handleRemoveCrush = async (id: string) => {
    const updatedCrushes = crushes.filter((crush) => crush.id !== id)
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          crushes: updatedCrushes,
        },
      })
      setCrushes(updatedCrushes)
      Alert.alert("Success", "Crush removed successfully")
    } catch (err) {
      console.error("Failed to remove crush", err)
      Alert.alert("Error", "Failed to remove crush. Please try again.")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Secret Crushes</Text>
          <Text style={styles.headerSubtitle}>Add and manage your secret crushes</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Add New Crush</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.urlInput]}
                value={instagramUrl}
                onChangeText={(text) => {
                  setInstagramUrl(text)
                  const username = extractInstagramUsername(text)
                  if (username) {
                    setNewCrush(username)
                  }
                }}
                placeholder="Paste Instagram profile URL"
                placeholderTextColor="#A0AEC0"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.idInput]}
                value={newCrush}
                onChangeText={setNewCrush}
                placeholder="Or enter Instagram ID directly"
                placeholderTextColor="#A0AEC0"
              />
              <TouchableOpacity
                style={[styles.addButton, newCrush.trim() ? styles.addButtonActive : styles.addButtonInactive]}
                onPress={handleAddCrush}
                disabled={!newCrush.trim()}
              >
                <FontAwesome name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

         

          <View style={styles.listSection}>
            <Text style={styles.listTitle}>Your Crushes ({crushes.length})</Text>
            <FlatList
              data={crushes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Animated.View style={styles.crushItem} entering={Animated.FadeInRight} exiting={Animated.FadeOutLeft}>
                  <View style={styles.crushInfo}>
                    <FontAwesome name="instagram" size={20} color="#E1306C" style={styles.instagramIcon} />
                    <Text style={styles.crushText}>{item.instagramId}</Text>
                  </View>
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveCrush(item.id)}>
                    <FontAwesome name="trash" size={16} color="#FF4444" />
                  </TouchableOpacity>
                </Animated.View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <FontAwesome name="heart-o" size={48} color="#CBD5E0" />
                  <Text style={styles.emptyText}>No crushes added yet</Text>
                  <Text style={styles.emptySubtext}>Add your first crush above!</Text>
                </View>
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#718096",
  },
  content: {
    padding: 20,
  },
  inputSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#2D3748",
  },
  urlInput: {
    flex: 1,
    marginBottom: 8,
  },
  idInput: {
    flex: 1,
    marginRight: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonActive: {
    backgroundColor: "#E53E3E",
  },
  addButtonInactive: {
    backgroundColor: "#CBD5E0",
  },
  listSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  crushItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  crushInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  instagramIcon: {
    marginRight: 12,
  },
  crushText: {
    fontSize: 16,
    color: "#2D3748",
    flex: 1,
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#718096",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 4,
  },
})

