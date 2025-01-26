import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"
import { Audio } from "expo-av"
import EmojiSelector from "react-native-emoji-selector"

// Mock data for messages (replace with actual data fetching logic)
const mockMessages = [
  { id: "1", text: "Hey there!", sender: "them", timestamp: "10:30 AM", type: "text" },
  { id: "2", text: "Hi! How are you?", sender: "me", timestamp: "10:31 AM", type: "text" },
  { id: "3", text: "I'm good, thanks! How about you?", sender: "them", timestamp: "10:32 AM", type: "text" },
  // Add more mock messages as needed
]

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState(mockMessages)
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const flatListRef = useRef(null)

  useEffect(() => {
    // Fetch actual messages data here
  }, [])

  const sendMessage = (text: string, type: "text" | "audio" | "file" = "text") => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type,
    }
    setMessages([...messages, newMessage])
    setInputText("")
  }

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      setRecording(recording)
      setIsRecording(true)
    } catch (err) {
      console.error("Failed to start recording", err)
    }
  }

  const stopRecording = async () => {
    if (!recording) return
    setIsRecording(false)
    await recording.stopAndUnloadAsync()
    const uri = recording.getURI()
    setRecording(null)
    if (uri) {
      sendMessage(uri, "audio")
    }
  }

  const attachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync()
      if (result.type === "success") {
        sendMessage(result.uri, "file")
      }
    } catch (err) {
      console.error("Error picking document", err)
    }
  }

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === "me" ? styles.myMessage : styles.theirMessage]}>
      {item.type === "text" && <Text style={styles.messageText}>{item.text}</Text>}
      {item.type === "audio" && (
        <TouchableOpacity onPress={() => console.log("Play audio", item.text)}>
          <FontAwesome name="play-circle" size={24} color="#1A202C" />
          <Text style={styles.messageText}>Audio message</Text>
        </TouchableOpacity>
      )}
      {item.type === "file" && (
        <TouchableOpacity onPress={() => console.log("Open file", item.text)}>
          <FontAwesome name="file" size={24} color="#1A202C" />
          <Text style={styles.messageText}>File attachment</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowEmojiPicker(true)} style={styles.iconButton}>
          <FontAwesome name="smile-o" size={24} color="#718096" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity onPress={attachFile} style={styles.iconButton}>
          <FontAwesome name="paperclip" size={24} color="#718096" />
        </TouchableOpacity>
        {inputText ? (
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
            <FontAwesome name="send" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.sendButton, isRecording && styles.recordingButton]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <FontAwesome name={isRecording ? "stop-circle" : "microphone"} size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <Modal visible={showEmojiPicker} transparent={true} animationType="slide">
        <View style={styles.emojiPickerContainer}>
          <EmojiSelector
            onEmojiSelected={(emoji) => {
              setInputText(inputText + emoji)
              setShowEmojiPicker(false)
            }}
            columns={8}
            showSearchBar={false}
            category={[]}
            categoryPosition="top"
            categoryColor="#E53E3E"
            showHistory={false}
            showSectionTitles={false}
          />
          <TouchableOpacity style={styles.closeEmojiPicker} onPress={() => setShowEmojiPicker(false)}>
            <FontAwesome name="times" size={24} color="#1A202C" />
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
  },
  placeholder: {
    width: 24,
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E53E3E",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 16,
    color: "#1A202C",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#718096",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    backgroundColor: "#EDF2F7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  iconButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: "#E53E3E",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingButton: {
    backgroundColor: "#48BB78",
  },
  emojiPickerContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "ios" ? 44 : 20,
  },
  closeEmojiPicker: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
})

