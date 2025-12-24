import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-crop-picker';

const API_BASE = 'https://dnyanai-backend-1.onrender.com/api';

const ProfileScreen = ({ route, navigation }) => {
    const {
        email,
        name: initialName,
        className: initialClass,
        stream: initialStream,
        board: initialBoard,
        profilePic: initialProfile,
    } = route.params || {};

    const [name, setName] = useState(initialName || '');
    const [studentClass, setStudentClass] = useState(initialClass || '');
    const [stream, setStream] = useState(initialStream || '');
    const [board, setBoard] = useState(initialBoard || '');
    const [profileBase64, setProfileBase64] = useState(initialProfile || null);
    const [loading, setLoading] = useState(true);
    const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
    const [viewPhotoVisible, setViewPhotoVisible] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!email) throw new Error('Email not found.');
                const token = await AsyncStorage.getItem('userToken');
                if (!token) throw new Error('No token found.');

                const response = await fetch(`${API_BASE}/get-profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();
                if (data.success) {
                    setName(data.name || '');
                    setStudentClass(data.className || '');
                    setStream(data.stream || '');
                    setBoard(data.board || '');
                    setProfileBase64(data.profilePic || null);
                } else {
                    Alert.alert('Error', data.message || 'Failed to fetch profile');
                }
            } catch (err) {
                Alert.alert('Error', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [email]);

    const pickFromGallery = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 500,
                height: 500,
                cropping: true,
                cropperCircleOverlay: true,
                compressImageQuality: 0.7,
                includeBase64: true,
            });
            const base64 = `data:${image.mime};base64,${image.data}`;
            setProfileBase64(base64);
        } catch (error) {
            if (error.message !== 'User cancelled image selection')
                console.log('Gallery Picker Error:', error);
        }
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found.');

            const response = await fetch(`${API_BASE}/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email,
                    name,
                    className: studentClass,
                    stream,
                    board,
                    profilePic: profileBase64,
                }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('✅ Success', 'Profile updated successfully!');
                navigation.navigate('Dashboard', {
                    updated: true,
                    studentEmail: email,
                    studentName: name,
                    studentClass,
                    stream,
                    board,
                    profilePic: profileBase64,
                });
            } else {
                Alert.alert('Error', data.message || 'Update failed.');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userEmail");

        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };


    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6A5AE0" />
                <Text style={{ marginTop: 10, color: '#6A5AE0' }}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#6A5AE0" barStyle="light-content" />

            <LinearGradient colors={['#A18DFF', '#6A5AE0']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
            </LinearGradient>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setPhotoOptionsVisible(true)} style={{ alignItems: 'center' }}>
                        <Image
                            source={
                                profileBase64
                                    ? { uri: profileBase64 }
                                    : require('./../assets/images/user1.png')
                            }
                            style={styles.profileImage}
                        />
                        <Text style={styles.changePhotoText}>View / Change Photo</Text>
                    </TouchableOpacity>
                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#aaa"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={email}
                            editable={false}
                        />

                        <Text style={styles.label}>Class</Text>
                        <View style={styles.pickerWrapper}>
                            <RNPickerSelect
                                onValueChange={setStudentClass}
                                items={[
                                    { label: '11th', value: '11' },
                                    { label: '12th', value: '12' },
                                ]}
                                value={studentClass}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Select Class', value: null }}
                            />
                        </View>

                        <Text style={styles.label}>Stream</Text>
                        <View style={styles.pickerWrapper}>
                            <RNPickerSelect
                                onValueChange={setStream}
                                items={[
                                    { label: 'Science', value: 'Science' },
                                    { label: 'Commerce', value: 'Commerce' },
                                    { label: 'Arts', value: 'Arts' },
                                ]}
                                value={stream}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Select Stream', value: null }}
                            />
                        </View>

                        <Text style={styles.label}>Board</Text>
                        <View style={styles.pickerWrapper}>
                            <RNPickerSelect
                                onValueChange={setBoard}
                                items={[
                                    { label: 'CBSE', value: 'CBSE' },
                                    { label: 'State Board', value: 'State Board' },
                                ]}
                                value={board}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Select Board', value: null }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <LinearGradient colors={['#A18DFF', '#6A5AE0']} style={styles.saveGradient}>
                            <Text style={styles.saveText}>Save Changes</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal transparent visible={photoOptionsVisible} animationType="fade" onRequestClose={() => setPhotoOptionsVisible(false)}>
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setPhotoOptionsVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalOption} onPress={() => { setPhotoOptionsVisible(false); setViewPhotoVisible(true); }}>
                            <Text style={styles.modalOptionText}>View Profile Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={() => { setPhotoOptionsVisible(false); pickFromGallery(); }}>
                            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalOption, { borderTopWidth: 0.5, borderColor: '#ccc' }]} onPress={() => setPhotoOptionsVisible(false)}>
                            <Text style={[styles.modalOptionText, { color: 'red' }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={viewPhotoVisible} transparent animationType="fade" onRequestClose={() => setViewPhotoVisible(false)}>
                <View style={styles.fullScreenContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setViewPhotoVisible(false)}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    <Image
                        source={
                            profileBase64
                                ? { uri: profileBase64 }
                                : require('./../assets/images/user1.png')
                        }
                        style={styles.fullScreenImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9FF' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        height: 100,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: { marginRight: 10 },
    backArrow: { fontSize: 28, color: '#FFF' },
    headerTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
    scrollContent: { padding: 20, alignItems: 'center' },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#6A5AE0' },
    changePhotoText: { color: '#6A5AE0', marginTop: 8, fontWeight: '600' },
    infoContainer: { width: '100%', marginTop: 20 },
    label: { fontSize: 14, color: '#8A8A8A', marginTop: 12 },
    input: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, elevation: 2, marginTop: 4 },
    disabledInput: { backgroundColor: '#F0F0F0', color: '#999' },
    pickerWrapper: { backgroundColor: '#FFFFFF', borderRadius: 12, elevation: 2, marginTop: 4, paddingHorizontal: 10 },
    saveButton: { width: '100%', marginTop: 30 },
    saveGradient: { borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
    saveText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    logoutButton: { marginTop: 20, backgroundColor: '#FF4D4D', paddingVertical: 14, paddingHorizontal: 60, borderRadius: 16, marginBottom: 40 },
    logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
    modalOption: { paddingVertical: 16, borderBottomWidth: 0.5, borderColor: '#eee', alignItems: 'center' },
    modalOptionText: { fontSize: 16, color: '#333' },
    fullScreenContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
    fullScreenImage: { width: '100%', height: '100%' },
    closeButton: { position: 'absolute', top: 40, right: 20, zIndex: 2 },
    closeButtonText: { color: '#fff', fontSize: 26 },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: { fontSize: 16, paddingVertical: 12, color: '#000' },
    inputAndroid: { fontSize: 16, color: '#000' },
});

export default ProfileScreen;
