import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Link, router } from 'expo-router';
import Logo from '@/assets/images/logo.svg';
import { Colors } from '@/constants/Colors';

export default function Login() {
    const handleGuestLogin = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.secondary }]}>
            <View style={styles.content}>
                <Logo width={width * 0.71} height={width * 0.28} />
                <Image
                    source={require('../assets/images/app-icon.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.subtitle, { color: Colors.white }]}>
                        Welcome to the best YouTube-based learning application.
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: Colors.primary }]}
                        onPress={handleGuestLogin}
                    >
                        <Text style={[styles.buttonText, { color: Colors.white }]}>Log in as guest</Text>
                    </TouchableOpacity>
                    <Text style={[styles.text, { color: Colors.white }]}>
                        By continuing, you agree with our{'\n'}
                        <Link href="https://youtube.com" style={[styles.link, { color: Colors.primary }]}>Terms and Conditions</Link> and <Link href="https://youtube.com" style={[styles.link, { color: Colors.primary }]}>Privacy Policy</Link>.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 80,
        paddingBottom: 55,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: width * 0.31,
        height: width * 0.31,
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 22,
        textAlign: 'left',
        marginBottom: 32,
        fontFamily: 'Poppins-SemiBold',
    },
    button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginBottom: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    textContainer: {
        width: '100%',
    },
    link: {
        textDecorationLine: 'underline',
    },
    text: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        textAlign: 'center',
    }
});