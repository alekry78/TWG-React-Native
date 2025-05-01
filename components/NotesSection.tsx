import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Note } from '@/types/video';

interface NotesSectionProps {
    videoId: string;
    currentTime: number;
    notes: Note[];
    onAddNote: (note: Omit<Note, 'id'>) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
    videoId,
    currentTime,
    notes,
    onAddNote,
}) => {
    const [noteText, setNoteText] = useState('');
    const [localNotes, setLocalNotes] = useState<Note[]>(notes);

    useEffect(() => {
        loadNotes();
    }, [videoId]);

    useEffect(() => {
        setLocalNotes(notes);
        console.log('notes', notes);
    }, [notes]);

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem(`notes_${videoId}`);
            if (storedNotes) {
                const parsedNotes = JSON.parse(storedNotes);
                setLocalNotes(parsedNotes);
                // Update parent component with loaded notes
                parsedNotes.forEach((note: Note) => {
                    if (!notes.find(n => n.id === note.id)) {
                        onAddNote(note);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const saveNotes = async (updatedNotes: Note[]) => {
        try {
            await AsyncStorage.setItem(`notes_${videoId}`, JSON.stringify(updatedNotes));
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const handleAddNote = () => {
        if (noteText.trim()) {
            const newNote: Note = {
                id: Date.now().toString(),
                text: noteText,
                timestamp: Date.now(),
                videoTime: currentTime,
                videoId,
            };

            const updatedNotes = [...localNotes, newNote];
            setLocalNotes(updatedNotes);
            saveNotes(updatedNotes);
            onAddNote(newNote);
            setNoteText('');
        }
    };

    const formatVideoTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderNoteItem = ({ item: note }: { item: Note }) => (
        <View style={styles.noteItem}>
            <Text style={styles.noteText}>{note.text}</Text>
            <Text style={styles.videoTimestamp}>
                {formatVideoTime(note.videoTime)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={localNotes}
                renderItem={renderNoteItem}
                keyExtractor={(note) => note.id}
                style={styles.notesList}
                contentContainerStyle={styles.notesListContent}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={noteText}
                    onChangeText={setNoteText}
                    placeholder="Enter notes..."
                    placeholderTextColor={Colors.secondary}
                    multiline
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddNote}
                    disabled={!noteText.trim()}
                >
                    <Text style={styles.addButtonText}>Add Note</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    notesList: {
       height:'50%'
    },
    notesListContent: {
        paddingBottom: 8,
    },
    noteItem: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.secondary,
        padding: 12,
        marginBottom: 8,
        width: '100%',
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    noteTimestamp: {
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: Colors.white,
        opacity: 0.7,
    },
    videoTimestamp: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        width:'100%',
        textAlign:'right',
    },
    noteText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
    },
    inputContainer: {
        alignItems: 'center',
        gap: 16,
        marginTop: 16,
    },
    input: {
        width: '100%',
        height: 60,
        backgroundColor: Colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.secondary,
        padding: 8,
        maxHeight: 100,
        color: Colors.primary,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    addButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 256,
        height: 40,
    },
    addButtonDisabled: {
        opacity: 0.5,
    },
    addButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
}); 