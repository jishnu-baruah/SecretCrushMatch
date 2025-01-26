import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const crushCount = user?.unsafeMetadata.crushes?.length || 0;

  return (
    <ScrollView style={styles.scrollView}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
          <Text style={styles.welcome}>Welcome, {user?.firstName || 'User'}!</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Your Secret Crush Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{crushCount}</Text>
              <Text style={styles.statLabel}>Crushes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(main)/crushes')}
          >
            <FontAwesome name="heart" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Manage Crushes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(main)/profile')}
          >
            <FontAwesome name="user" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/(main)/messages')}
          >
            <FontAwesome name="envelope" size={20} color="#E53E3E" style={styles.icon} />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Messages</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4A5568',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53E3E',
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53E3E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E53E3E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#E53E3E',
  },
  icon: {
    marginRight: 8,
  },
});
