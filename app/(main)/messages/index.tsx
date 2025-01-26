import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"

// Mock data for chats (replace with actual data fetching logic)
const mockChats = [
  { id: "1", name: "Alice", lastMessage: "Hey, how are you?", timestamp: "10:30 AM", unread: 2 },
  { id: "2", name: "Bob", lastMessage: "See you tomorrow!", timestamp: "Yesterday", unread: 0 },
  { id: "3", name: "Group: Friends", lastMessage: "Alice: Let's meet up!", timestamp: "2d ago", unread: 5 },
  // Add more mock chats as needed
]

export default function MessagesScreen() {
  const router = useRouter()
  const [chats, setChats] = useState(mockChats)

  useEffect(() => {
    // Fetch actual chats data here
  }, [])

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/messages/${item.id}`)}>
      <Image
        source={{ uri: "https://placekitten.com/100/100" }} // Replace with actual user image
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  )

  const totalUnreadMessages = chats.reduce((sum, chat) => sum + chat.unread, 0)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {totalUnreadMessages > 0 && (
          <View style={styles.totalUnreadBadge}>
            <Text style={styles.totalUnreadText}>{totalUnreadMessages}</Text>
          </View>
        )}
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
      />
      <TouchableOpacity style={styles.newChatButton} onPress={() => router.push("/messages/new-chat")}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A202C",
  },
  totalUnreadBadge: {
    backgroundColor: "#E53E3E",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalUnreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A202C",
  },
  timestamp: {
    fontSize: 12,
    color: "#718096",
  },
  lastMessage: {
    fontSize: 14,
    color: "#4A5568",
  },
  unreadBadge: {
    backgroundColor: "#E53E3E",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  newChatButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#E53E3E",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
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
})

