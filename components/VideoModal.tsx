import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Video as VideoType } from '@/types/video';
import PersonIcon from '@/assets/images/icons/person-icon.svg';
import LikeIcon from '@/assets/images/icons/likes-icon.svg';
import LeftArrowIcon from '@/assets/images/icons/leftarrow-icon.svg';
import ViewsIcon from '@/assets/images/icons/views-icon.svg';
import ForwardIcon from '@/assets/images/icons/forward-icon.svg';
import BackwardIcon from '@/assets/images/icons/backward-icon.svg';
import PauseIcon from '@/assets/images/icons/pause-icon.svg';
import PlayIcon from '@/assets/images/icons/play-icon.svg';
import VolumeIcon from '@/assets/images/icons/volume-icon.svg';
import FullscreenIcon from '@/assets/images/icons/fullscreen-icon.svg';

interface VideoModalProps {
    video: VideoType | null;
    visible: boolean;
    onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, visible, onClose }) => {
    const videoRef = useRef<VideoRef>(null);
    const background = require('../assets/images/video/broadchurch.mp4');

    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        setIsPlaying(prevState => !prevState);
    };

    const handleForward = () => {
        if (videoRef.current) {
            videoRef.current.seek(10); // Skip 10 seconds forward
        }
    };

    const handleBackward = () => {
        if (videoRef.current) {
            videoRef.current.seek(-10); // Skip 10 seconds backward
        }
    };

    const handleVolume = () => {
        setIsMuted(prevState => !prevState);
    };

    const handleFullscreen = () => {
        setIsFullscreen(prevState => !prevState);
        if (isFullscreen) {
            videoRef.current?.dismissFullscreenPlayer();
        } else {
            videoRef.current?.presentFullscreenPlayer();
        }
    };

    if (!video) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.scrollView}>
                    <View style={styles.videoContainer}>
                        <Video
                            ref={videoRef}
                            source={background}
                            style={styles.video}
                            controls={false}
                            resizeMode="contain"
                            paused={!isPlaying}
                            muted={isMuted}
                            fullscreenAutorotate={true}
                            fullscreenOrientation="landscape"
                            onProgress={({ currentTime }) => setCurrentTime(currentTime)}
                            onLoad={({ duration }) => setDuration(duration)}
                        />
                        <View style={styles.controlsContainer}>
                            <View style={styles.firstRow}>
                                <TouchableOpacity onPress={onClose} style={styles.controlButton}>
                                    <LeftArrowIcon width={20} height={20} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleVolume} style={styles.controlButton}>
                                    <VolumeIcon width={20} height={20} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.secondRow}>
                                <TouchableOpacity onPress={handleBackward} style={[styles.controlButton, { padding: 8 }]}>
                                    <BackwardIcon width={24} height={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
                                    {isPlaying ? <PauseIcon width={24} height={24} /> : <PlayIcon width={24} height={24} />}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleForward} style={[styles.controlButton, { padding: 8 }]}>
                                    <ForwardIcon width={24} height={24} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.thirdRow}>
                                <Text style={styles.timeText}>
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </Text>
                                <TouchableOpacity onPress={handleFullscreen}>
                                    <FullscreenIcon width={24} height={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${(currentTime / duration) * 100}%` }]} />
                        </View>
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
                                        <ViewsIcon width={15} height={15} />
                                        <Text style={styles.statText}>{video.viewCount?.toLocaleString() ?? '0'} views</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <LikeIcon width={15} height={15} />
                                        <Text style={styles.statText}>{video.likeCount?.toLocaleString() ?? '0'} likes</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                    </View>
                </View>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 136,
        height: 32,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    statText: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.white,
        marginTop: 2,
        flex: 1,
        textAlign: 'center',
    },
    channelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    personIcon: {
        padding: 14,
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
    descriptionContainer: {

    },
    description: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
        lineHeight: 12,
        marginBottom: 16,
    },
    notesTitle: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: '#C8C8C8',
    },
    detailsTitle: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: '#C8C8C8',
    },
    detailsTitleText: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        textAlign: 'center',
    },
    notesTitleText: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        textAlign: 'center',
    },
    lowerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    descriptionTitle: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        marginBottom: 8,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    controlButton: {
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 100,
    },
    timeText: {
        color: Colors.white,
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#C8C8C8',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#C71F1F',
    },
    firstRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    secondRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    thirdRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    }
}); 