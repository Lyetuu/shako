// File: screens/GroupSavings/ScanInviteScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Platform
} from 'react-native';
import {
  Button,
  TextInput,
  Text,
  ActivityIndicator,
  Surface,
  Title,
  Paragraph
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { joinGroupWithCode } from '../../services/api/groupSavings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ScanInviteScreen = () => {
  const navigation = useNavigation();
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState(true);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      // Check if the app was opened with a deep link
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    })();
    
    // Add event listener for deep links
    const linkingListener = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });
    
    return () => {
      // Clean up
      linkingListener.remove();
    };
  }, []);
  
  const handleDeepLink = (url) => {
    // Expected format: yourapp://join-group?code=XXXXXX
    if (url) {
      const regex = /code=([A-Za-z0-9]+)/;
      const match = url.match(regex);
      
      if (match && match[1]) {
        setInviteCode(match[1]);
        setScanMode(false);
      }
    }
  };
  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // Check if the QR code contains a valid invite code
    try {
      // The QR might be a URL or just the code
      if (data.includes('code=')) {
        const regex = /code=([A-Za-z0-9]+)/;
        const match = data.match(regex);
        
        if (match && match[1]) {
          setInviteCode(match[1]);
          setScanMode(false);
        } else {
          Alert.alert('Invalid QR Code', 'This QR code does not contain a valid invite code.');
        }
      } else if (/^[A-Za-z0-9]{6,12}$/.test(data)) {
        // If the QR code is just the code itself (6-12 alphanumeric chars)
        setInviteCode(data);
        setScanMode(false);
      } else {
        Alert.alert('Invalid QR Code', 'This QR code does not contain a valid invite code.');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Failed to process the QR code. Please try again or enter the code manually.');
    }
  };
  
  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter a valid invite code');
      return;
    }
    
    try {
      setLoading(true);
      
      const groupData = await joinGroupWithCode(inviteCode.trim());
      
      Alert.alert(
        'Success',
        `You have joined the group "${groupData.name}"`,
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('GroupDetails', { 
              groupId: groupData._id,
              groupName: groupData.name
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', error.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };
  
  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Icon name="camera-off" size={64} color="#F44336" />
        <Title style={styles.permissionTitle}>Camera Access Required</Title>
        <Paragraph style={styles.permissionText}>
          We need camera access to scan QR codes. Please enable camera access in your device settings.
        </Paragraph>
        <Button 
          mode="contained" 
          onPress={() => Linking.openSettings()}
          style={styles.settingsButton}
        >
          Open Settings
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => setScanMode(false)}
          style={styles.manualButton}
        >
          Enter Code Manually
        </Button>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {scanMode ? (
        <>
          <View style={styles.cameraContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.camera}
            />
            <View style={styles.overlay}>
              <View style={styles.scanWindow} />
            </View>
            <View style={styles.instructions}>
              <Text style={styles.instructionsText}>
                Scan the QR code from the group invitation
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            {scanned && (
              <Button 
                mode="contained" 
                onPress={() => setScanned(false)}
                style={styles.scanButton}
                icon="qrcode-scan"
              >
                Scan Again
              </Button>
            )}
            <Button 
              mode="outlined" 
              onPress={() => setScanMode(false)}
              style={styles.manualEntryButton}
            >
              Enter Code Manually
            </Button>
          </View>
        </>
      ) : (
        <Surface style={styles.manualEntryContainer}>
          <Title style={styles.manualEntryTitle}>Join a Group</Title>
          <Paragraph style={styles.manualEntryDescription}>
            Enter the invitation code you received to join a savings group
          </Paragraph>
          
          <TextInput
            label="Invitation Code"
            value={inviteCode}
            onChangeText={setInviteCode}
            mode="outlined"
            autoCapitalize="characters"
            style={styles.codeInput}
            disabled={loading}
          />
          
          <Button
            mode="contained"
            onPress={handleJoinGroup}
            style={styles.joinButton}
            loading={loading}
            disabled={loading || !inviteCode.trim()}
          >
            Join Group
          </Button>
          
          {hasPermission && (
            <Button
              mode="outlined"
              onPress={() => {
                setScanMode(true);
                setScanned(false);
              }}
              style={styles.scanQrButton}
              icon="qrcode-scan"
            >
              Scan QR Code Instead
            </Button>
          )}
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  settingsButton: {
    marginTop: 24,
    width: '80%',
  },
  manualButton: {
    marginTop: 16,
    width: '80%',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanWindow: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#6200ee',
    backgroundColor: 'transparent',
  },
  instructions: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 8,
  },
  buttonsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  scanButton: {
    marginBottom: 12,
  },
  manualEntryButton: {
    borderColor: '#6200ee',
  },
  manualEntryContainer: {
    flex: 1,
    padding: 24,
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  manualEntryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  manualEntryDescription: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  codeInput: {
    marginBottom: 24,
  },
  joinButton: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  scanQrButton: {
    borderColor: '#6200ee',
  },
});

export default ScanInviteScreen;
