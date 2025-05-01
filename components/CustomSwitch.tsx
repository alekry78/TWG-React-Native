import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
    const translateX = React.useRef(new Animated.Value(value ? 30 : 4)).current;

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 30 : 4,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    }, [value]);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
            style={[
                styles.container,
                { backgroundColor: value ? Colors.primary : Colors.secondary }
            ]}
        >
            <Animated.View
                style={[
                    styles.circle,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 66,
        height: 36,
        borderRadius: 16,
        padding: 2,
        justifyContent: 'center',
    },
    circle: {
        width: 28,
        height: 28,
        borderRadius: 100,
        backgroundColor: Colors.white,
    },
}); 