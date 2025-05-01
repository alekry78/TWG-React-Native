import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

type SortOption = 'latest' | 'oldest' | 'popular';

interface SortModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (option: SortOption) => void;
    currentSort: SortOption;
}

export const SortModal: React.FC<SortModalProps> = ({
    visible,
    onClose,
    onConfirm,
    currentSort
}) => {
    const [selectedOption, setSelectedOption] = useState<SortOption>(currentSort);

    const handleConfirm = () => {
        onConfirm(selectedOption);
        onClose();
    };

    const RadioOption = ({ value, label }: { value: SortOption; label: string }) => (
        <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setSelectedOption(value)}
        >
            <View style={styles.radioOuter}>
                {selectedOption === value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Sort records by:</Text>

                    <View style={styles.optionsContainer}>
                        <RadioOption value="latest" label="Upload date: Latest" />
                        <RadioOption value="oldest" label="Upload date: Oldest" />
                        <RadioOption value="popular" label="Most Popular" />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirmButton]}>
                            <Text style={[styles.buttonText, styles.confirmButtonText]}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        padding: 24,
        width: '80%',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.white,
        marginBottom: 16,
    },
    optionsContainer: {
        marginBottom: 24,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },
    radioLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    cancelButtonText: {
        color: Colors.secondary,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
    },
    confirmButtonText: {
        color: '#fff',
    },
}); 