import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';

/**
 * Props for the CustomSwitch component
 * @interface CustomSwitchProps
 * @property {boolean} value - The current state of the switch (on/off)
 * @property {(value: boolean) => void} onValueChange - Callback function called when the switch state changes
 * @property {string} [testID] - Optional test ID for testing purposes
 */
interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

/**
 * A custom switch component that provides a pill-shaped toggle with smooth animation.
 * The switch changes color based on its state and includes a sliding animation for the toggle indicator.
 * 
 * @component
 * @example
 * ```tsx
 * <CustomSwitch
 *   value={isEnabled}
 *   onValueChange={setIsEnabled}
 *   testID="my-switch"
 * />
 * ```
 */
export const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
    // Create an animated value for the toggle position
    const translateX = React.useRef(new Animated.Value(value ? 30 : 4)).current;

    // Update the animation when the value changes
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

/**
 * Styles for the CustomSwitch component
 * @constant
 */
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