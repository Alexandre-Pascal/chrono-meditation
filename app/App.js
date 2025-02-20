import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Keyboard, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
    const [sessionDuration, setSessionDuration] = useState('20');
    const [intervalDuration, setIntervalDuration] = useState('5');
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [intervalSound, setIntervalSound] = useState();
    const [endSound, setEndSound] = useState();

    async function playIntervalSound() {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/bell.mp3')
        );
        setIntervalSound(sound);
        await sound.playAsync();
    }

    async function playEndSound() {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/bell2.mp3')
        );
        setEndSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return () => {
            if (intervalSound) intervalSound.unloadAsync();
            if (endSound) endSound.unloadAsync();
        };
    }, [intervalSound, endSound]);

    const startNewTimer = () => {
        setTimeLeft(parseInt(sessionDuration) * 60);
        setIsRunning(true);
        setIsPaused(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(parseInt(sessionDuration) * 60);
    };

    const handleMainButtonPress = () => {
        if (!isRunning && !isPaused) {
            startNewTimer();
        } else if (isRunning) {
            setIsRunning(false);
            setIsPaused(true);
        } else if (isPaused) {
            setIsRunning(true);
            setIsPaused(false);
        }
    };

    useEffect(() => {
        let timer = null;
        let intervalTimer = null;

        if (isRunning) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        clearInterval(intervalTimer);
                        setIsRunning(false);
                        setIsPaused(false);
                        playEndSound();
                        ToastAndroid.showWithGravityAndOffset(
                            '🧘‍♂️ Session de méditation terminée !',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            25,
                            50
                        );
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            if (parseInt(sessionDuration) * 60 > parseInt(intervalDuration) * 60) {
                intervalTimer = setInterval(() => {
                    if (timeLeft > parseInt(intervalDuration) * 60) {
                        playIntervalSound();
                    }
                }, parseInt(intervalDuration) * 60 * 1000);
            }
        }

        return () => {
            if (timer) clearInterval(timer);
            if (intervalTimer) clearInterval(intervalTimer);
        };
    }, [isRunning]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getMainButtonText = () => {
        if (!isRunning && !isPaused) return 'Commencer';
        if (isRunning) return 'Pause';
        if (isPaused) return 'Reprendre';
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>Méditation Timer</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Durée de session (minutes):</Text>
                    <TextInput
                        style={styles.input}
                        value={sessionDuration}
                        onChangeText={setSessionDuration}
                        keyboardType="numeric"
                        editable={!isRunning}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Intervalle du son (minutes):</Text>
                    <TextInput
                        style={styles.input}
                        value={intervalDuration}
                        onChangeText={setIntervalDuration}
                        keyboardType="numeric"
                        editable={!isRunning}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                </View>

                <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { flex: 1, marginRight: 10 },
                            isPaused && { backgroundColor: '#4CAF50' }
                        ]}
                        onPress={handleMainButtonPress}
                    >
                        <Text style={styles.buttonText}>
                            {getMainButtonText()}
                        </Text>
                    </TouchableOpacity>

                    {isPaused && (
                        <TouchableOpacity
                            style={[styles.button, { flex: 1, marginLeft: 10, backgroundColor: '#ff6b6b' }]}
                            onPress={resetTimer}
                        >
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 