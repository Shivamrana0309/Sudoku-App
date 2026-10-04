import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="list-outline" size={24} color="#4A5568" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="crown-outline" size={24} color="#4A5568" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={24} color="#4A5568" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={40} color="#CBD5E1" />
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileTitle}>Sign in to Sync Data</Text>
              <Text style={styles.profileSubtitle}>Sudoku Time : <Text style={{ color: '#2D3748', fontWeight: '500' }}>0h</Text></Text>
            </View>
          </View>

          {/* Primary Tabs */}
          <View style={styles.primaryTabs}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.primaryTabActive}>
                <Text style={styles.primaryTabTextActive}>Classic Mode</Text>
                <View style={styles.primaryTabUnderline} />
              </View>
              <Text style={styles.primaryTabText}>Daily Challenge</Text>
              <Text style={styles.primaryTabText}>Event</Text>
              <Text style={styles.primaryTabText}>Battle</Text>
            </ScrollView>
          </View>

          {/* Secondary Tags */}
          <View style={styles.secondaryTagsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.secondaryTagsScroll}>
              <View style={styles.tagActive}>
                <Text style={styles.tagTextActive}>Beginner</Text>
              </View>
              <View style={styles.tagInactive}><Text style={styles.tagTextInactive}>Easy</Text></View>
              <View style={styles.tagInactive}><Text style={styles.tagTextInactive}>Medium</Text></View>
              <View style={styles.tagInactive}><Text style={styles.tagTextInactive}>Hard</Text></View>
              <View style={styles.tagInactive}><Text style={styles.tagTextInactive}>Expert</Text></View>
            </ScrollView>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Ionicons name="grid-outline" size={24} color="#0061E0" style={styles.statIcon} />
                <Text style={styles.statLabel}>Games Won</Text>
              </View>
              <Text style={styles.statValue}>0</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Ionicons name="thumbs-up-outline" size={24} color="#0061E0" style={styles.statIcon} />
                <Text style={styles.statLabel}>Perfect Wins</Text>
              </View>
              <Text style={styles.statValue}>0</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Ionicons name="flag-outline" size={24} color="#0061E0" style={styles.statIcon} />
                <Text style={styles.statLabel}>Best Win Streak</Text>
              </View>
              <Text style={styles.statValue}>0</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Ionicons name="time-outline" size={24} color="#0061E0" style={styles.statIcon} />
                <Text style={styles.statLabel}>Best Time</Text>
              </View>
              <Text style={styles.statValue}>--:--</Text>
            </View>
          </View>

          {/* Share Button */}
          <View style={styles.shareContainer}>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons name="share-outline" size={16} color="#718096" />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/main')}>
            <Ionicons name="home-outline" size={24} color="#A0AEC0" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="flash-outline" size={24} color="#A0AEC0" />
            <Text style={styles.navText}>Battle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="compass-outline" size={24} color="#A0AEC0" />
            <Text style={styles.navText}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person" size={24} color="#0061E0" />
            <Text style={[styles.navText, { color: '#0061E0' }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D1E3F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  profileSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 4,
  },
  primaryTabs: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  primaryTabActive: {
    marginRight: 24,
    position: 'relative',
    paddingBottom: 10,
  },
  primaryTabTextActive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  primaryTabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#2D3748',
    borderRadius: 2,
  },
  primaryTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A0AEC0',
    marginRight: 24,
    paddingBottom: 10,
  },
  secondaryTagsContainer: {
    marginBottom: 20,
  },
  secondaryTagsScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tagActive: {
    backgroundColor: '#E6F0FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagTextActive: {
    color: '#0061E0',
    fontWeight: '600',
    fontSize: 14,
  },
  tagInactive: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagTextInactive: {
    color: '#718096',
    fontWeight: '500',
    fontSize: 14,
  },
  statsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  statLeft: {
    alignItems: 'flex-start',
  },
  statIcon: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  shareContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  shareText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#A0AEC0',
    fontWeight: '500',
  },
});
