import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Video as VideoType } from '@/types/video';
import PersonIcon from '@/assets/images/icons/person-icon.svg';
interface VideoModalProps {
    video: VideoType | null;
    visible: boolean;
    onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, visible, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isNotesOpen, setIsNotesOpen] = useState(false);

    if (!video) return null;
    const videoRef = useRef<VideoRef>(null);
    const background = require('../assets/images/video/broadchurch.mp4');
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
            
                <ScrollView style={styles.scrollView}>
                    <View style={styles.videoContainer}>
                        <Video
                            source={background}
                            style={styles.video}
                            ref={videoRef}
                            controls={true}
                        />
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="arrow-back-circle" size={24} color={"rgba(0,0,0,0.25)"} fill="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{video.title}</Text>
                        <View style={styles.channelContainer}>
                            <View style={styles.personIcon}>
                                <PersonIcon width={20} height={20} fill={Colors.white} />
                            </View>
                            <Text style={styles.channelTitle}>{video.channelTitle}</Text>
                        </View>
                        <View style={styles.lowerContainer}>
                            <TouchableOpacity onPress={() => setIsNotesOpen(false)} style={[styles.detailsTitle, !isNotesOpen && { borderBottomColor: Colors.primary }]}>
                                <Text style={styles.detailsTitleText}>Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsNotesOpen(true)} style={[styles.notesTitle, isNotesOpen && { borderBottomColor: Colors.primary }]}>
                                <Text style={styles.notesTitleText}>Notes</Text>
                            </TouchableOpacity>
                        </View>
                        {!isNotesOpen && (
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.descriptionTitle}>Description</Text>
                                <Text style={styles.description}>{video.description}</Text>
                                <Text style={styles.descriptionTitle}>Statistics</Text>
                                <View style={styles.statsContainer}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="eye-outline" size={20} color={Colors.primary} />
                                        <Text style={styles.statText}>{video.viewCount?.toLocaleString() ?? '0'} views</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Ionicons name="thumbs-up-outline" size={20} color={Colors.primary} />
                                        <Text style={styles.statText}>{video.likeCount?.toLocaleString() ?? '0'} likes</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                       
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        paddingTop: 60,
    },
    closeButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'center',
        width:136,
        height:32,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingHorizontal:8,
        paddingVertical:6,
    },
    statText: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.white,
    },
    channelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    personIcon: {
        padding:14,
        backgroundColor: Colors.primary,
        borderRadius: 100,
    },
    channelTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: Colors.primary,
    },
    date: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.secondary,
    },
    descriptionContainer:{

    },
    description: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
        lineHeight: 12,
        marginBottom:16,
    },
    notesTitle: {
        flex:1,
        borderBottomWidth: 2,
        borderBottomColor: '#C8C8C8',
    },
    detailsTitle: {
        flex:1,
        borderBottomWidth: 2,
        borderBottomColor: '#C8C8C8',
    },
    detailsTitleText:{
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        textAlign: 'center',
    },
    notesTitleText:{
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        textAlign: 'center',
    },
    lowerContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom:16,
    },
    descriptionTitle:{
        fontSize:10,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        marginBottom:8,
    }
}); 